"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInitializer = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class CacheInitializer {
    constructor(equipeRepo, vendedorRepo, metaRepo, atividadeRepo) {
        this.redisCache = RedisCacheService_1.RedisCacheService.getInstance();
        this.equipeRepo = equipeRepo;
        this.vendedorRepo = vendedorRepo;
        this.metaRepo = metaRepo;
        this.atividadeRepo = atividadeRepo;
    }
    static getInstance(equipeRepo, vendedorRepo, metaRepo, atividadeRepo) {
        if (!CacheInitializer.instance) {
            CacheInitializer.instance = new CacheInitializer(equipeRepo, vendedorRepo, metaRepo, atividadeRepo);
        }
        return CacheInitializer.instance;
    }
    async initialize() {
        try {
            console.log('🚀 Iniciando inicialização do cache...');
            await Promise.all([
                this.initializeEquipes(),
                this.initializeVendedores(),
                this.initializeMetas(),
                this.initializeAtividades()
            ]);
            console.log('✅ Cache inicializado com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar cache:', error);
            throw error;
        }
    }
    async initializeEquipes() {
        try {
            console.log('🔄 Inicializando cache de equipes...');
            const equipes = await this.equipeRepo.obterTodos(0, 100); // Limitando a 100 equipes
            for (const equipe of equipes) {
                await this.redisCache.set(`${config_1.RedisConfig.keyPrefixes.equipe}${equipe.id}`, equipe, config_1.RedisConfig.ttl.equipe);
            }
            console.log('✅ Cache de equipes inicializado:', equipes.length, 'equipes');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar cache de equipes:', error);
            throw error;
        }
    }
    async initializeVendedores() {
        try {
            console.log('🔄 Inicializando cache de vendedores...');
            const vendedores = await this.vendedorRepo.obterTodos(0, 100); // Limitando a 100 vendedores
            for (const vendedor of vendedores) {
                await this.redisCache.set(`${config_1.RedisConfig.keyPrefixes.vendedor}${vendedor.id}`, vendedor, config_1.RedisConfig.ttl.vendedor);
            }
            console.log('✅ Cache de vendedores inicializado:', vendedores.length, 'vendedores');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar cache de vendedores:', error);
            throw error;
        }
    }
    async initializeMetas() {
        try {
            console.log('🔄 Inicializando cache de metas...');
            const metas = await this.metaRepo.obterTodos(0, 100); // Limitando a 100 metas
            for (const meta of metas) {
                await this.redisCache.set(`${config_1.RedisConfig.keyPrefixes.meta}${meta.id}`, meta, config_1.RedisConfig.ttl.meta);
            }
            console.log('✅ Cache de metas inicializado:', metas.length, 'metas');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar cache de metas:', error);
            throw error;
        }
    }
    async initializeAtividades() {
        try {
            console.log('🔄 Inicializando cache de atividades...');
            const atividades = await this.atividadeRepo.obterTodos(0, 100); // Limitando a 100 atividades mais recentes
            for (const atividade of atividades) {
                await this.redisCache.set(`${config_1.RedisConfig.keyPrefixes.atividade}${atividade.id}`, atividade, config_1.RedisConfig.ttl.atividade);
            }
            console.log('✅ Cache de atividades inicializado:', atividades.length, 'atividades');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar cache de atividades:', error);
            throw error;
        }
    }
    async disconnect() {
        await this.redisCache.disconnect();
    }
}
exports.CacheInitializer = CacheInitializer;
//# sourceMappingURL=CacheInitializer.js.map