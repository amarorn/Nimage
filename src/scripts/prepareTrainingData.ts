import { VendedorRepositoryImpl } from "../infrastructure/repositories/VendedorRepositoryImpl";
import { AtividadeRepositoryImpl } from "../infrastructure/repositories/AtividadeRepositoryImpl";
import { EquipeRepositoryImpl } from "../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../infrastructure/repositories/MetaRepositoryImpl";
import { MongoDB } from "../infrastructure/database/MongoDB";
import * as fs from 'fs';
import * as path from 'path';

interface TrainingData {
    data: string;
    equipe: string;
    vendedor: string;
    docinhosCoco: number;
    meta: number;
    diaSemana: number;
    mes: number;
    diaMes: number;
    feriado: boolean;
}

async function prepareTrainingData() {
    try {
        // Conectar ao MongoDB
        const mongoDB = MongoDB.getInstance();
        await mongoDB.connect();
        console.log('Conectado ao MongoDB');

        const vendedorRepo = new VendedorRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();

        // Buscar todos os dados necessários
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        const equipes = await equipeRepo.obterTodos(0, 1000);
        const atividades = await atividadeRepo.obterTodos(0, 10000);
        const metas = await metaRepo.obterTodos(0, 1000);

        console.log(`Encontrados:
            - ${vendedores.length} vendedores
            - ${equipes.length} equipes
            - ${atividades.length} atividades
            - ${metas.length} metas`);

        // Criar mapas para acesso rápido
        const vendedorMap = new Map(vendedores.map(v => [v.id, v]));
        const equipeMap = new Map(equipes.map(e => [e.id, e]));
        const metaMap = new Map(metas.map(m => [m.equipeId + '_' + m.data.getMonth() + '_' + m.data.getFullYear(), m]));

        // Preparar dados de treinamento
        const trainingData: TrainingData[] = [];

        for (const atividade of atividades) {
            const vendedor = vendedorMap.get(atividade.vendedorId);
            if (!vendedor) continue;

            const equipe = equipeMap.get(vendedor.equipeId);
            if (!equipe) continue;

            const data = new Date(atividade.data);
            const metaKey = `${vendedor.equipeId}_${data.getMonth()}_${data.getFullYear()}`;
            const meta = metaMap.get(metaKey);
            if (!meta) continue;

            // Calcular características da data
            const diaSemana = data.getDay();
            const mes = data.getMonth() + 1;
            const diaMes = data.getDate();
            const feriado = isFeriado(data);

            trainingData.push({
                data: data.toISOString(),
                equipe: equipe.nome,
                vendedor: vendedor.nome,
                docinhosCoco: atividade.docinhosCoco,
                meta: meta.objetivo,
                diaSemana,
                mes,
                diaMes,
                feriado
            });
        }

        // Salvar dados de treinamento
        const outputDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = path.join(outputDir, 'training_data.json');
        fs.writeFileSync(outputFile, JSON.stringify(trainingData, null, 2));

        console.log(`\nDados de treinamento preparados com sucesso!`);
        console.log(`Total de registros: ${trainingData.length}`);
        console.log(`Arquivo salvo em: ${outputFile}`);
        process.exit(0);

    } catch (error) {
        console.error('Erro ao preparar dados de treinamento:', error);
        process.exit(1);
    }
}

function isFeriado(data: Date): boolean {
    // Lista de feriados nacionais (pode ser expandida)
    const feriados = [
        '01-01', // Ano Novo
        '04-21', // Tiradentes
        '05-01', // Dia do Trabalho
        '09-07', // Independência
        '10-12', // Nossa Senhora
        '11-02', // Finados
        '11-15', // Proclamação da República
        '12-25', // Natal
    ];

    const dataFormatada = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    return feriados.includes(dataFormatada);
}

// Executar o script
prepareTrainingData(); 