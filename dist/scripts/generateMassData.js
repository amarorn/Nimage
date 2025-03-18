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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VendedorRepositoryImpl_1 = require("../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../infrastructure/repositories/AtividadeRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../infrastructure/repositories/MetaRepositoryImpl");
const uuid_1 = require("uuid");
const MongoDB_1 = require("../infrastructure/database/MongoDB");
const Equipe_1 = require("../domain/entities/Equipe");
const Vendedor_1 = require("../domain/entities/Vendedor");
const Meta_1 = require("../domain/entities/Meta");
const Atividade_1 = require("../domain/entities/Atividade");
const mongoose_1 = __importDefault(require("mongoose"));
// Configurações
const NUM_EQUIPES = 5;
const VENDEDORES_POR_EQUIPE = 3;
const MESES_SIMULACAO = 12;
const BASE_META_MENSAL = 100000; // R$ 100.000,00
// Perfis de desempenho
const PERFIS = {
    ALTO: { nome: 'Alto Desempenho', multiplicador: 1.5 },
    MEDIO: { nome: 'Médio Desempenho', multiplicador: 1.0 },
    BAIXO: { nome: 'Baixo Desempenho', multiplicador: 0.7 }
};
// Variações sazonais por mês (0 = janeiro, 11 = dezembro)
const VARIACOES_SAZONAIS = {
    0: 0.8, // Janeiro (baixa temporada)
    1: 0.9, // Fevereiro
    2: 1.0, // Março
    3: 1.0, // Abril
    4: 1.0, // Maio
    5: 1.0, // Junho
    6: 1.0, // Julho
    7: 1.0, // Agosto
    8: 1.0, // Setembro
    9: 1.1, // Outubro (alta temporada)
    10: 1.2, // Novembro (alta temporada)
    11: 1.3 // Dezembro (alta temporada)
};
function generateMassData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Conectar ao MongoDB
            yield MongoDB_1.MongoDB.conectar();
            console.log('Conectado ao MongoDB');
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
            const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
            // Criar equipes
            const equipes = [];
            for (let i = 0; i < NUM_EQUIPES; i++) {
                const perfil = Object.values(PERFIS)[i % Object.values(PERFIS).length];
                const equipe = new Equipe_1.Equipe((0, uuid_1.v4)(), `${perfil.nome} ${i + 1}`);
                yield equipeRepo.criar(equipe);
                equipes.push(equipe);
            }
            console.log(`Criadas ${equipes.length} equipes`);
            // Criar vendedores para cada equipe
            const vendedores = [];
            for (const equipe of equipes) {
                for (let i = 0; i < VENDEDORES_POR_EQUIPE; i++) {
                    const vendedor = new Vendedor_1.Vendedor((0, uuid_1.v4)(), `Vendedor ${i + 1} - ${equipe.nome}`, equipe.id, { id: equipe.id, nome: equipe.nome });
                    yield vendedorRepo.criar(vendedor);
                    vendedores.push(vendedor);
                }
            }
            console.log(`Criados ${vendedores.length} vendedores`);
            // Gerar metas e atividades para cada mês
            const dataAtual = new Date();
            for (let mes = 0; mes < MESES_SIMULACAO; mes++) {
                const dataInicio = new Date(dataAtual.getFullYear(), mes, 1);
                const dataFim = new Date(dataAtual.getFullYear(), mes + 1, 0);
                // Criar metas para cada equipe
                for (const equipe of equipes) {
                    const perfil = Object.values(PERFIS).find(p => equipe.nome.includes(p.nome));
                    const metaValor = BASE_META_MENSAL * ((perfil === null || perfil === void 0 ? void 0 : perfil.multiplicador) || 1.0);
                    const meta = new Meta_1.Meta((0, uuid_1.v4)(), equipe.id, metaValor, dataInicio);
                    yield metaRepo.criar(meta);
                }
                // Gerar atividades para cada vendedor
                for (const vendedor of vendedores) {
                    const equipe = equipes.find(e => e.id === vendedor.equipe_id);
                    const perfil = Object.values(PERFIS).find(p => equipe === null || equipe === void 0 ? void 0 : equipe.nome.includes(p.nome));
                    const multiplicadorPerfil = (perfil === null || perfil === void 0 ? void 0 : perfil.multiplicador) || 1.0;
                    const multiplicadorSazonal = VARIACOES_SAZONAIS[mes];
                    // Gerar 20-30 atividades por mês por vendedor
                    const numAtividades = Math.floor(Math.random() * 11) + 20;
                    for (let i = 0; i < numAtividades; i++) {
                        const data = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), Math.floor(Math.random() * dataFim.getDate()) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
                        // Valor base da atividade com variações
                        const valorBase = 5000; // R$ 5.000,00
                        const variacao = 0.8 + Math.random() * 0.4; // 80% a 120% do valor base
                        const valor = valorBase * variacao * multiplicadorPerfil * multiplicadorSazonal;
                        const atividade = new Atividade_1.Atividade((0, uuid_1.v4)(), vendedor.id, data, valor, valor // total_docinhos igual ao valor base
                        );
                        yield atividadeRepo.criar(atividade);
                    }
                }
            }
            console.log('Dados gerados com sucesso!');
        }
        catch (error) {
            console.error('Erro ao gerar dados:', error);
        }
        yield mongoose_1.default.disconnect();
    });
}
// Executar o script
generateMassData();
