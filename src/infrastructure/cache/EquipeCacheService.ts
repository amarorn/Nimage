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
        console.log(`🔍 Buscando equipe no cache: ${key}`);
        const equipe = await this.cache.get<Equipe>(key);
        if (equipe) {
            console.log(`✅ Equipe encontrada no cache: ${id}`);
        } else {
            console.log(`❌ Equipe não encontrada no cache: ${id}`);
        }
        return equipe;
    }

    public async setEquipe(equipe: Equipe): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}${equipe.id}`;
        console.log(`💾 Salvando equipe no cache: ${key}`);
        await this.cache.set(key, equipe, RedisConfig.ttl.equipe);
        console.log(`✅ Equipe salva no cache: ${equipe.id}`);
    }

    public async getEquipes(): Promise<Equipe[] | null> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        console.log(`🔍 Buscando lista de equipes no cache: ${key}`);
        const equipes = await this.cache.get<Equipe[]>(key);
        if (equipes) {
            console.log(`✅ Lista de equipes encontrada no cache: ${equipes.length} equipes`);
        } else {
            console.log(`❌ Lista de equipes não encontrada no cache`);
        }
        return equipes;
    }

    public async setEquipes(equipes: Equipe[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        console.log(`💾 Salvando lista de equipes no cache: ${key}`);
        await this.cache.set(key, equipes, RedisConfig.ttl.equipe);
        console.log(`✅ Lista de equipes salva no cache: ${equipes.length} equipes`);
    }

    public async deleteEquipe(id: string): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}${id}`;
        console.log(`🗑️ Removendo equipe do cache: ${key}`);
        await this.cache.delete(key);
        await this.invalidateList();
        console.log(`✅ Equipe removida do cache: ${id}`);
    }

    public async invalidateList(): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.equipe}list`;
        console.log(`🗑️ Invalidando lista de equipes no cache: ${key}`);
        await this.cache.delete(key);
        console.log(`✅ Lista de equipes invalidada no cache`);
    }

    public async invalidateAll(): Promise<void> {
        console.log(`🗑️ Invalidando todo o cache de equipes`);
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.equipe}*`);
        console.log(`✅ Cache de equipes completamente invalidado`);
    }
} 