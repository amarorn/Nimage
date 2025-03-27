import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';
import { Equipe } from '../../domain/entities/Equipe';

export class EquipeCacheService {
    private static instance: EquipeCacheService;
    private cache: RedisCacheService;

    private constructor() {
        this.cache = RedisCacheService.getInstance();
    }

    public static getInstance(): EquipeCacheService {
        if (!EquipeCacheService.instance) {
            EquipeCacheService.instance = new EquipeCacheService();
        }
        return EquipeCacheService.instance;
    }

    public async getEquipe(id: string): Promise<Equipe | null> {
        const key = `${RedisConfig.keyPrefixes.equipe}${id}`;
        return this.cache.get<Equipe>(key);
    }

    public async setEquipe(equipe: Equipe): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}${equipe.id}`;
        await this.cache.set(key, equipe, RedisConfig.ttl.equipe);
    }

    public async getEquipes(): Promise<Equipe[] | null> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        return this.cache.get<Equipe[]>(key);
    }

    public async setEquipes(equipes: Equipe[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        await this.cache.set(key, equipes, RedisConfig.ttl.equipe);
    }

    public async deleteEquipe(id: string): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }

    public async invalidateList(): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        await this.cache.delete(key);
    }

    public async invalidateAll(): Promise<void> {
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.equipe}*`);
    }
} 