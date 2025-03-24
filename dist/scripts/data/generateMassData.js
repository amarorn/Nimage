"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
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
// Constantes
const META_BASE = 100000; // Meta base mensal por equipe
const PERFIS_VENDEDOR = {
    'ALTO_DESEMPENHO': {
        frequenciaMin: 0.85,
        frequenciaMax: 0.95,
        fatorDesempenhoMin: 1.1,
        fatorDesempenhoMax: 1.3
    },
    'MEDIO_DESEMPENHO': {
        frequenciaMin: 0.70,
        frequenciaMax: 0.85,
        fatorDesempenhoMin: 0.9,
        fatorDesempenhoMax: 1.1
    },
    'BAIXO_DESEMPENHO': {
        frequenciaMin: 0.50,
        frequenciaMax: 0.70,
        fatorDesempenhoMin: 0.6,
        fatorDesempenhoMax: 0.9
    }
};
// Adiciona fatores de variação mensal
const VARIACAO_MENSAL = {
    'Janeiro': 1.2, // Pós-Natal
    'Fevereiro': 0.9, // Carnaval
    'Março': 1.0,
    'Abril': 0.95, // Páscoa
    'Maio': 1.1, // Dia das Mães
    'Junho': 0.9, // Festas Juninas
    'Julho': 0.85, // Férias
    'Agosto': 0.9,
    'Setembro': 1.0,
    'Outubro': 1.15, // Dia das Crianças
    'Novembro': 1.1, // Black Friday
    'Dezembro': 1.3 // Natal
};
const PERFIS_EQUIPE = {
    'ALTO_DESEMPENHO': {
        fatorMetaBase: 1.2,
        distribuicaoVendedores: [2, 1, 1] // 2 alto, 1 médio, 1 baixo
    },
    'MEDIO_DESEMPENHO': {
        fatorMetaBase: 1.0,
        distribuicaoVendedores: [1, 2, 1] // 1 alto, 2 médio, 1 baixo
    },
    'BAIXO_DESEMPENHO': {
        fatorMetaBase: 0.8,
        distribuicaoVendedores: [1, 1, 2] // 1 alto, 1 médio, 2 baixo
    }
};
async function generateData() {
    try {
        console.log('🚀 Iniciando geração de dados de massa...');
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
        // Cria equipes
        console.log('👥 Criando equipes...');
        const nomesEquipes = [
            { nome: 'Equipe Norte', perfil: 'ALTO_DESEMPENHO' },
            { nome: 'Equipe Sul', perfil: 'MEDIO_DESEMPENHO' },
            { nome: 'Equipe Leste', perfil: 'MEDIO_DESEMPENHO' },
            { nome: 'Equipe Oeste', perfil: 'BAIXO_DESEMPENHO' }
        ];
        const equipes = [];
        const equipesParaBulk = [];
        for (const { nome, perfil } of nomesEquipes) {
            const id = (0, uuid_1.v4)();
            const equipe = new Equipe_1.Equipe(id, nome, `PDV ${nome}`, 'São Paulo', 'SP', `Gerente ${nome}`, `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`, `Capitão ${nome}`, `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`);
            equipesParaBulk.push(equipe);
            equipes.push(Object.assign(Object.assign({}, equipe), { perfil }));
        }
        await EquipeModel_1.EquipeModel.insertMany(equipesParaBulk);
        console.log('✅ 4 equipes criadas');
        // Cria vendedores
        console.log('👤 Criando vendedores...');
        const nomesVendedores = [
            'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
            'Carlos Souza', 'Julia Lima', 'Roberto Alves', 'Beatriz Ferreira',
            'Lucas Rodrigues', 'Mariana Silva', 'Rafael Costa', 'Fernanda Santos',
            'Gustavo Oliveira', 'Carolina Lima', 'Daniel Alves', 'Amanda Ferreira'
        ];
        const vendedores = [];
        const vendedoresParaBulk = [];
        let nomeIndex = 0;
        for (const equipe of equipes) {
            const perfilEquipe = PERFIS_EQUIPE[equipe.perfil];
            for (let i = 0; i < 4; i++) {
                const nome = nomesVendedores[nomeIndex++];
                const email = `${nome.toLowerCase().replace(' ', '.')}@nimage.com`;
                const telefone = `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
                const meta = META_BASE * perfilEquipe.fatorMetaBase;
                const cargo = 'Vendedor Pleno';
                const vendedor = new Vendedor_1.Vendedor((0, uuid_1.v4)(), nome, equipe.id, email, telefone, meta, cargo);
                vendedoresParaBulk.push(vendedor);
                vendedores.push(Object.assign(Object.assign({}, vendedor), { perfil: equipe.perfil }));
            }
        }
        await VendedorModel_1.VendedorModel.insertMany(vendedoresParaBulk);
        console.log('✅ 16 vendedores criados (4 por equipe)');
        // Cria metas
        console.log('🎯 Criando metas...');
        const dataInicio = new Date('2023-01-01');
        const dataFim = new Date('2027-12-01');
        const meses = 14;
        const metasParaBulk = [];
        const estatisticasMetas = {
            totalMetas: 0,
            mediaMetasPorEquipe: 0,
            maiorMeta: { valor: 0, equipe: '', mes: '' },
            menorMeta: { valor: Infinity, equipe: '', mes: '' },
            metasPorPerfil: {
                'ALTO_DESEMPENHO': { total: 0, media: 0 },
                'MEDIO_DESEMPENHO': { total: 0, media: 0 },
                'BAIXO_DESEMPENHO': { total: 0, media: 0 }
            }
        };
        for (const equipe of equipes) {
            console.log(`\n📊 Gerando metas para ${equipe.nome} (${equipe.perfil})`);
            const perfilEquipe = PERFIS_EQUIPE[equipe.perfil];
            for (let i = 0; i < meses; i++) {
                const inicioMes = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + i, 1);
                const fimMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);
                const mes = inicioMes.toLocaleString('pt-BR', { month: 'long' });
                const fatorSazonal = VARIACAO_MENSAL[mes] || 1.0;
                const fatorEquipe = perfilEquipe.fatorMetaBase;
                const fatorAleatorio = 0.9 + Math.random() * 0.2;
                const objetivo = Math.round(META_BASE * fatorSazonal * fatorEquipe * fatorAleatorio);
                // Atualiza estatísticas
                estatisticasMetas.totalMetas++;
                estatisticasMetas.metasPorPerfil[equipe.perfil].total++;
                estatisticasMetas.metasPorPerfil[equipe.perfil].media += objetivo;
                if (objetivo > estatisticasMetas.maiorMeta.valor) {
                    estatisticasMetas.maiorMeta = { valor: objetivo, equipe: equipe.nome, mes };
                }
                if (objetivo < estatisticasMetas.menorMeta.valor) {
                    estatisticasMetas.menorMeta = { valor: objetivo, equipe: equipe.nome, mes };
                }
                console.log(`  📅 ${mes}: ${objetivo.toLocaleString('pt-BR')} (${(fatorSazonal * 100).toFixed(0)}% sazonal)`);
                const meta = new Meta_1.Meta((0, uuid_1.v4)(), equipe.id, objetivo, inicioMes);
                metasParaBulk.push(meta);
            }
        }
        // Calcula médias finais
        estatisticasMetas.mediaMetasPorEquipe = estatisticasMetas.totalMetas / equipes.length;
        for (const perfil in estatisticasMetas.metasPorPerfil) {
            const dados = estatisticasMetas.metasPorPerfil[perfil];
            dados.media = dados.total > 0 ? dados.media / dados.total : 0;
        }
        await MetaModel_1.MetaModel.insertMany(metasParaBulk);
        console.log('\n✅ Metas criadas para todas as equipes');
        // Cria atividades
        console.log('📊 Criando atividades...');
        let totalAtividades = 0;
        const atividadesParaBulk = [];
        // Gera datas para todo o período
        const datas = [];
        let dataAtual = new Date(dataInicio);
        while (dataAtual <= dataFim) {
            if (dataAtual.getDay() !== 0) { // Exclui domingos
                datas.push(new Date(dataAtual));
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        for (const vendedor of vendedores) {
            console.log(`\n👤 Processando vendedor: ${vendedor.nome} (${vendedor.perfil})`);
            const perfilVendedor = PERFIS_VENDEDOR[vendedor.perfil];
            const frequencia = perfilVendedor.frequenciaMin +
                (Math.random() * (perfilVendedor.frequenciaMax - perfilVendedor.frequenciaMin));
            const diasComAtividade = Math.floor(datas.length * frequencia);
            const datasVendedor = [...datas]
                .sort(() => Math.random() - 0.5)
                .slice(0, diasComAtividade);
            for (const data of datasVendedor) {
                const equipeVendedor = equipes.find(e => e.id === vendedor.equipeId);
                if (!equipeVendedor)
                    continue;
                const perfilEquipe = PERFIS_EQUIPE[equipeVendedor.perfil];
                const metaDiaria = (META_BASE * perfilEquipe.fatorMetaBase) / 22;
                const fatorDesempenho = perfilVendedor.fatorDesempenhoMin +
                    (Math.random() * (perfilVendedor.fatorDesempenhoMax - perfilVendedor.fatorDesempenhoMin));
                let fatorDiaSemana = 1.0;
                const diaSemana = data.getDay();
                if (diaSemana === 6) {
                    fatorDiaSemana = 1.3;
                }
                else if (diaSemana === 5) {
                    fatorDiaSemana = 1.2;
                }
                const mes = data.toLocaleString('pt-BR', { month: 'long' });
                const fatorMes = VARIACAO_MENSAL[mes] || 1.0;
                const fatorAleatorio = 0.85 + Math.random() * 0.3;
                const docinhosCoco = Math.floor(metaDiaria *
                    fatorDesempenho *
                    fatorDiaSemana *
                    fatorMes *
                    fatorAleatorio);
                const atividade = new Atividade_1.Atividade((0, uuid_1.v4)(), vendedor.id, data, docinhosCoco, docinhosCoco);
                atividadesParaBulk.push(atividade);
                totalAtividades++;
            }
            console.log(`✅ Preparadas ${diasComAtividade} atividades para ${vendedor.nome}`);
        }
        // Insere todas as atividades de uma vez
        console.log('💾 Salvando todas as atividades...');
        await AtividadeModel_1.AtividadeModel.insertMany(atividadesParaBulk);
        console.log(`\n🎉 Total de atividades criadas: ${totalAtividades}`);
        // Resumo final
        console.log('\n📊 RESUMO DA GERAÇÃO DE DADOS');
        console.log('==============================');
        console.log('\n👥 Equipes:');
        console.log(`  • Total: ${equipes.length}`);
        console.log(`  • Distribuição por perfil:`);
        for (const perfil in PERFIS_EQUIPE) {
            const count = equipes.filter(e => e.perfil === perfil).length;
            console.log(`    - ${perfil}: ${count} equipe(s)`);
        }
        console.log('\n👤 Vendedores:');
        console.log(`  • Total: ${vendedores.length}`);
        console.log(`  • Média por equipe: ${(vendedores.length / equipes.length).toFixed(1)}`);
        console.log('\n🎯 Metas:');
        console.log(`  • Total: ${estatisticasMetas.totalMetas}`);
        console.log(`  • Média por equipe: ${estatisticasMetas.mediaMetasPorEquipe.toFixed(1)}`);
        console.log(`  • Maior meta: ${estatisticasMetas.maiorMeta.valor.toLocaleString('pt-BR')} (${estatisticasMetas.maiorMeta.equipe} - ${estatisticasMetas.maiorMeta.mes})`);
        console.log(`  • Menor meta: ${estatisticasMetas.menorMeta.valor.toLocaleString('pt-BR')} (${estatisticasMetas.menorMeta.equipe} - ${estatisticasMetas.menorMeta.mes})`);
        console.log('\n  • Médias por perfil:');
        for (const perfil in estatisticasMetas.metasPorPerfil) {
            const dados = estatisticasMetas.metasPorPerfil[perfil];
            console.log(`    - ${perfil}: ${dados.media.toLocaleString('pt-BR')}`);
        }
        console.log('\n📈 Atividades:');
        console.log(`  • Total: ${totalAtividades}`);
        console.log(`  • Média por vendedor: ${(totalAtividades / vendedores.length).toFixed(1)}`);
        console.log(`  • Média por equipe: ${(totalAtividades / equipes.length).toFixed(1)}`);
        console.log('\n🎉 Geração de dados concluída com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro durante a geração de dados:', error);
        throw error;
    }
}
// Executa a geração de dados
generateData().catch(console.error);
//# sourceMappingURL=generateMassData.js.map