"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorCacheService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class VendedorCacheService {
    constructor() {
        this.cache = RedisCacheService_1.RedisCacheService.getInstance();
    }
    static getInstance() {
        if (!VendedorCacheService.instance) {
            VendedorCacheService.instance = new VendedorCacheService();
        }
        return VendedorCacheService.instance;
    }
    async getVendedor(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}${id}`;
        return this.cache.get(key);
    }
    async setVendedor(vendedor) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}${vendedor.id}`;
        await this.cache.set(key, vendedor, config_1.RedisConfig.ttl.vendedor);
    }
    async getVendedores() {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}list`;
        return this.cache.get(key);
    }
    async setVendedores(vendedores) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}list`;
        await this.cache.set(key, vendedores, config_1.RedisConfig.ttl.vendedor);
    }
    async getVendedoresPorEquipe(equipeId) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        return this.cache.get(key);
    }
    async setVendedoresPorEquipe(equipeId, vendedores) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        await this.cache.set(key, vendedores, config_1.RedisConfig.ttl.vendedor);
    }
    async deleteVendedor(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }
    async invalidateList() {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}list`;
        await this.cache.delete(key);
    }
    async invalidateEquipe(equipeId) {
        const key = `${config_1.RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        await this.cache.delete(key);
    }
    async invalidateAll() {
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.vendedor}*`);
    }
}
exports.VendedorCacheService = VendedorCacheService;
//# sourceMappingURL=VendedorCacheService.js.map