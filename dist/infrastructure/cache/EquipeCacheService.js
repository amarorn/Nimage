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
        return this.cache.get(key);
    }
    async setEquipe(equipe) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}${equipe.id}`;
        await this.cache.set(key, equipe, config_1.RedisConfig.ttl.equipe);
    }
    async getEquipes() {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        return this.cache.get(key);
    }
    async setEquipes(equipes) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        await this.cache.set(key, equipes, config_1.RedisConfig.ttl.equipe);
    }
    async deleteEquipe(id) {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }
    async invalidateList() {
        const key = `${config_1.RedisConfig.keyPrefixes.equipe}list`;
        await this.cache.delete(key);
    }
    async invalidateAll() {
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.equipe}*`);
    }
}
exports.EquipeCacheService = EquipeCacheService;
//# sourceMappingURL=EquipeCacheService.js.map