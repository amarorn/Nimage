import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";

export class CriarAtividade {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async executar(dados: { id: string; vendedorId: string; data: Date; docinhosCoco: number }) {
        //console.log("📝 Iniciando criação de atividade com dados:", dados);

        if (!dados.id || !dados.vendedorId || !dados.data || dados.docinhosCoco === undefined) {
            throw new Error('Dados inválidos para criar atividade');
        }

        if (dados.docinhosCoco < 0) {
            throw new Error('Quantidade de docinhos não pode ser negativa');
        }

        const atividade = new Atividade(
            dados.id, 
            dados.vendedorId, 
            dados.data, 
            dados.docinhosCoco
        );
        
        //console.log("🏗️ Atividade instanciada:", atividade);

        await this.atividadeRepo.criar(atividade);
        //console.log("💾 Atividade persistida no banco");

        return atividade;
    }
}