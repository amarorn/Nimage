import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';
import { EquipeRepository } from '../../domain/repositories/EquipeRepository';
import { VendedorRepository } from '../../domain/repositories/VendedorRepository';
import { MetaRepository } from '../../domain/repositories/MetaRepository';
import { AtividadeRepository } from '../../domain/repositories/AtividadeRepository';

export class CacheInitializer {
    private static instance: CacheInitializer;
    private redisCache: RedisCacheService;
    private equipeRepo: EquipeRepository;
    private vendedorRepo: VendedorRepository;
    private metaRepo: MetaRepository;
    private atividadeRepo: AtividadeRepository;

    private constructor(
        equipeRepo: EquipeRepository,
        vendedorRepo: VendedorRepository,
        metaRepo: MetaRepository,
        atividadeRepo: AtividadeRepository
    ) {
        this.redisCache = RedisCacheService.getInstance();
        this.equipeRepo = equipeRepo;
        this.vendedorRepo = vendedorRepo;
        this.metaRepo = metaRepo;
        this.atividadeRepo = atividadeRepo;
    }

    public static getInstance(
        equipeRepo: EquipeRepository,
        vendedorRepo: VendedorRepository,
        metaRepo: MetaRepository,
        atividadeRepo: AtividadeRepository
    ): CacheInitializer {
        if (!CacheInitializer.instance) {
            CacheInitializer.instance = new CacheInitializer(equipeRepo, vendedorRepo, metaRepo, atividadeRepo);
        }
        return CacheInitializer.instance;
    }

    public async initialize(): Promise<void> {
        try {
            console.log('🚀 Iniciando inicialização do cache...');
            
            await Promise.all([
                this.initializeEquipes(),
                this.initializeVendedores(),
                this.initializeMetas(),
                this.initializeAtividades()
            ]);

            console.log('✅ Cache inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache:', error);
            throw error;
        }
    }

    private async initializeEquipes(): Promise<void> {
        try {
            console.log('🔄 Inicializando cache de equipes...');
            const equipes = await this.equipeRepo.obterTodos(0, 100); // Limitando a 100 equipes
            for (const equipe of equipes) {
                await this.redisCache.set(
                    `${RedisConfig.keyPrefixes.equipe}${equipe.id}`,
                    equipe,
                    RedisConfig.ttl.equipe
                );
            }
            console.log('✅ Cache de equipes inicializado:', equipes.length, 'equipes');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache de equipes:', error);
            throw error;
        }
    }

    private async initializeVendedores(): Promise<void> {
        try {
            console.log('🔄 Inicializando cache de vendedores...');
            const vendedores = await this.vendedorRepo.obterTodos(0, 100); // Limitando a 100 vendedores
            for (const vendedor of vendedores) {
                await this.redisCache.set(
                    `${RedisConfig.keyPrefixes.vendedor}${vendedor.id}`,
                    vendedor,
                    RedisConfig.ttl.vendedor
                );
            }
            console.log('✅ Cache de vendedores inicializado:', vendedores.length, 'vendedores');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache de vendedores:', error);
            throw error;
        }
    }

    private async initializeMetas(): Promise<void> {
        try {
            console.log('🔄 Inicializando cache de metas...');
            const metas = await this.metaRepo.obterTodos(0, 100); // Limitando a 100 metas
            for (const meta of metas) {
                await this.redisCache.set(
                    `${RedisConfig.keyPrefixes.meta}${meta.id}`,
                    meta,
                    RedisConfig.ttl.meta
                );
            }
            console.log('✅ Cache de metas inicializado:', metas.length, 'metas');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache de metas:', error);
            throw error;
        }
    }

    private async initializeAtividades(): Promise<void> {
        try {
            console.log('🔄 Inicializando cache de atividades...');
            const atividades = await this.atividadeRepo.obterTodos(0, 100); // Limitando a 100 atividades mais recentes
            for (const atividade of atividades) {
                await this.redisCache.set(
                    `${RedisConfig.keyPrefixes.atividade}${atividade.id}`,
                    atividade,
                    RedisConfig.ttl.atividade
                );
            }
            console.log('✅ Cache de atividades inicializado:', atividades.length, 'atividades');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache de atividades:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        await this.redisCache.disconnect();
    }
} 