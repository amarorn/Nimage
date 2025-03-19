import { v4 as uuidv4 } from 'uuid';
import { MongoDB } from '../../infrastructure/database/MongoDB';
import { Equipe } from '../../domain/entities/Equipe';
import { Vendedor } from '../../domain/entities/Vendedor';
import { Meta } from '../../domain/entities/Meta';
import { Atividade } from '../../domain/entities/Atividade';
import { EquipeModel } from '../../infrastructure/database/models/EquipeModel';
import { VendedorModel } from '../../infrastructure/database/models/VendedorModel';
import { MetaModel } from '../../infrastructure/database/models/MetaModel';
import { AtividadeModel } from '../../infrastructure/database/models/AtividadeModel';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from '../../infrastructure/repositories/MetaRepositoryImpl';
import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';

// Constantes
const META_BASE = 100000; // Meta base mensal por equipe

type PerfilDesempenho = 'ALTO_DESEMPENHO' | 'MEDIO_DESEMPENHO' | 'BAIXO_DESEMPENHO';

interface PerfilVendedor {
    frequenciaMin: number;
    frequenciaMax: number;
    fatorDesempenhoMin: number;
    fatorDesempenhoMax: number;
}

interface PerfilEquipe {
    fatorMetaBase: number;
    distribuicaoVendedores: number[];
}

interface EquipeComPerfil extends Equipe {
    perfil: PerfilDesempenho;
}

interface VendedorComPerfil extends Vendedor {
    perfil: PerfilDesempenho;
}

const PERFIS_VENDEDOR: Record<PerfilDesempenho, PerfilVendedor> = {
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

const PERFIS_EQUIPE: Record<PerfilDesempenho, PerfilEquipe> = {
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
        const nomesEquipes: Array<{ nome: string; perfil: PerfilDesempenho }> = [
            { nome: 'Equipe Norte', perfil: 'ALTO_DESEMPENHO' },
            { nome: 'Equipe Sul', perfil: 'MEDIO_DESEMPENHO' },
            { nome: 'Equipe Leste', perfil: 'MEDIO_DESEMPENHO' },
            { nome: 'Equipe Oeste', perfil: 'BAIXO_DESEMPENHO' }
        ];

        const equipes: EquipeComPerfil[] = [];
        for (const { nome, perfil } of nomesEquipes) {
            const id = uuidv4();
            const equipe = new Equipe(
                id,
                nome,
                `PDV ${nome}`,
                'São Paulo',
                'SP',
                `Gerente ${nome}`,
                `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
                `Capitão ${nome}`,
                `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
            );
            await equipeRepo.criar(equipe);
            equipes.push({ ...equipe, perfil });
        }
        console.log('✅ 4 equipes criadas');

        // Cria vendedores
        console.log('👤 Criando vendedores...');
        const nomesVendedores = [
            'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
            'Carlos Souza', 'Julia Lima', 'Roberto Alves', 'Beatriz Ferreira',
            'Lucas Rodrigues', 'Mariana Silva', 'Rafael Costa', 'Fernanda Santos',
            'Gustavo Oliveira', 'Carolina Lima', 'Daniel Alves', 'Amanda Ferreira'
        ];

        const vendedores: VendedorComPerfil[] = [];
        let nomeIndex = 0;

        for (const equipe of equipes) {
            const perfilEquipe = PERFIS_EQUIPE[equipe.perfil];
            const distribuicao = perfilEquipe.distribuicaoVendedores;
            
            // Cria vendedores com diferentes perfis conforme a distribuição
            let vendedorIndex = 0;
            for (let i = 0; i < distribuicao.length; i++) {
                const quantidade = distribuicao[i];
                const perfilVendedor: PerfilDesempenho = i === 0 ? 'ALTO_DESEMPENHO' : 
                                   i === 1 ? 'MEDIO_DESEMPENHO' : 
                                   'BAIXO_DESEMPENHO';
                
                for (let j = 0; j < quantidade; j++) {
                    const nome = nomesVendedores[nomeIndex++];
                    const email = `${nome.toLowerCase().replace(' ', '.')}@nimage.com`;
                    const telefone = `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
                    const meta = META_BASE * perfilEquipe.fatorMetaBase * (perfilVendedor === 'ALTO_DESEMPENHO' ? 1.2 : 
                                                                          perfilVendedor === 'MEDIO_DESEMPENHO' ? 1.0 : 0.8);
                    const cargo = perfilVendedor === 'ALTO_DESEMPENHO' ? 'Vendedor Sênior' :
                                perfilVendedor === 'MEDIO_DESEMPENHO' ? 'Vendedor Pleno' : 'Vendedor Júnior';
                    
                    const vendedor = new Vendedor(
                        uuidv4(),
                        nome,
                        equipe.id,
                        email,
                        telefone,
                        meta,
                        cargo
                    );
                    await vendedorRepo.criar(vendedor);
                    vendedores.push({ ...vendedor, perfil: perfilVendedor });
                    vendedorIndex++;
                }
            }
        }
        console.log('✅ 16 vendedores criados');

        // Cria metas
        console.log('🎯 Criando metas...');
        const dataInicio = new Date('2024-01-01');
        const dataFim = new Date('2025-03-01');
        const meses = 14;

        for (const equipe of equipes) {
            const perfilEquipe = PERFIS_EQUIPE[equipe.perfil];
            
            for (let i = 0; i < meses; i++) {
                const inicioMes = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + i, 1);
                const fimMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);

                // Fatores que influenciam a meta
                const fatorSazonal = Math.floor(Math.random() * (130 - 70 + 1) + 70) / 100; // Variação sazonal
                const fatorEquipe = perfilEquipe.fatorMetaBase; // Fator baseado no perfil da equipe
                const objetivo = META_BASE * fatorSazonal * fatorEquipe;

                const meta = new Meta(
                    uuidv4(),
                    equipe.id,
                    objetivo,
                    inicioMes
                );
                await metaRepo.criar(meta);
            }
        }
        console.log('✅ Metas criadas para todas as equipes');

        // Cria atividades
        console.log('📊 Criando atividades...');
        let totalAtividades = 0;

        // Gera datas para todo o período
        const datas: Date[] = [];
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
            
            // Determina os dias que o vendedor terá atividade
            const frequencia = perfilVendedor.frequenciaMin + 
                             (Math.random() * (perfilVendedor.frequenciaMax - perfilVendedor.frequenciaMin));
            const diasComAtividade = Math.floor(datas.length * frequencia);
            
            // Seleciona dias aleatórios para ter atividade
            const datasVendedor = [...datas]
                .sort(() => Math.random() - 0.5)
                .slice(0, diasComAtividade);

            for (const data of datasVendedor) {
                const equipeVendedor = equipes.find(e => e.id === vendedor.equipeId);
                if (!equipeVendedor) continue;

                const perfilEquipe = PERFIS_EQUIPE[equipeVendedor.perfil];
                
                // Calcula a meta diária base
                const metaDiaria = (META_BASE * perfilEquipe.fatorMetaBase) / 22; // 22 dias úteis por mês
                
                // Fatores que influenciam o desempenho
                const fatorDesempenho = perfilVendedor.fatorDesempenhoMin + 
                                      (Math.random() * (perfilVendedor.fatorDesempenhoMax - perfilVendedor.fatorDesempenhoMin));
                
                // Ajusta com base no dia da semana
                let fatorDiaSemana = 1.0;
                const diaSemana = data.getDay();
                if (diaSemana === 6) { // Sábado
                    fatorDiaSemana = 1.3;
                } else if (diaSemana === 5) { // Sexta
                    fatorDiaSemana = 1.2;
                }

                // Calcula quantidade de docinhos vendidos
                const docinhosCoco = Math.floor(
                    metaDiaria * 
                    fatorDesempenho * 
                    fatorDiaSemana * 
                    (0.8 + Math.random() * 0.4) // Variação aleatória de ±20%
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
            console.log(`✅ Criadas ${diasComAtividade} atividades para ${vendedor.nome}`);
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