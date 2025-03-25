"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeMetaCacheService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class EquipeMetaCacheService {
    constructor() {
        this.redisCache = RedisCacheService_1.RedisCacheService.getInstance();
    }
    static getInstance() {
        if (!EquipeMetaCacheService.instance) {
            EquipeMetaCacheService.instance = new EquipeMetaCacheService();
        }
        return EquipeMetaCacheService.instance;
    }
    async getCalculoMeta(equipeId) {
        try {
            const key = `${config_1.RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            return await this.redisCache.get(key);
        }
        catch (error) {
            console.error('❌ Erro ao obter cálculo de meta do cache:', error);
            return null;
        }
    }
    async setCalculoMeta(equipeId, dados) {
        try {
            const key = `${config_1.RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            await this.redisCache.set(key, dados, config_1.RedisConfig.ttl.equipeMeta);
        }
        catch (error) {
            console.error('❌ Erro ao salvar cálculo de meta no cache:', error);
        }
    }
    async invalidateCalculoMeta(equipeId) {
        try {
            const key = `${config_1.RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            await this.redisCache.delete(key);
        }
        catch (error) {
            console.error('❌ Erro ao invalidar cálculo de meta do cache:', error);
        }
    }
}
exports.EquipeMetaCacheService = EquipeMetaCacheService;
//# sourceMappingURL=EquipeMetaCacheService.js.map