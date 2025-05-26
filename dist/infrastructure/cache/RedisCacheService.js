"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const DatabaseMonitoring_1 = require("../monitoring/DatabaseMonitoring");
class RedisCacheService {
    constructor() {
        this.client = new ioredis_1.default(config_1.RedisConfig.url);
        this.client.on('connect', () => {
            console.log('✅ Conectado ao Redis com sucesso');
        });
        this.client.on('error', (error) => {
            console.error('❌ Erro na conexão com Redis:', error);
        });
    }
    static getInstance() {
        if (!RedisCacheService.instance) {
            RedisCacheService.instance = new RedisCacheService();
        }
        return RedisCacheService.instance;
    }
    async disconnect() {
        try {
            console.log('🔌 Desconectando do Redis...');
            await this.client.quit();
            console.log('✅ Desconectado do Redis com sucesso');
        }
        catch (error) {
            console.error('❌ Erro ao desconectar do Redis:', error);
        }
    }
    async get(key) {
        return DatabaseMonitoring_1.DatabaseMonitoring.trackRedisOperation('get', async () => {
            try {
                console.log('🔍 Redis GET:', key);
                const data = await this.client.get(key);
                if (!data) {
                    console.log('📭 Redis: Chave não encontrada');
                    return null;
                }
                console.log('📦 Redis: Dados encontrados');
                return JSON.parse(data);
            }
            catch (error) {
                console.error('❌ Erro ao obter dados do Redis:', error);
                return null;
            }
        });
    }
    async set(key, value, ttl) {
        return DatabaseMonitoring_1.DatabaseMonitoring.trackRedisOperation('set', async () => {
            try {
                console.log('💾 Redis SET:', key, 'TTL:', ttl);
                const data = JSON.stringify(value);
                await this.client.setex(key, ttl, data);
                console.log('✅ Redis: Dados salvos com sucesso');
            }
            catch (error) {
                console.error('❌ Erro ao salvar dados no Redis:', error);
            }
        });
    }
    async delete(key) {
        return DatabaseMonitoring_1.DatabaseMonitoring.trackRedisOperation('delete', async () => {
            try {
                console.log('🗑️ Redis DEL:', key);
                await this.client.del(key);
                console.log('✅ Redis: Chave deletada com sucesso');
            }
            catch (error) {
                console.error('❌ Erro ao deletar chave do Redis:', error);
            }
        });
    }
    async deletePattern(pattern) {
        return DatabaseMonitoring_1.DatabaseMonitoring.trackRedisOperation('deletePattern', async () => {
            try {
                console.log('🗑️ Redis DEL (pattern):', pattern);
                const keys = await this.client.keys(pattern);
                if (keys.length > 0) {
                    await this.client.del(...keys);
                    console.log('✅ Redis: Chaves deletadas com sucesso:', keys.length);
                }
                else {
                    console.log('📭 Redis: Nenhuma chave encontrada para o padrão');
                }
            }
            catch (error) {
                console.error('❌ Erro ao deletar chaves do Redis:', error);
            }
        });
    }
    async exists(key) {
        return DatabaseMonitoring_1.DatabaseMonitoring.trackRedisOperation('exists', async () => {
            try {
                console.log('🔍 Redis EXISTS:', key);
                const exists = await this.client.exists(key);
                console.log('📦 Redis: Chave existe?', exists === 1);
                return exists === 1;
            }
            catch (error) {
                console.error('❌ Erro ao verificar existência da chave no Redis:', error);
                return false;
            }
        });
    }
}
exports.RedisCacheService = RedisCacheService;
//# sourceMappingURL=RedisCacheService.js.map