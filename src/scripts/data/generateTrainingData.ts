import { MongoDB } from '../../infrastructure/database/MongoDB';
import { Equipe } from '../../domain/entities/Equipe';
import { Vendedor } from '../../domain/entities/Vendedor';
import { Meta } from '../../domain/entities/Meta';
import { Atividade } from '../../domain/entities/Atividade';
import { EquipeModel } from '../../infrastructure/database/models/EquipeModel';
import { VendedorModel } from '../../infrastructure/database/models/VendedorModel';
import { MetaModel } from '../../infrastructure/database/models/MetaModel';
import { AtividadeModel } from '../../infrastructure/database/models/AtividadeModel';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from '../../infrastructure/repositories/MetaRepositoryImpl';
import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';
import { v4 as uuidv4 } from 'uuid';

async function generateTrainingData() {
    try {
        console.log('🚀 Iniciando geração de dados de treinamento...');
        
        // Conectar ao MongoDB
        await MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');

        const equipeRepo = new EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();

        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await EquipeModel.deleteMany({});
        await VendedorModel.deleteMany({});
        await MetaModel.deleteMany({});
        await AtividadeModel.deleteMany({});

        // Criar equipes
        console.log('👥 Criando equipes...');
        const equipes = [
            new Equipe(uuidv4(), 'Equipe Norte', 'PDV Norte', 'São Paulo', 'SP', 'João Silva', '(11) 99999-9999', 'Maria Santos', '(11) 98888-8888'),
            new Equipe(uuidv4(), 'Equipe Sul', 'PDV Sul', 'Rio de Janeiro', 'RJ', 'Pedro Oliveira', '(11) 97777-7777', 'Ana Costa', '(11) 96666-6666'),
            new Equipe(uuidv4(), 'Equipe Leste', 'PDV Leste', 'Belo Horizonte', 'MG', 'Carlos Souza', '(11) 95555-5555', 'Julia Lima', '(11) 94444-4444')
        ];

        for (const equipe of equipes) {
            await equipeRepo.criar(equipe);
        }

        // Criar vendedores
        console.log('👤 Criando vendedores...');
        const vendedores = [
            new Vendedor(uuidv4(), 'João Silva', equipes[0].id, 'joao@email.com', '(11) 99999-9999', 100000, 'Vendedor Sênior'),
            new Vendedor(uuidv4(), 'Maria Santos', equipes[0].id, 'maria@email.com', '(11) 98888-8888', 80000, 'Vendedor Pleno'),
            new Vendedor(uuidv4(), 'Pedro Oliveira', equipes[1].id, 'pedro@email.com', '(11) 97777-7777', 90000, 'Vendedor Sênior'),
            new Vendedor(uuidv4(), 'Ana Costa', equipes[1].id, 'ana@email.com', '(11) 96666-6666', 70000, 'Vendedor Júnior'),
            new Vendedor(uuidv4(), 'Carlos Souza', equipes[2].id, 'carlos@email.com', '(11) 95555-5555', 95000, 'Vendedor Sênior'),
            new Vendedor(uuidv4(), 'Julia Lima', equipes[2].id, 'julia@email.com', '(11) 94444-4444', 75000, 'Vendedor Pleno')
        ];

        for (const vendedor of vendedores) {
            await vendedorRepo.criar(vendedor);
        }

        // Criar metas
        console.log('🎯 Criando metas...');
        const dataInicio = new Date('2024-01-01');
        const dataFim = new Date('2024-03-01');

        for (const equipe of equipes) {
            const meta = new Meta(uuidv4(), equipe.id, 300000, dataInicio);
            await metaRepo.criar(meta);
        }

        // Criar atividades
        console.log('📊 Criando atividades...');
        let dataAtual = new Date(dataInicio);

        while (dataAtual <= dataFim) {
            if (dataAtual.getDay() !== 0) { // Excluir domingos
                for (const vendedor of vendedores) {
                    const atividade = new Atividade(
                        uuidv4(),
                        vendedor.id,
                        dataAtual,
                        Math.floor(Math.random() * 5000) + 1000, // Entre 1000 e 6000 docinhos
                        Math.floor(Math.random() * 5000) + 1000
                    );
                    await atividadeRepo.criar(atividade);
                }
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }

        console.log('🎉 Geração de dados de treinamento concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a geração de dados:', error);
        throw error;
    }
}

generateTrainingData().catch(console.error); 