import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';

export class EquipeMetaCacheService {
    private static instance: EquipeMetaCacheService;
    private redisCache: RedisCacheService;

    private constructor() {
        this.redisCache = RedisCacheService.getInstance();
    }

    public static getInstance(): EquipeMetaCacheService {
        if (!EquipeMetaCacheService.instance) {
            EquipeMetaCacheService.instance = new EquipeMetaCacheService();
        }
        return EquipeMetaCacheService.instance;
    }

    public async getCalculoMeta(equipeId: string): Promise<any | null> {
        try {
            const key = `${RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            return await this.redisCache.get(key);
        } catch (error) {
            console.error('❌ Erro ao obter cálculo de meta do cache:', error);
            return null;
        }
    }

    public async setCalculoMeta(equipeId: string, dados: any): Promise<void> {
        try {
            const key = `${RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            await this.redisCache.set(key, dados, RedisConfig.ttl.equipeMeta);
        } catch (error) {
            console.error('❌ Erro ao salvar cálculo de meta no cache:', error);
        }
    }

    public async invalidateCalculoMeta(equipeId: string): Promise<void> {
        try {
            const key = `${RedisConfig.keyPrefixes.equipeMeta}${equipeId}`;
            await this.redisCache.delete(key);
        } catch (error) {
            console.error('❌ Erro ao invalidar cálculo de meta do cache:', error);
        }
    }
} 