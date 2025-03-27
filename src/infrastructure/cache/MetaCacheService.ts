import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';
import { Meta } from '../../domain/entities/Meta';

export class MetaCacheService {
    private static instance: MetaCacheService;
    private cache: RedisCacheService;

    private constructor() {
        this.cache = RedisCacheService.getInstance();
    }

    public static getInstance(): MetaCacheService {
        if (!MetaCacheService.instance) {
            MetaCacheService.instance = new MetaCacheService();
        }
        return MetaCacheService.instance;
    }

    public async getMeta(id: string): Promise<Meta | null> {
        const key = `${RedisConfig.keyPrefixes.meta}${id}`;
        return this.cache.get<Meta>(key);
    }

    public async setMeta(meta: Meta): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.meta}${meta.id}`;
        await this.cache.set(key, meta, RedisConfig.ttl.meta);
    }

    public async getMetas(): Promise<Meta[] | null> {
        const key = `${RedisConfig.keyPrefixes.meta}list`;
        return this.cache.get<Meta[]>(key);
    }

    public async setMetas(metas: Meta[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.meta}list`;
        await this.cache.set(key, metas, RedisConfig.ttl.meta);
    }

    public async getMetasPorEquipe(equipeId: string): Promise<Meta[] | null> {
        const key = `${RedisConfig.keyPrefixes.meta}equipe:${equipeId}`;
        return this.cache.get<Meta[]>(key);
    }

    public async setMetasPorEquipe(equipeId: string, metas: Meta[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.meta}equipe:${equipeId}`;
        await this.cache.set(key, metas, RedisConfig.ttl.meta);
    }

    public async getMetaPorEquipeEMes(equipeId: string, data: Date): Promise<Meta | null> {
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${RedisConfig.keyPrefixes.meta}equipe:${equipeId}:mes:${ano}:${mes}`;
        return this.cache.get<Meta>(key);
    }

    public async setMetaPorEquipeEMes(equipeId: string, data: Date, meta: Meta): Promise<void> {
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${RedisConfig.keyPrefixes.meta}equipe:${equipeId}:mes:${ano}:${mes}`;
        await this.cache.set(key, meta, RedisConfig.ttl.meta);
    }

    public async deleteMeta(id: string): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.meta}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }

    public async invalidateList(): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.meta}list`;
        await this.cache.delete(key);
    }

    public async invalidateEquipe(equipeId: string): Promise<void> {
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.meta}equipe:${equipeId}*`);
    }

    public async invalidateAll(): Promise<void> {
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.meta}*`);
    }
} 