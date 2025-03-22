"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("../../infrastructure/database/MongoDB");
const Equipe_1 = require("../../domain/entities/Equipe");
const Vendedor_1 = require("../../domain/entities/Vendedor");
const Meta_1 = require("../../domain/entities/Meta");
const Atividade_1 = require("../../domain/entities/Atividade");
const EquipeModel_1 = require("../../infrastructure/database/models/EquipeModel");
const VendedorModel_1 = require("../../infrastructure/database/models/VendedorModel");
const MetaModel_1 = require("../../infrastructure/database/models/MetaModel");
const AtividadeModel_1 = require("../../infrastructure/database/models/AtividadeModel");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const uuid_1 = require("uuid");
async function generateTrainingData() {
    try {
        console.log('🚀 Iniciando geração de dados de treinamento...');
        // Conectar ao MongoDB
        await MongoDB_1.MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');
        const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await EquipeModel_1.EquipeModel.deleteMany({});
        await VendedorModel_1.VendedorModel.deleteMany({});
        await MetaModel_1.MetaModel.deleteMany({});
        await AtividadeModel_1.AtividadeModel.deleteMany({});
        // Criar equipes
        console.log('👥 Criando equipes...');
        const equipes = [
            new Equipe_1.Equipe((0, uuid_1.v4)(), 'Equipe Norte', 'PDV Norte', 'São Paulo', 'SP', 'João Silva', '(11) 99999-9999', 'Maria Santos', '(11) 98888-8888'),
            new Equipe_1.Equipe((0, uuid_1.v4)(), 'Equipe Sul', 'PDV Sul', 'Rio de Janeiro', 'RJ', 'Pedro Oliveira', '(11) 97777-7777', 'Ana Costa', '(11) 96666-6666'),
            new Equipe_1.Equipe((0, uuid_1.v4)(), 'Equipe Leste', 'PDV Leste', 'Belo Horizonte', 'MG', 'Carlos Souza', '(11) 95555-5555', 'Julia Lima', '(11) 94444-4444')
        ];
        for (const equipe of equipes) {
            await equipeRepo.criar(equipe);
        }
        // Criar vendedores
        console.log('👤 Criando vendedores...');
        const vendedores = [
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'João Silva', equipes[0].id, 'joao@email.com', '(11) 99999-9999', 100000, 'Vendedor Sênior'),
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'Maria Santos', equipes[0].id, 'maria@email.com', '(11) 98888-8888', 80000, 'Vendedor Pleno'),
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'Pedro Oliveira', equipes[1].id, 'pedro@email.com', '(11) 97777-7777', 90000, 'Vendedor Sênior'),
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'Ana Costa', equipes[1].id, 'ana@email.com', '(11) 96666-6666', 70000, 'Vendedor Júnior'),
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'Carlos Souza', equipes[2].id, 'carlos@email.com', '(11) 95555-5555', 95000, 'Vendedor Sênior'),
            new Vendedor_1.Vendedor((0, uuid_1.v4)(), 'Julia Lima', equipes[2].id, 'julia@email.com', '(11) 94444-4444', 75000, 'Vendedor Pleno')
        ];
        for (const vendedor of vendedores) {
            await vendedorRepo.criar(vendedor);
        }
        // Criar metas
        console.log('🎯 Criando metas...');
        const dataInicio = new Date('2024-01-01');
        const dataFim = new Date('2024-03-01');
        for (const equipe of equipes) {
            const meta = new Meta_1.Meta((0, uuid_1.v4)(), equipe.id, 300000, dataInicio);
            await metaRepo.criar(meta);
        }
        // Criar atividades
        console.log('📊 Criando atividades...');
        let dataAtual = new Date(dataInicio);
        while (dataAtual <= dataFim) {
            if (dataAtual.getDay() !== 0) { // Excluir domingos
                for (const vendedor of vendedores) {
                    const atividade = new Atividade_1.Atividade((0, uuid_1.v4)(), vendedor.id, dataAtual, Math.floor(Math.random() * 5000) + 1000, // Entre 1000 e 6000 docinhos
                    Math.floor(Math.random() * 5000) + 1000);
                    await atividadeRepo.criar(atividade);
                }
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        console.log('🎉 Geração de dados de treinamento concluída com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro durante a geração de dados:', error);
        throw error;
    }
}
generateTrainingData().catch(console.error);
//# sourceMappingURL=generateTrainingData.js.map