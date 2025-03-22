"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VendedorRepositoryImpl_1 = require("@/infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("@/infrastructure/repositories/AtividadeRepositoryImpl");
const EquipeRepositoryImpl_1 = require("@/infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("@/infrastructure/repositories/MetaRepositoryImpl");
const uuid_1 = require("uuid");
const MongoDB_1 = require("@/infrastructure/database/MongoDB");
async function generateMetas() {
    try {
        // Conectar ao MongoDB
        await MongoDB_1.MongoDB.conectar();
        console.log('Conectado ao MongoDB');
        const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        // Buscar todos os vendedores e suas equipes
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        const equipes = await equipeRepo.obterTodos(0, 1000);
        console.log(`Encontrados ${vendedores.length} vendedores e ${equipes.length} equipes`);
        // Agrupar vendedores por equipe
        const vendedoresPorEquipe = vendedores.reduce((acc, vendedor) => {
            if (!acc[vendedor.equipeId]) {
                acc[vendedor.equipeId] = [];
            }
            acc[vendedor.equipeId].push(vendedor);
            return acc;
        }, {});
        // Gerar metas para cada equipe
        for (const equipe of equipes) {
            const vendedoresEquipe = vendedoresPorEquipe[equipe.id] || [];
            if (vendedoresEquipe.length === 0)
                continue;
            // Buscar todas as atividades da equipe
            const atividadesEquipe = await Promise.all(vendedoresEquipe.map(vendedor => atividadeRepo.obterPorVendedorId(vendedor.id)));
            const todasAtividades = atividadesEquipe.flat();
            if (todasAtividades.length === 0)
                continue;
            // Encontrar o primeiro e último mês com atividades
            const datas = todasAtividades.map(a => a.data);
            const primeiraData = new Date(Math.min(...datas.map(d => d.getTime())));
            const ultimaData = new Date(Math.max(...datas.map(d => d.getTime())));
            // Calcular média de vendas por mês
            const totalVendas = todasAtividades.reduce((sum, atividade) => sum + atividade.docinhosCoco, 0);
            const mesesComAtividade = (ultimaData.getFullYear() - primeiraData.getFullYear()) * 12 +
                (ultimaData.getMonth() - primeiraData.getMonth()) + 1;
            const mediaMensal = totalVendas / mesesComAtividade;
            // Gerar meta para cada mês com atividade
            const dataAtual = new Date(primeiraData);
            while (dataAtual <= ultimaData) {
                const objetivo = Math.round(mediaMensal);
                const meta = {
                    id: (0, uuid_1.v4)(),
                    equipeId: equipe.id,
                    objetivo: objetivo,
                    data: new Date(dataAtual),
                    descricao: "Meta mensal baseada na média histórica de vendas",
                    tipo: "Meta Mensal"
                };
                await metaRepo.criar(meta);
                console.log(`Gerada meta para equipe ${equipe.nome}:`);
                console.log(`- Meta Mensal: ${objetivo} docinhos`);
                console.log(`  Mês: ${dataAtual.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`);
                // Avançar para o próximo mês
                dataAtual.setMonth(dataAtual.getMonth() + 1);
            }
        }
        console.log('\nGeração de metas concluída com sucesso!');
        process.exit(0);
    }
    catch (error) {
        console.error('Erro ao gerar metas:', error);
        process.exit(1);
    }
}
// Executar o script
generateMetas();
//# sourceMappingURL=generateMetas.js.map