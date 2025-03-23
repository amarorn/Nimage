import { MongoDB } from '../../../infrastructure/database/MongoDB';
import { AtividadeRepositoryImpl } from '../../../infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../../infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '../../../infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '../../../infrastructure/repositories/MetaRepositoryImpl';
import { FrequenciaVendasService } from '../../../application/services/FrequenciaVendasService';
import { ObterEquipeDadosFull } from '../../../application/use-cases/ObterEquipeDadosFull';
import { AtividadeService } from '../../../application/services/AtividadeService';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function trainSimpleModel() {
    try {
        console.log('\n🚀 Iniciando treinamento do modelo...');
        console.log('===============================================');
        
        // Conectar ao MongoDB
        console.log('\n📊 Conectando ao MongoDB...');
        await MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB com sucesso!');
        
        // Inicializar repositórios
        console.log('\n🔄 Inicializando repositórios...');
        const atividadeRepo = new AtividadeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        
        // Inicializar serviços
        console.log('\n⚙️ Inicializando serviços...');
        const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
        const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);
        const atividadeService = new AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);

        // Buscar todos os vendedores
        console.log('\n👥 Buscando vendedores...');
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        console.log(`✅ Encontrados ${vendedores.length} vendedores para processar`);
        console.log('===============================================');

        // Processar cada vendedor
        for (let i = 0; i < vendedores.length; i++) {
            const vendedor = vendedores[i];
            try {
                console.log(`\n📊 Processando vendedor ${i + 1}/${vendedores.length}: ${vendedor.nome}`);
                console.log('-----------------------------------------------');

                // Buscar dados da equipe
                console.log('🔍 Buscando dados da equipe...');
                const equipe = await equipeRepo.obterPorId(vendedor.equipeId);
                if (!equipe) {
                    console.log('⚠️ Equipe não encontrada, pulando vendedor...');
                    continue;
                }
                console.log(`✅ Equipe encontrada: ${equipe.nome}`);

                // Buscar meta da equipe
                console.log('🎯 Buscando meta da equipe...');
                const meta = await metaRepo.obterPorEquipe(equipe.id);
                if (!meta) {
                    console.log('⚠️ Meta não encontrada, pulando vendedor...');
                    continue;
                }
                console.log(`✅ Meta encontrada: ${meta.objetivo.toLocaleString('pt-BR')}`);

                // Calcular datas para análise (últimos 6 meses)
                console.log('📅 Calculando período de análise...');
                const hoje = new Date();
                const dataFim = hoje;
                const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
                console.log(`Período: ${dataInicio.toLocaleDateString('pt-BR')} até ${dataFim.toLocaleDateString('pt-BR')}`);

                // Buscar atividades do vendedor
                console.log('📊 Buscando atividades do vendedor...');
                const atividades = await atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                console.log(`✅ Encontradas ${atividades.length} atividades`);
                
                // Calcular métricas
                console.log('📈 Calculando métricas...');
                const diasComAtividade = atividades.length;
                const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;

                console.log('\n📊 Métricas calculadas:');
                console.log(`- Dias com atividade: ${diasComAtividade}`);
                console.log(`- Total de docinhos: ${totalDocinhos.toLocaleString('pt-BR')}`);
                console.log(`- Média por dia: ${mediaPorDia.toLocaleString('pt-BR')}`);

                // Calcular FEA e IAP
                console.log('\n⚡ Calculando FEA e IAP...');
                const frequencia = await frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
                const fea = await atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
                const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);

                console.log('\n📊 Indicadores calculados:');
                console.log(`- FEA: ${fea.toFixed(2)}`);
                console.log(`- IAP: ${iap.toFixed(2)}`);

                // Preparar prompt para treinamento
                console.log('\n🔄 Preparando prompt para treinamento...');
                const prompt = `
Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados:
FEA: ${fea.toFixed(2)}
IAP: ${iap.toFixed(2)}
Dias com Atividade: ${diasComAtividade}
Total de Docinhos: ${totalDocinhos}
Média por Dia: ${mediaPorDia.toFixed(2)}
Meta da Equipe: ${meta.objetivo}`;

                // Treinar o modelo
                console.log('\n🤖 Treinando modelo...');
                const command = `ollama run nimage "${prompt}"`;
                const { stdout } = await execAsync(command);
                
                console.log('\n✅ Resposta do modelo:');
                console.log(stdout);
                console.log('-----------------------------------------------');
                
                // Delay para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`\n❌ Erro ao processar vendedor ${vendedor.nome}:`, error);
            }
        }

        console.log('\n🎉 Treinamento concluído com sucesso!');
        console.log('===============================================');
    } catch (error) {
        console.error('\n❌ Erro durante o treinamento:', error);
    }
}

trainSimpleModel().catch(console.error); 