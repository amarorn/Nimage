import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { EquipeModel, IEquipe } from "../database/models/EquipeModel";
import { MongoDB } from "../database/MongoDB";

export class EquipeRepositoryImpl implements EquipeRepository {
    async criar(equipe: Equipe): Promise<void> {
        await MongoDB.trackOperation('criar', 'equipes', async () => {
            await EquipeModel.create({
                id: equipe.id,
                nome: equipe.nome,
                pdv: equipe.pdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerenteNome: equipe.gerenteNome,
                gerenteTelefone: equipe.gerenteTelefone,
                capitaoNome: equipe.capitaoNome,
                capitaoTelefone: equipe.capitaoTelefone,
                temaId: equipe.temaId
            });
        });
    }

    async obterPorId(id: string): Promise<Equipe | null> {
        console.log(`🔍 Buscando equipe por ID: ${id}`);
        return await MongoDB.trackOperation('obterPorId', 'equipes', async () => {
            const equipe = await EquipeModel.findOne({ id });
            if (!equipe) {
                console.log(`❌ Equipe não encontrada: ${id}`);
                return null;
            }
            console.log(`✅ Equipe encontrada: ${id}`);
            return this.toDomain(equipe);
        });
    }

    async obterTodos(skip: number, limit: number): Promise<Equipe[]> {
        console.log(`🔍 Buscando todas as equipes - Skip: ${skip}, Limit: ${limit}`);
        return await MongoDB.trackOperation('obterTodos', 'equipes', async () => {
            try {
                console.log('📝 Executando consulta no MongoDB...');
                const equipes = await EquipeModel.findWithPagination(skip, limit);

                console.log(`✅ ${equipes.length} equipes encontradas`);
                console.log('📊 Dados das equipes:', JSON.stringify(equipes, null, 2));
                
                const equipesConvertidas = equipes.map((equipe: IEquipe) => this.toDomain(equipe));
                console.log('🔄 Equipes convertidas para o domínio:', JSON.stringify(equipesConvertidas, null, 2));
                
                return equipesConvertidas;
            } catch (erro) {
                console.error('❌ Erro ao buscar equipes:', erro);
                throw erro;
            }
        });
    }

    async atualizar(id: string, dados: {
        nome?: string;
        pdv?: string;
        cidade?: string;
        estado?: string;
        gerenteNome?: string;
        gerenteTelefone?: string;
        capitaoNome?: string;
        capitaoTelefone?: string;
        temaId?: string;
    }): Promise<Equipe | null> {
        console.log(`🔄 Atualizando equipe: ${id}`);
        return await MongoDB.trackOperation('atualizar', 'equipes', async () => {
            const equipeAtualizada = await EquipeModel.findOneAndUpdate(
                { id },
                { $set: dados },
                { new: true }
            );

            if (!equipeAtualizada) {
                console.log(`❌ Equipe não encontrada para atualização: ${id}`);
                return null;
            }

            console.log(`✅ Equipe atualizada: ${id}`);
            return this.toDomain(equipeAtualizada);
        });
    }

    async deletar(id: string): Promise<void> {
        console.log(`🗑️ Deletando equipe: ${id}`);
        await MongoDB.trackOperation('deletar', 'equipes', async () => {
            await EquipeModel.deleteOne({ id });
            console.log(`✅ Equipe deletada: ${id}`);
        });
    }

    async deletarTodos(): Promise<void> {
        console.log('🗑️ Deletando todas as equipes');
        await MongoDB.trackOperation('deletarTodos', 'equipes', async () => {
            await EquipeModel.deleteMany({});
            console.log('✅ Todas as equipes foram deletadas');
        });
    }

    async obterTotal(): Promise<number> {
        console.log('🔍 Obtendo total de equipes');
        return await MongoDB.trackOperation('obterTotal', 'equipes', async () => {
            const total = await EquipeModel.countDocuments();
            console.log(`✅ Total de equipes: ${total}`);
            return total;
        });
    }

    private toDomain(equipe: IEquipe): Equipe {
        return new Equipe(
            equipe.id,
            equipe.nome,
            equipe.pdv,
            equipe.cidade,
            equipe.estado,
            equipe.gerenteNome,
            equipe.gerenteTelefone,
            equipe.capitaoNome,
            equipe.capitaoTelefone,
            equipe.temaId
        );
    }
}