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
import { CriarEquipe } from '../../application/use-cases/CriarEquipe';
import { CriarVendedor } from '../../application/use-cases/CriarVendedor';
import { CriarAtividade } from '../../application/use-cases/CriarAtividade';
import { CriarMeta } from '../../application/use-cases/CriarMeta';

// Tipos
type PerfilEquipe = 'ALTA' | 'MEDIA' | 'BAIXA';
type PerfilVendedor = 'EXCELENTE' | 'BOM' | 'MEDIO' | 'BAIXO';

interface PerfilEquipeConfig {
    peso: number;
    mediaMeta: number;
    variacao: number;
}

interface PerfilVendedorConfig {
    peso: number;
    mediaVendas: number;
    variacao: number;
}

interface SazonalidadeDias {
    [key: number]: number;
}

interface SazonalidadeMeses {
    [key: number]: number;
}

interface Sazonalidade {
    dias: SazonalidadeDias;
    meses: SazonalidadeMeses;
}

// Constantes
const perfisEquipe: Record<PerfilEquipe, PerfilEquipeConfig> = {
    ALTA: {
        peso: 0.3,
        mediaMeta: 120000,
        variacao: 0.20
    },
    MEDIA: {
        peso: 0.4,
        mediaMeta: 100000,
        variacao: 0.15
    },
    BAIXA: {
        peso: 0.3,
        mediaMeta: 80000,
        variacao: 0.25
    }
};

const perfisVendedor: Record<PerfilVendedor, PerfilVendedorConfig> = {
    EXCELENTE: {
        peso: 0.2,
        mediaVendas: 1500,
        variacao: 0.15
    },
    BOM: {
        peso: 0.4,
        mediaVendas: 1200,
        variacao: 0.20
    },
    MEDIO: {
        peso: 0.3,
        mediaVendas: 900,
        variacao: 0.25
    },
    BAIXO: {
        peso: 0.1,
        mediaVendas: 600,
        variacao: 0.30
    }
};

const sazonalidade: Sazonalidade = {
    dias: {
        0: 0.50, // Domingo
        1: 0.80, // Segunda
        2: 0.90, // Terça
        3: 1.00, // Quarta
        4: 1.00, // Quinta
        5: 0.90, // Sexta
        6: 0.70  // Sábado
    },
    meses: {
        0: 0.80,  // Janeiro
        1: 0.90,  // Fevereiro
        2: 1.00,  // Março
        3: 1.00,  // Abril
        4: 0.90,  // Maio
        5: 0.80,  // Junho
        6: 0.70,  // Julho
        7: 0.80,  // Agosto
        8: 0.90,  // Setembro
        9: 1.00,  // Outubro
        10: 1.00, // Novembro
        11: 0.90  // Dezembro
    }
};

// Função para gerar número com distribuição normal
function gerarNumeroNormal(media: number, desvioPadrao: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return media + z * desvioPadrao;
}

// Função para selecionar perfil baseado em pesos
function selecionarPerfil<T extends string>(perfis: Record<T, { peso: number }>): T {
    const rand = Math.random();
    let acumulado = 0;
    
    for (const [perfil, config] of Object.entries(perfis)) {
        acumulado += (config as { peso: number }).peso;
        if (rand <= acumulado) {
            return perfil as T;
        }
    }
    
    return Object.keys(perfis)[0] as T;
}

async function generateMassData() {
    try {
        console.log('🚀 Iniciando geração de massa de dados...');
        
        // Conectar ao MongoDB
        await MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');

        // Inicializar repositórios
        const equipeRepo = new EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();

        // Inicializar use cases
        const criarEquipe = new CriarEquipe(equipeRepo);
        const criarVendedor = new CriarVendedor(vendedorRepo);
        const criarAtividade = new CriarAtividade(atividadeRepo);
        const criarMeta = new CriarMeta(metaRepo);

        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await equipeRepo.deletarTodos();
        await vendedorRepo.deletarTodos();
        await atividadeRepo.deletarTodos();
        await metaRepo.deletarTodos();
        console.log('✅ Dados limpos');

        // Definir período
        const dataInicio = new Date(2024, 0, 1); // 01/01/2024
        const dataFim = new Date(2025, 2, 30);   // 30/03/2025

        // Criar equipes
        console.log('👥 Criando equipes...');
        const equipes = [];
        for (let i = 1; i <= 4; i++) {
            const perfil = selecionarPerfil(perfisEquipe);
            const equipe = await criarEquipe.executar({
                id: uuidv4(),
                nome: `Equipe ${i}`,
                nomepdv: `PDV ${i}`,
                cidade: `Cidade ${i}`,
                estado: 'SP',
                gerente: `Gerente ${i}`,
                contato_gerente: `(11) 9999-${i.toString().padStart(4, '0')}`,
                capitao: `Capitão ${i}`,
                contato_capitao: `(11) 9888-${i.toString().padStart(4, '0')}`
            });
            equipes.push({ ...equipe, perfil });
        }
        console.log('✅ Equipes criadas');

        // Criar metas mensais para cada equipe
        console.log('🎯 Criando metas mensais...');
        for (const equipe of equipes) {
            const perfil = equipe.perfil;
            const mediaMeta = perfisEquipe[perfil].mediaMeta;
            const variacao = perfisEquipe[perfil].variacao;

            let data = new Date(dataInicio);
            while (data <= dataFim) {
                const meta = gerarNumeroNormal(mediaMeta, mediaMeta * variacao);
                await criarMeta.executar({
                    id: uuidv4(),
                    equipeId: equipe.id,
                    objetivo: Math.max(0, meta),
                    data: new Date(data)
                });
                data.setMonth(data.getMonth() + 1);
            }
        }
        console.log('✅ Metas criadas');

        // Criar vendedores e suas atividades
        console.log('👤 Criando vendedores e atividades...');
        for (const equipe of equipes) {
            // Criar 5 vendedores para cada equipe
            for (let i = 1; i <= 5; i++) {
                const perfil = selecionarPerfil(perfisVendedor);
                const vendedor = await criarVendedor.executar({
                    id: uuidv4(),
                    nome: `Vendedor ${i} - ${equipe.nome}`,
                    equipeId: equipe.id,
                    email: `vendedor${i}@${equipe.nome.toLowerCase().replace(' ', '')}.com`,
                    telefone: `(11) 9777-${i.toString().padStart(4, '0')}`,
                    meta: perfisVendedor[perfil].mediaVendas * 30,
                    cargo: 'Vendedor'
                });

                // Gerar atividades para o vendedor
                let data = new Date(dataInicio);
                while (data <= dataFim) {
                    // Não gerar atividades aos domingos
                    if (data.getDay() !== 0) {
                        const mediaVendas = perfisVendedor[perfil].mediaVendas;
                        const variacao = perfisVendedor[perfil].variacao;
                        
                        // Aplicar fatores de sazonalidade
                        const fatorDia = sazonalidade.dias[data.getDay()];
                        const fatorMes = sazonalidade.meses[data.getMonth()];
                        
                        // Calcular quantidade com distribuição normal e fatores de sazonalidade
                        const quantidade = Math.round(
                            gerarNumeroNormal(mediaVendas, mediaVendas * variacao) * 
                            fatorDia * 
                            fatorMes
                        );

                        await criarAtividade.executar({
                            id: uuidv4(),
                            vendedorId: vendedor.id,
                            data: new Date(data),
                            docinhosCoco: Math.max(0, quantidade)
                        });
                    }
                    data.setDate(data.getDate() + 1);
                }
            }
        }
        console.log('✅ Vendedores e atividades criados');

        console.log('🎉 Geração de massa de dados concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao gerar massa de dados:', error);
    }
}

// Executa a geração de dados
generateMassData().catch(console.error); 
generateMassData().catch(console.error); 
generateMassData().catch(console.error); 