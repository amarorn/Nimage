"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeCacheService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class EquipeCacheService {
    constructor() {
        this.cache = RedisCacheService_1.RedisCacheService.getInstance();
    }
    static getInstance() {
        if (!EquipeCacheService.instance) {
            EquipeCacheService.instance = new EquipeCacheService();
        }
        return EquipeCacheService.instance;
    }
    async getEquipe(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}${id}`;
        console.log(`🔍 Buscando equipe no cache: ${key}`);
        const equipe = await this.cache.get(key);
        if (equipe) {
            console.log(`✅ Equipe encontrada no cache: ${id}`);
        }
        else {
            console.log(`❌ Equipe não encontrada no cache: ${id}`);
        }
        return equipe;
    }
    async setEquipe(equipe) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}${equipe.id}`;
        console.log(`💾 Salvando equipe no cache: ${key}`);
        await this.cache.set(key, equipe, config_1.RedisConfig.ttl.equipe);
        console.log(`✅ Equipe salva no cache: ${equipe.id}`);
    }
    async getEquipes() {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        console.log(`🔍 Buscando lista de equipes no cache: ${key}`);
        const equipes = await this.cache.get(key);
        if (equipes) {
            console.log(`✅ Lista de equipes encontrada no cache: ${equipes.length} equipes`);
        }
        else {
            console.log(`❌ Lista de equipes não encontrada no cache`);
        }
        return equipes;
    }
    async setEquipes(equipes) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        console.log(`💾 Salvando lista de equipes no cache: ${key}`);
        await this.cache.set(key, equipes, config_1.RedisConfig.ttl.equipe);
        console.log(`✅ Lista de equipes salva no cache: ${equipes.length} equipes`);
    }
    async deleteEquipe(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}${id}`;
        console.log(`🗑️ Removendo equipe do cache: ${key}`);
        await this.cache.delete(key);
        await this.invalidateList();
        console.log(`✅ Equipe removida do cache: ${id}`);
    }
    async invalidateList() {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        console.log(`🗑️ Invalidando lista de equipes no cache: ${key}`);
        await this.cache.delete(key);
        console.log(`✅ Lista de equipes invalidada no cache`);
    }
    async invalidateAll() {
        console.log(`🗑️ Invalidando todo o cache de equipes`);
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.equipe}*`);
        console.log(`✅ Cache de equipes completamente invalidado`);
    }
}
exports.EquipeCacheService = EquipeCacheService;
//# sourceMappingURL=EquipeCacheService.js.map