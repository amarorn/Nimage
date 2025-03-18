import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { SalesService } from '../services/salesService';
import { VendorRepository } from '../repositories/vendorRepository';
import { SalesRepository } from '../repositories/salesRepository';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'nimage';

async function trainModel() {
  const client = new MongoClient(MONGODB_URI);
  const salesService = new SalesService(new VendorRepository(client), new SalesRepository(client));

  try {
    console.log('Conectando ao MongoDB...');
    await client.connect();
    console.log('Conexão estabelecida com sucesso!');

    // Buscar todos os vendedores
    const vendors = await salesService.getAllVendors();
    console.log(`Encontrados ${vendors.length} vendedores para processar`);

    // Processar cada vendedor
    for (const vendor of vendors) {
      try {
        // Calcular métricas do vendedor
        const metrics = await salesService.calculateVendorMetrics(vendor._id);
        
        // Preparar prompt para treinamento
        const prompt = `Analise o desempenho do vendedor ${vendor.name} com base nos seguintes dados:
FEA: ${metrics.fea.toFixed(2)}
IAP: ${metrics.iap.toFixed(2)}
Dias com Atividade: ${metrics.daysWithActivity}
Total de Docinhos: ${metrics.totalSales}
Média por Dia: ${metrics.averagePerDay.toFixed(2)}
Meta da Equipe: ${metrics.teamGoal}`;

        // Preparar resposta estruturada
        const response = {
          perfil_vendas: `Vendedor ${metrics.fea >= 1.5 ? 'alto' : metrics.fea >= 1.0 ? 'intermediário' : 'iniciante'} com ${metrics.fea >= 1.5 ? 'excelente' : metrics.fea >= 1.0 ? 'boa' : 'performance em desenvolvimento'} performance`,
          tendencias: [
            `Tendência de ${metrics.fea >= 1.5 ? 'crescimento acelerado' : metrics.fea >= 1.0 ? 'crescimento estável' : 'desenvolvimento gradual'}`,
            `Foco em ${metrics.averagePerDay >= metrics.teamGoal ? 'manutenção de resultados' : 'melhoria de performance'}`
          ],
          pontos_fortes: [
            metrics.fea >= 1.5 ? 'Alta eficiência operacional' : metrics.fea >= 1.0 ? 'Boa eficiência operacional' : 'Potencial de desenvolvimento',
            metrics.averagePerDay >= metrics.teamGoal ? 'Performance acima da meta' : 'Consistência nas atividades'
          ],
          pontos_fracos: [
            metrics.fea < 1.5 ? 'Oportunidade de melhoria na eficiência' : 'Necessidade de manter o ritmo',
            metrics.averagePerDay < metrics.teamGoal ? 'Performance abaixo da meta' : 'Possível sobrecarga'
          ],
          recomendacoes: [
            metrics.fea < 1.5 ? 'Implementar estratégias para aumentar eficiência' : 'Manter e replicar boas práticas',
            metrics.averagePerDay < metrics.teamGoal ? 'Focar em melhorias de produtividade' : 'Buscar otimizações'
          ],
          projecao_crescimento: `Projeção de crescimento de ${(metrics.fea * 100).toFixed(1)}% nos próximos 3 meses`,
          estrategias_personalizadas: [
            `Desenvolver plano de ação focado em ${metrics.fea < 1.5 ? 'aumento de eficiência' : 'manutenção de resultados'}`,
            `Implementar rotina de ${metrics.averagePerDay < metrics.teamGoal ? 'melhorias de produtividade' : 'otimizações'}`
          ],
          nova_meta_sugerida: (metrics.teamGoal * (1 + metrics.fea * 0.1)).toFixed(2),
          probabilidade_crescimento: `${(metrics.fea * 20).toFixed(1)}% a ${(metrics.fea * 30).toFixed(1)}%`,
          fator_ajuste_meta: (metrics.fea * 0.3).toFixed(4),
          dados_grafico: {
            historico: Array(6).fill(null).map((_, i) => ({
              mes: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'][i],
              valor: metrics.averagePerDay * 30
            })),
            previsao: Array(3).fill(null).map((_, i) => ({
              mes: ['Julho', 'Agosto', 'Setembro'][i],
              valor: metrics.averagePerDay * 30 * (1 + metrics.fea * 0.1)
            }))
          }
        };

        // Treinar o modelo com o exemplo
        const trainingCommand = `curl -X POST http://localhost:11434/api/generate -d '{"model": "nimage", "prompt": "${prompt}", "response": "${JSON.stringify(response)}", "stream": false}'`;
        
        console.log(`Treinando modelo com dados do vendedor ${vendor.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay para evitar sobrecarga
        await new Promise((resolve, reject) => {
          const { exec } = require('child_process');
          exec(trainingCommand, (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.error(`Erro ao treinar com dados do vendedor ${vendor.name}:`, error);
              reject(error);
            } else {
              console.log(`Treinamento concluído para o vendedor ${vendor.name}`);
              resolve(stdout);
            }
          });
        });

      } catch (error) {
        console.error(`Erro ao processar vendedor ${vendor.name}:`, error);
      }
    }

    console.log('Treinamento concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o treinamento:', error);
  } finally {
    await client.close();
  }
}

trainModel().catch(console.error);