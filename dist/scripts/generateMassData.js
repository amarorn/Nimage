"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("../infrastructure/database/MongoDB");
const EquipeRepositoryImpl_1 = require("../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../infrastructure/repositories/AtividadeRepositoryImpl");
const Equipe_1 = require("../domain/entities/Equipe");
const Vendedor_1 = require("../domain/entities/Vendedor");
const Meta_1 = require("../domain/entities/Meta");
const Atividade_1 = require("../domain/entities/Atividade");
const uuid_1 = require("uuid");
const EquipeModel_1 = require("../infrastructure/database/models/EquipeModel");
const VendedorModel_1 = require("../infrastructure/database/models/VendedorModel");
const MetaModel_1 = require("../infrastructure/database/models/MetaModel");
const AtividadeModel_1 = require("../infrastructure/database/models/AtividadeModel");
function generateData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🚀 Iniciando geração de dados de massa...');
            // Conecta ao MongoDB
            yield MongoDB_1.MongoDB.conectar();
            console.log('✅ Conectado ao MongoDB');
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
            const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
            // Limpa dados existentes
            console.log('🧹 Limpando dados existentes...');
            yield EquipeModel_1.EquipeModel.deleteMany({});
            yield VendedorModel_1.VendedorModel.deleteMany({});
            yield MetaModel_1.MetaModel.deleteMany({});
            yield AtividadeModel_1.AtividadeModel.deleteMany({});
            // Cria equipes
            console.log('👥 Criando equipes...');
            const nomesEquipes = ['Equipe Norte', 'Equipe Sul', 'Equipe Leste', 'Equipe Oeste'];
            for (const nome of nomesEquipes) {
                const equipe = new Equipe_1.Equipe((0, uuid_1.v4)(), nome);
                yield equipeRepo.criar(equipe);
            }
            console.log('✅ 4 equipes criadas');
            // Cria vendedores
            console.log('👤 Criando vendedores...');
            const equipes = yield equipeRepo.obterTodos(0, 4);
            const nomesVendedores = [
                'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza',
                'Julia Lima', 'Roberto Alves', 'Beatriz Ferreira', 'Lucas Rodrigues', 'Mariana Silva',
                'Rafael Costa', 'Fernanda Santos', 'Gustavo Oliveira', 'Carolina Lima', 'Daniel Alves',
                'Amanda Ferreira', 'Bruno Rodrigues', 'Patricia Silva', 'Marcos Costa', 'Carla Santos'
            ];
            for (let i = 0; i < equipes.length; i++) {
                const equipe = equipes[i];
                for (let j = 0; j < 5; j++) {
                    const vendedor = new Vendedor_1.Vendedor((0, uuid_1.v4)(), nomesVendedores[i * 5 + j], equipe.id);
                    yield vendedorRepo.criar(vendedor);
                }
            }
            console.log('✅ 20 vendedores criados');
            // Cria metas
            console.log('🎯 Criando metas...');
            const dataInicio = new Date('2024-01-01');
            const dataFim = new Date('2025-02-28');
            const meses = 14;
            for (const equipe of equipes) {
                for (let i = 0; i < meses; i++) {
                    const inicioMes = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + i, 1);
                    const fimMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);
                    const baseMeta = 100000;
                    const fatorSazonal = Math.floor(Math.random() * (130 - 70 + 1) + 70) / 100;
                    const fatorEquipe = Math.floor(Math.random() * (120 - 80 + 1) + 80) / 100;
                    const objetivo = baseMeta * fatorSazonal * fatorEquipe;
                    const meta = new Meta_1.Meta((0, uuid_1.v4)(), equipe.id, objetivo, inicioMes);
                    yield metaRepo.criar(meta);
                }
            }
            console.log('✅ 56 metas criadas');
            // Cria atividades
            console.log('📊 Criando atividades...');
            let totalAtividades = 0;
            const vendedores = yield vendedorRepo.obterTodos(0, 20);
            const metas = yield metaRepo.obterTodos(0, 56);
            // Gera datas para todo o período
            const datas = [];
            let dataAtual = new Date(dataInicio);
            while (dataAtual <= dataFim) {
                datas.push(new Date(dataAtual));
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
            // Calcula quantas atividades cada vendedor terá (70% dos dias do período)
            const totalDias = datas.length;
            const diasPorVendedor = Math.floor(totalDias * 0.7);
            for (const vendedor of vendedores) {
                console.log(`\n👤 Processando vendedor: ${vendedor.nome}`);
                const fatorDesempenho = Math.floor(Math.random() * (150 - 70 + 1) + 70) / 100;
                const metasEquipe = metas.filter(meta => meta.equipeId === vendedor.equipe_id);
                // Cria uma cópia das datas e embaralha para este vendedor
                const datasVendedor = [...datas].sort(() => Math.random() - 0.5).slice(0, diasPorVendedor);
                for (const data of datasVendedor) {
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
                    const docinhosCoco = Math.floor(mediaDiaria *
                        fatorDesempenho *
                        fatorDiaSemana *
                        (Math.floor(Math.random() * (120 - 80 + 1) + 80) / 100));
                    const atividade = new Atividade_1.Atividade((0, uuid_1.v4)(), vendedor.id, data, docinhosCoco, docinhosCoco);
                    yield atividadeRepo.criar(atividade);
                    totalAtividades++;
                }
                console.log(`✅ Criadas ${diasPorVendedor} atividades para ${vendedor.nome}`);
            }
            console.log(`\n🎉 Total de atividades criadas: ${totalAtividades}`);
            console.log('🎉 Geração de dados concluída com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro durante a geração de dados:', error);
            throw error;
        }
    });
}
// Executa a geração de dados
generateData().catch(console.error);
