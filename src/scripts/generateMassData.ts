import { MongoDB } from '../infrastructure/database/MongoDB';
import { EquipeRepositoryImpl } from '../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from '../infrastructure/repositories/MetaRepositoryImpl';
import { AtividadeRepositoryImpl } from '../infrastructure/repositories/AtividadeRepositoryImpl';
import { Equipe } from '../domain/entities/Equipe';
import { Vendedor } from '../domain/entities/Vendedor';
import { Meta } from '../domain/entities/Meta';
import { Atividade } from '../domain/entities/Atividade';
import { v4 as uuidv4 } from 'uuid';
import { EquipeModel } from '../infrastructure/database/models/EquipeModel';
import { VendedorModel } from '../infrastructure/database/models/VendedorModel';
import { MetaModel } from '../infrastructure/database/models/MetaModel';
import { AtividadeModel } from '../infrastructure/database/models/AtividadeModel';

async function generateData() {
    try {
        console.log('🚀 Iniciando geração de dados de massa...');
        
        // Conecta ao MongoDB
        await MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');

        const equipeRepo = new EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();

        // Limpa dados existentes
        console.log('🧹 Limpando dados existentes...');
        await EquipeModel.deleteMany({});
        await VendedorModel.deleteMany({});
        await MetaModel.deleteMany({});
        await AtividadeModel.deleteMany({});

        // Cria equipes
        console.log('👥 Criando equipes...');
        const nomesEquipes = ['Equipe Norte', 'Equipe Sul', 'Equipe Leste', 'Equipe Oeste'];
        for (const nome of nomesEquipes) {
            const equipe = new Equipe(uuidv4(), nome);
            await equipeRepo.criar(equipe);
        }
        console.log('✅ 4 equipes criadas');

        // Cria vendedores
        console.log('👤 Criando vendedores...');
        const equipes = await equipeRepo.obterTodos(0, 4);
        const nomesVendedores = [
            'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza',
            'Julia Lima', 'Roberto Alves', 'Beatriz Ferreira', 'Lucas Rodrigues', 'Mariana Silva',
            'Rafael Costa', 'Fernanda Santos', 'Gustavo Oliveira', 'Carolina Lima', 'Daniel Alves',
            'Amanda Ferreira', 'Bruno Rodrigues', 'Patricia Silva', 'Marcos Costa', 'Carla Santos'
        ];

        for (let i = 0; i < equipes.length; i++) {
            const equipe = equipes[i];
            for (let j = 0; j < 5; j++) {
                const vendedor = new Vendedor(
                    uuidv4(),
                    nomesVendedores[i * 5 + j],
                    equipe.id
                );
                await vendedorRepo.criar(vendedor);
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

                const meta = new Meta(
                    uuidv4(),
                    equipe.id,
                    objetivo,
                    inicioMes
                );
                await metaRepo.criar(meta);
            }
        }
        console.log('✅ 56 metas criadas');

        // Cria atividades
        console.log('📊 Criando atividades...');
        let totalAtividades = 0;
        const vendedores = await vendedorRepo.obterTodos(0, 20);
        const metas = await metaRepo.obterTodos(0, 56);

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
                const metaMes = metasEquipe.find(meta => 
                    meta.data.getMonth() === data.getMonth() && 
                    meta.data.getFullYear() === data.getFullYear()
                );

                if (!metaMes) continue;

                const mediaDiaria = metaMes.objetivo / new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();

                // Ajusta a quantidade de docinhos com base no dia da semana
                let fatorDiaSemana = 1.0;
                const diaSemana = data.getDay();
                if (diaSemana === 0 || diaSemana === 6) { // Fim de semana
                    fatorDiaSemana = 1.3; // 30% mais vendas
                } else if (diaSemana === 5) { // Sexta-feira
                    fatorDiaSemana = 1.2; // 20% mais vendas
                }

                const docinhosCoco = Math.floor(
                    mediaDiaria * 
                    fatorDesempenho * 
                    fatorDiaSemana * 
                    (Math.floor(Math.random() * (120 - 80 + 1) + 80) / 100)
                );

                const atividade = new Atividade(
                    uuidv4(),
                    vendedor.id,
                    data,
                    docinhosCoco,
                    docinhosCoco
                );
                await atividadeRepo.criar(atividade);
                totalAtividades++;
            }
            console.log(`✅ Criadas ${diasPorVendedor} atividades para ${vendedor.nome}`);
        }

        console.log(`\n🎉 Total de atividades criadas: ${totalAtividades}`);
        console.log('🎉 Geração de dados concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a geração de dados:', error);
        throw error;
    }
}

// Executa a geração de dados
generateData().catch(console.error); 