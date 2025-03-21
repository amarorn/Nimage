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
const MongoDB_1 = require("../../infrastructure/database/MongoDB");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const CriarEquipe_1 = require("../../application/use-cases/CriarEquipe");
const CriarVendedor_1 = require("../../application/use-cases/CriarVendedor");
const CriarAtividade_1 = require("../../application/use-cases/CriarAtividade");
const CriarMeta_1 = require("../../application/use-cases/CriarMeta");
// Constantes para perfis de desempenho
const META_BASE = 60000; // Meta base para todas as equipes
const PERFIS_EQUIPE = {
    ALTO_DESEMPENHO: {
        frequencia: 0.3, // 30% das equipes
        fatorDesempenho: 1.2 // 120% da meta base
    },
    MEDIO_DESEMPENHO: {
        frequencia: 0.4, // 40% das equipes
        fatorDesempenho: 1.0 // 100% da meta base
    },
    BAIXO_DESEMPENHO: {
        frequencia: 0.3, // 30% das equipes
        fatorDesempenho: 0.8 // 80% da meta base
    }
};
const PERFIS_VENDEDOR = {
    ALTO_DESEMPENHO: {
        frequencia: 0.3, // 30% dos vendedores
        fatorDesempenho: 1.2, // 120% da meta individual
        cargo: 'Vendedor Sênior'
    },
    MEDIO_DESEMPENHO: {
        frequencia: 0.4, // 40% dos vendedores
        fatorDesempenho: 1.0, // 100% da meta individual
        cargo: 'Vendedor Pleno'
    },
    BAIXO_DESEMPENHO: {
        frequencia: 0.3, // 30% dos vendedores
        fatorDesempenho: 0.8, // 80% da meta individual
        cargo: 'Vendedor Júnior'
    }
};
// Distribuição de vendedores por equipe baseada no perfil
const DISTRIBUICAO_VENDEDORES = {
    ALTO_DESEMPENHO: {
        ALTO_DESEMPENHO: 2,
        MEDIO_DESEMPENHO: 1,
        BAIXO_DESEMPENHO: 1
    },
    MEDIO_DESEMPENHO: {
        ALTO_DESEMPENHO: 1,
        MEDIO_DESEMPENHO: 2,
        BAIXO_DESEMPENHO: 1
    },
    BAIXO_DESEMPENHO: {
        ALTO_DESEMPENHO: 1,
        MEDIO_DESEMPENHO: 1,
        BAIXO_DESEMPENHO: 2
    }
};
// Função para gerar número aleatório entre min e max
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Função para determinar perfil baseado em frequência
function determinarPerfil(perfis) {
    const rand = Math.random();
    let acumulado = 0;
    for (const [perfil, dados] of Object.entries(perfis)) {
        acumulado += dados.frequencia;
        if (rand <= acumulado) {
            return perfil;
        }
    }
    return Object.keys(perfis)[0];
}
// Função para gerar variação aleatória de desempenho mensal
function gerarVariacaoMensal() {
    // Retorna um fator entre 0.7 e 1.3 (variação de -30% a +30%)
    return 0.7 + Math.random() * 0.6;
}
function generateMassData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🚀 Iniciando geração de massa de dados...');
            // Conectar ao MongoDB
            yield MongoDB_1.MongoDB.conectar();
            console.log('✅ Conectado ao MongoDB');
            // Inicializar repositórios
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
            // Inicializar use cases
            const criarEquipe = new CriarEquipe_1.CriarEquipe(equipeRepo);
            const criarVendedor = new CriarVendedor_1.CriarVendedor(vendedorRepo);
            const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
            const criarMeta = new CriarMeta_1.CriarMeta(metaRepo);
            // Limpar dados existentes
            console.log('🧹 Limpando dados existentes...');
            yield equipeRepo.deletarTodos();
            yield vendedorRepo.deletarTodos();
            yield atividadeRepo.deletarTodos();
            yield metaRepo.deletarTodos();
            console.log('✅ Dados limpos');
            // Criar equipes
            console.log('👥 Criando equipes...');
            const nomesEquipes = [
                { nome: 'Equipe Norte', perfil: determinarPerfil(PERFIS_EQUIPE) },
                { nome: 'Equipe Sul', perfil: determinarPerfil(PERFIS_EQUIPE) },
                { nome: 'Equipe Leste', perfil: determinarPerfil(PERFIS_EQUIPE) },
                { nome: 'Equipe Oeste', perfil: determinarPerfil(PERFIS_EQUIPE) }
            ];
            const equipes = [];
            for (const equipeInfo of nomesEquipes) {
                const equipe = yield criarEquipe.executar({
                    id: `equipe-${random(1000, 9999)}`,
                    nome: equipeInfo.nome,
                    nomepdv: `${equipeInfo.nome} PDV`,
                    cidade: 'São Paulo',
                    estado: 'SP',
                    gerente: `Gerente ${equipeInfo.nome}`,
                    contato_gerente: `(11) 9${random(1000, 9999)}-${random(1000, 9999)}`,
                    capitao: `Capitão ${equipeInfo.nome}`,
                    contato_capitao: `(11) 9${random(1000, 9999)}-${random(1000, 9999)}`
                });
                equipes.push(Object.assign(Object.assign({}, equipe), { perfil: equipeInfo.perfil }));
            }
            console.log('✅ 4 equipes criadas');
            // Criar vendedores
            console.log('👤 Criando vendedores...');
            const nomesVendedores = [
                'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
                'Carlos Souza', 'Julia Lima', 'Roberto Alves', 'Beatriz Ferreira',
                'Lucas Mendes', 'Mariana Costa', 'Rafael Santos', 'Carolina Silva',
                'Gabriel Oliveira', 'Isabela Lima', 'Matheus Alves', 'Laura Ferreira'
            ];
            const vendedores = [];
            for (let i = 0; i < equipes.length; i++) {
                const equipe = equipes[i];
                const distribuicao = DISTRIBUICAO_VENDEDORES[equipe.perfil];
                for (const [perfil, quantidade] of Object.entries(distribuicao)) {
                    for (let j = 0; j < quantidade; j++) {
                        const vendedor = yield criarVendedor.executar({
                            id: `vendedor-${random(1000, 9999)}`,
                            nome: nomesVendedores[i * 4 + j],
                            equipeId: equipe.id,
                            email: `${nomesVendedores[i * 4 + j].toLowerCase().replace(' ', '.')}@empresa.com`,
                            telefone: `(11) 9${random(1000, 9999)}-${random(1000, 9999)}`,
                            meta: META_BASE * PERFIS_VENDEDOR[perfil].fatorDesempenho / 4,
                            cargo: PERFIS_VENDEDOR[perfil].cargo
                        });
                        vendedores.push(Object.assign(Object.assign({}, vendedor), { perfil: perfil }));
                    }
                }
            }
            console.log('✅ 16 vendedores criados');
            // Criar metas para cada equipe
            console.log('🎯 Criando metas...');
            const metas = [];
            for (const equipe of equipes) {
                const meta = yield criarMeta.executar({
                    id: `meta-${random(1000, 9999)}`,
                    equipeId: equipe.id,
                    objetivo: META_BASE * PERFIS_EQUIPE[equipe.perfil].fatorDesempenho,
                    data: new Date()
                });
                metas.push(meta);
            }
            console.log('✅ Metas criadas');
            // Gerar atividades
            console.log('📊 Gerando atividades...');
            const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
            const diasPorMes = 30;
            for (const vendedor of vendedores) {
                const equipe = equipes.find(e => e.id === vendedor.equipeId);
                if (!equipe) {
                    console.error(`❌ Equipe não encontrada para o vendedor ${vendedor.nome}`);
                    continue;
                }
                const metaEquipe = metas.find(m => m.equipeId === equipe.id);
                if (!metaEquipe) {
                    console.error(`❌ Meta não encontrada para a equipe ${equipe.nome}`);
                    continue;
                }
                // Gerar datas para todo o período
                const datas = [];
                for (let mes = 0; mes < meses.length; mes++) {
                    for (let dia = 1; dia <= diasPorMes; dia++) {
                        const data = new Date(2024, mes, dia);
                        if (data.getDay() !== 0) { // Excluir domingos
                            datas.push(data);
                        }
                    }
                }
                // Determinar número de atividades baseado no perfil
                const frequenciaAtividades = {
                    ALTO_DESEMPENHO: 0.85, // 85% dos dias
                    MEDIO_DESEMPENHO: 0.75, // 75% dos dias
                    BAIXO_DESEMPENHO: 0.60 // 60% dos dias
                };
                const numeroAtividades = Math.floor(datas.length * frequenciaAtividades[vendedor.perfil]);
                const diasAleatorios = datas.sort(() => Math.random() - 0.5).slice(0, numeroAtividades);
                // Criar atividades
                for (const data of diasAleatorios) {
                    const mes = meses[data.getMonth()];
                    const diaSemana = data.getDay();
                    // Calcular meta diária
                    const metaDiaria = metaEquipe.objetivo / (diasPorMes - 4); // Excluindo domingos
                    // Ajustar quantidade baseado no dia da semana
                    let multiplicador = 1;
                    if (diaSemana === 6) { // Sábado
                        multiplicador = 1.3; // +30%
                    }
                    else if (diaSemana === 5) { // Sexta
                        multiplicador = 1.2; // +20%
                    }
                    // Calcular fator de desempenho baseado no perfil
                    const fatorDesempenho = PERFIS_VENDEDOR[vendedor.perfil].fatorDesempenho;
                    // Adicionar variação aleatória mensal
                    const variacaoMensal = gerarVariacaoMensal();
                    // Calcular quantidade final
                    const quantidade = Math.round(metaDiaria * multiplicador * fatorDesempenho * variacaoMensal);
                    yield criarAtividade.executar({
                        id: `atividade-${random(1000, 9999)}`,
                        vendedorId: vendedor.id,
                        data: data,
                        docinhosCoco: quantidade
                    });
                }
            }
            console.log('✅ Atividades geradas');
            console.log('🎉 Geração de massa de dados concluída com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro ao gerar massa de dados:', error);
        }
    });
}
// Executa a geração de dados
generateMassData().catch(console.error);
//# sourceMappingURL=generateMassData.js.map