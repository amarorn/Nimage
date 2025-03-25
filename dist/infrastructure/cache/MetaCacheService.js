"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaCacheService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class MetaCacheService {
    constructor() {
        this.cache = RedisCacheService_1.RedisCacheService.getInstance();
    }
    static getInstance() {
        if (!MetaCacheService.instance) {
            MetaCacheService.instance = new MetaCacheService();
        }
        return MetaCacheService.instance;
    }
    async getMeta(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}${id}`;
        return this.cache.get(key);
    }
    async setMeta(meta) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}${meta.id}`;
        await this.cache.set(key, meta, config_1.RedisConfig.ttl.meta);
    }
    async getMetas() {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}list`;
        return this.cache.get(key);
    }
    async setMetas(metas) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}list`;
        await this.cache.set(key, metas, config_1.RedisConfig.ttl.meta);
    }
    async getMetasPorEquipe(equipeId) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}equipe:${equipeId}`;
        return this.cache.get(key);
    }
    async setMetasPorEquipe(equipeId, metas) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}equipe:${equipeId}`;
        await this.cache.set(key, metas, config_1.RedisConfig.ttl.meta);
    }
    async getMetaPorEquipeEMes(equipeId, data) {
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${config_1.RedisConfig.keyPrefixes.meta}equipe:${equipeId}:mes:${ano}:${mes}`;
        return this.cache.get(key);
    }
    async setMetaPorEquipeEMes(equipeId, data, meta) {
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${config_1.RedisConfig.keyPrefixes.meta}equipe:${equipeId}:mes:${ano}:${mes}`;
        await this.cache.set(key, meta, config_1.RedisConfig.ttl.meta);
    }
    async deleteMeta(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }
    async invalidateList() {
        const key = `${config_1.RedisConfig.keyPrefixes.meta}list`;
        await this.cache.delete(key);
    }
    async invalidateEquipe(equipeId) {
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.meta}equipe:${equipeId}*`);
    }
    async invalidateAll() {
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.meta}*`);
    }
}
exports.MetaCacheService = MetaCacheService;
//# sourceMappingURL=MetaCacheService.js.map