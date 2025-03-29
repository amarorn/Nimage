"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("../../infrastructure/database/MongoDB");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const Equipe_1 = require("../../domain/entities/Equipe");
const Vendedor_1 = require("../../domain/entities/Vendedor");
const Meta_1 = require("../../domain/entities/Meta");
const Atividade_1 = require("../../domain/entities/Atividade");
const Tema_1 = require("../../domain/entities/Tema");
const Cargo_1 = require("../../domain/entities/Cargo");
const uuid_1 = require("uuid");
const EquipeModel_1 = require("../../infrastructure/database/models/EquipeModel");
const VendedorModel_1 = require("../../infrastructure/database/models/VendedorModel");
const MetaModel_1 = require("../../infrastructure/database/models/MetaModel");
const AtividadeModel_1 = require("../../infrastructure/database/models/AtividadeModel");
const TemaModel_1 = require("../../infrastructure/database/models/TemaModel");
const CargoModel_1 = require("../../infrastructure/database/models/CargoModel");
const perfisVendedores = [
    // Top Performers (6 vendedores)
    { nome: "João Silva", frequenciaVendas: 0.95, fatorDesempenho: 1.5, consistencia: 1.4, evolucao: 1.2 },
    { nome: "Maria Santos", frequenciaVendas: 0.92, fatorDesempenho: 1.4, consistencia: 1.5, evolucao: 1.15 },
    { nome: "Pedro Oliveira", frequenciaVendas: 0.90, fatorDesempenho: 1.4, consistencia: 1.3, evolucao: 1.1 },
    { nome: "Ana Costa", frequenciaVendas: 0.88, fatorDesempenho: 1.3, consistencia: 1.4, evolucao: 1.2 },
    { nome: "Carlos Souza", frequenciaVendas: 0.85, fatorDesempenho: 1.3, consistencia: 1.3, evolucao: 1.1 },
    { nome: "Julia Lima", frequenciaVendas: 0.82, fatorDesempenho: 1.2, consistencia: 1.4, evolucao: 1.15 },
    // Performers Consistentes (8 vendedores)
    { nome: "Roberto Alves", frequenciaVendas: 0.80, fatorDesempenho: 1.2, consistencia: 1.3, evolucao: 1.1 },
    { nome: "Beatriz Ferreira", frequenciaVendas: 0.78, fatorDesempenho: 1.2, consistencia: 1.2, evolucao: 1.05 },
    { nome: "Lucas Rodrigues", frequenciaVendas: 0.75, fatorDesempenho: 1.1, consistencia: 1.3, evolucao: 1.1 },
    { nome: "Mariana Silva", frequenciaVendas: 0.72, fatorDesempenho: 1.1, consistencia: 1.2, evolucao: 1.05 },
    { nome: "Rafael Costa", frequenciaVendas: 0.70, fatorDesempenho: 1.0, consistencia: 1.2, evolucao: 1.1 },
    { nome: "Fernanda Santos", frequenciaVendas: 0.68, fatorDesempenho: 1.0, consistencia: 1.1, evolucao: 1.05 },
    { nome: "Gustavo Oliveira", frequenciaVendas: 0.65, fatorDesempenho: 0.9, consistencia: 1.2, evolucao: 1.1 },
    { nome: "Carolina Lima", frequenciaVendas: 0.62, fatorDesempenho: 0.9, consistencia: 1.1, evolucao: 1.05 },
    // Performers Intermediários (6 vendedores)
    { nome: "Daniel Alves", frequenciaVendas: 0.60, fatorDesempenho: 0.9, consistencia: 1.0, evolucao: 1.1 },
    { nome: "Amanda Ferreira", frequenciaVendas: 0.58, fatorDesempenho: 0.8, consistencia: 1.1, evolucao: 1.15 },
    { nome: "Bruno Rodrigues", frequenciaVendas: 0.55, fatorDesempenho: 0.8, consistencia: 1.0, evolucao: 1.1 },
    { nome: "Patricia Silva", frequenciaVendas: 0.52, fatorDesempenho: 0.75, consistencia: 0.9, evolucao: 1.05 },
    { nome: "Marcos Costa", frequenciaVendas: 0.50, fatorDesempenho: 0.7, consistencia: 1.0, evolucao: 1.1 },
    { nome: "Carla Santos", frequenciaVendas: 0.48, fatorDesempenho: 0.7, consistencia: 0.9, evolucao: 1.05 }
];
async function generateData() {
    try {
        console.log('🚀 Iniciando geração de dados realistas...');
        // Conecta ao MongoDB
        await MongoDB_1.MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');
        const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        // Limpa dados existentes
        console.log('🧹 Limpando dados existentes...');
        await EquipeModel_1.EquipeModel.deleteMany({});
        await VendedorModel_1.VendedorModel.deleteMany({});
        await MetaModel_1.MetaModel.deleteMany({});
        await AtividadeModel_1.AtividadeModel.deleteMany({});
        await TemaModel_1.TemaModel.deleteMany({});
        await CargoModel_1.CargoModel.deleteMany({});
        // Cria temas
        console.log('🎨 Criando temas...');
        const temas = [
            new Tema_1.Tema((0, uuid_1.v4)(), "Gladiador", "Equipe Gladiador - Força e Determinação", "#FF0000"),
            new Tema_1.Tema((0, uuid_1.v4)(), "Arqueiro", "Equipe Arqueiro - Precisão e Foco", "#00FF00"),
            new Tema_1.Tema((0, uuid_1.v4)(), "Titã", "Equipe Titã - Poder e Resistência", "#0000FF"),
            new Tema_1.Tema((0, uuid_1.v4)(), "Lutador", "Equipe Lutador - Coragem e Persistência", "#FFA500")
        ];
        await TemaModel_1.TemaModel.insertMany(temas);
        console.log('✅ 4 temas criados');
        // Cria cargos
        console.log('👔 Criando cargos...');
        const cargos = [
            new Cargo_1.Cargo((0, uuid_1.v4)(), "Gerente", "Gerente de Equipe", "gerente"),
            new Cargo_1.Cargo((0, uuid_1.v4)(), "Capitão", "Capitão de Equipe", "capitao"),
            new Cargo_1.Cargo((0, uuid_1.v4)(), "Vendedor", "Vendedor de Equipe", "vendedor")
        ];
        await CargoModel_1.CargoModel.insertMany(cargos);
        console.log('✅ 3 cargos criados');
        // Cria equipes
        console.log('👥 Criando equipes...');
        const nomesEquipes = ['Equipe Norte', 'Equipe Sul', 'Equipe Leste', 'Equipe Oeste'];
        const equipes = nomesEquipes.map((nome, index) => new Equipe_1.Equipe((0, uuid_1.v4)(), nome, `PDV ${nome}`, 'São Paulo', 'SP', `Gerente ${nome}`, `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`, `Capitão ${nome}`, `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`, temas[index].id // Usa o ID do tema correspondente
        ));
        // Bulk insert para equipes
        await EquipeModel_1.EquipeModel.insertMany(equipes);
        console.log('✅ 4 equipes criadas');
        // Cria vendedores
        console.log('👤 Criando vendedores...');
        const vendedores = [];
        for (let i = 0; i < equipes.length; i++) {
            const equipe = equipes[i];
            const vendedoresEquipe = perfisVendedores.slice(i * 5, (i + 1) * 5);
            for (const perfil of vendedoresEquipe) {
                vendedores.push(new Vendedor_1.Vendedor((0, uuid_1.v4)(), perfil.nome, equipe.id, `${perfil.nome.toLowerCase().replace(' ', '.')}@nimage.com`, `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`, 100000, 'Vendedor Senior'));
            }
        }
        // Bulk insert para vendedores
        await VendedorModel_1.VendedorModel.insertMany(vendedores);
        console.log('✅ 20 vendedores criados');
        // Cria metas
        console.log('🎯 Criando metas...');
        const dataInicio = new Date('2023-01-01');
        const dataFim = new Date('2026-01-01');
        const meses = 36; // 3 anos
        const metas = [];
        for (const equipe of equipes) {
            for (let i = 0; i < meses; i++) {
                const inicioMes = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + i, 1);
                const fimMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);
                // Base meta aumenta 10% ao ano
                const anosDecorridos = i / 12;
                const baseMeta = 100000 * Math.pow(1.1, anosDecorridos);
                // Fator sazonal (mais vendas em dezembro, menos em janeiro)
                let fatorSazonal = 1.0;
                const mes = inicioMes.getMonth();
                if (mes === 11) { // Dezembro
                    fatorSazonal = 1.4;
                }
                else if (mes === 0) { // Janeiro
                    fatorSazonal = 0.8;
                }
                else if (mes === 5) { // Junho
                    fatorSazonal = 1.2;
                }
                // Fator equipe (varia entre 80% e 120%)
                const fatorEquipe = Math.floor(Math.random() * (120 - 80 + 1) + 80) / 100;
                const objetivo = Math.floor(baseMeta * fatorSazonal * fatorEquipe);
                metas.push(new Meta_1.Meta((0, uuid_1.v4)(), equipe.id, objetivo, inicioMes));
            }
        }
        // Bulk insert para metas
        await MetaModel_1.MetaModel.insertMany(metas);
        console.log('✅ 144 metas criadas');
        // Cria atividades
        console.log('📊 Criando atividades...');
        let totalAtividades = 0;
        // Gera datas para todo o período
        const datas = [];
        let dataAtual = new Date(dataInicio);
        while (dataAtual <= dataFim) {
            datas.push(new Date(dataAtual));
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        const atividades = [];
        for (const vendedor of vendedores) {
            console.log(`\n�� Processando vendedor: ${vendedor.nome}`);
            // Encontra o perfil do vendedor
            const perfil = perfisVendedores.find(p => p.nome === vendedor.nome);
            if (!perfil)
                continue;
            const metasEquipe = metas.filter(meta => meta.equipeId === vendedor.equipeId);
            // Para cada dia do período
            for (const data of datas) {
                // Verifica se o vendedor vendeu neste dia baseado na frequência
                if (Math.random() > perfil.frequenciaVendas)
                    continue;
                const metaMes = metasEquipe.find(meta => meta.data.getMonth() === data.getMonth() &&
                    meta.data.getFullYear() === data.getFullYear());
                if (!metaMes)
                    continue;
                const mediaDiaria = metaMes.objetivo / new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
                // Ajusta a quantidade de docinhos com base no dia da semana
                let fatorDiaSemana = 1.0;
                const diaSemana = data.getDay();
                if (diaSemana === 0 || diaSemana === 6) { // Fim de semana
                    fatorDiaSemana = 1.3; // 30% mais vendas
                }
                else if (diaSemana === 5) { // Sexta-feira
                    fatorDiaSemana = 1.2; // 20% mais vendas
                }
                // Calcula a evolução do vendedor ao longo do tempo
                const anosDecorridos = (data.getTime() - dataInicio.getTime()) / (365 * 24 * 60 * 60 * 1000);
                const fatorEvolucao = 1 + (perfil.evolucao - 1) * (anosDecorridos / 3);
                // Calcula a variação baseada na consistência do vendedor
                const variacao = (Math.random() * 2 - 1) * (1 - perfil.consistencia);
                const fatorVariavel = 1 + variacao;
                const docinhosCoco = Math.floor(mediaDiaria *
                    perfil.fatorDesempenho *
                    fatorDiaSemana *
                    fatorVariavel *
                    fatorEvolucao);
                atividades.push(new Atividade_1.Atividade((0, uuid_1.v4)(), vendedor.id, data, docinhosCoco, Math.floor(docinhosCoco * 0.1) // 10% do valor em follow-ups
                ));
                totalAtividades++;
            }
            console.log(`✅ Processadas atividades para ${vendedor.nome}`);
        }
        // Bulk insert para atividades em lotes de 1000
        const batchSize = 1000;
        for (let i = 0; i < atividades.length; i += batchSize) {
            const batch = atividades.slice(i, i + batchSize);
            await AtividadeModel_1.AtividadeModel.insertMany(batch);
            console.log(`✅ Inseridas ${Math.min(i + batchSize, atividades.length)} de ${atividades.length} atividades`);
        }
        console.log(`\n🎉 Total de atividades criadas: ${totalAtividades}`);
        console.log('🎉 Geração de dados concluída com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro durante a geração de dados:', error);
        throw error;
    }
}
// Executa a geração de dados
generateData().catch(console.error);
//# sourceMappingURL=generateRealisticData.js.map