"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const VendedorRepositoryImpl_1 = require("../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../infrastructure/repositories/AtividadeRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../infrastructure/repositories/MetaRepositoryImpl");
const MongoDB_1 = require("../infrastructure/database/MongoDB");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function prepareTrainingData() {
    try {
        // Conectar ao MongoDB
        await MongoDB_1.MongoDB.conectar();
        console.log('Conectado ao MongoDB');
        const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
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
        const trainingData = [];
        for (const atividade of atividades) {
            const vendedor = vendedorMap.get(atividade.vendedorId);
            if (!vendedor)
                continue;
            const equipe = equipeMap.get(vendedor.equipeId);
            if (!equipe)
                continue;
            const data = new Date(atividade.data);
            const metaKey = `${vendedor.equipeId}_${data.getMonth()}_${data.getFullYear()}`;
            const meta = metaMap.get(metaKey);
            if (!meta)
                continue;
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
    }
    catch (error) {
        console.error('Erro ao preparar dados de treinamento:', error);
        process.exit(1);
    }
}
function isFeriado(data) {
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
//# sourceMappingURL=prepareTrainingData.js.map