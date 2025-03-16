import { VendedorRepositoryImpl } from "../infrastructure/repositories/VendedorRepositoryImpl";
import { AtividadeRepositoryImpl } from "../infrastructure/repositories/AtividadeRepositoryImpl";
import { v4 as uuidv4 } from 'uuid';
import { MongoDB } from "../infrastructure/database/MongoDB";

async function generateTrainingData() {
    try {
        // Conectar ao MongoDB
        await MongoDB.conectar();
        console.log('Conectado ao MongoDB');

        const vendedorRepo = new VendedorRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();

        // Buscar todos os vendedores
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        console.log(`Encontrados ${vendedores.length} vendedores`);

        // Configurar período de 6 meses
        const hoje = new Date();
        const seisMesesAtras = new Date(hoje);
        seisMesesAtras.setMonth(hoje.getMonth() - 6);
        const atividades = [];

        for (const vendedor of vendedores) {
            // Gerar entre 60 e 120 atividades por vendedor (média de 10-20 por mês)
            const numAtividades = Math.floor(Math.random() * 61) + 60;

            for (let i = 0; i < numAtividades; i++) {
                // Gerar data aleatória nos últimos 6 meses
                const data = new Date(
                    seisMesesAtras.getTime() + 
                    Math.random() * (hoje.getTime() - seisMesesAtras.getTime())
                );

                // Gerar quantidade aleatória de docinhos com variação sazonal
                // Mais vendas em fins de semana e feriados
                const diaDaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
                const baseQuantidade = Math.floor(Math.random() * 51) + 30; // Base entre 30 e 80
                let docinhosCoco = baseQuantidade;

                // Aumento nas vendas nos fins de semana
                if (diaDaSemana === 0 || diaDaSemana === 6) {
                    docinhosCoco += Math.floor(baseQuantidade * 0.3); // 30% a mais
                }

                // Variação mensal (mais vendas em datas festivas)
                const mes = data.getMonth();
                if (mes === 5 || mes === 11) { // Junho e Dezembro
                    docinhosCoco += Math.floor(baseQuantidade * 0.2); // 20% a mais
                }

                const atividade = {
                    id: uuidv4(),
                    vendedorId: vendedor.id,
                    data: data,
                    docinhosCoco: docinhosCoco
                };

                atividades.push(atividade);
            }

            console.log(`Geradas ${numAtividades} atividades para o vendedor ${vendedor.nome}`);
        }

        // Ordenar atividades por data
        atividades.sort((a, b) => a.data.getTime() - b.data.getTime());

        // Inserir todas as atividades
        let atividadesInseridas = 0;
        for (const atividade of atividades) {
            await atividadeRepo.criar(atividade);
            atividadesInseridas++;
            if (atividadesInseridas % 100 === 0) {
                console.log(`Progresso: ${atividadesInseridas}/${atividades.length} atividades inseridas`);
            }
        }

        console.log(`\nResumo da geração de dados:`);
        console.log(`Total de vendedores: ${vendedores.length}`);
        console.log(`Total de atividades geradas: ${atividades.length}`);
        console.log(`Período: ${seisMesesAtras.toLocaleDateString()} até ${hoje.toLocaleDateString()}`);
        console.log('Dados de treinamento gerados com sucesso!');

        // Fechar conexão com o MongoDB
        process.exit(0);

    } catch (error) {
        console.error('Erro ao gerar dados de treinamento:', error);
        process.exit(1);
    }
}

// Executar o script
generateTrainingData(); 