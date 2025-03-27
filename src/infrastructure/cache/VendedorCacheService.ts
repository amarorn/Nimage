import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';
import { Vendedor } from '../../domain/entities/Vendedor';

export class VendedorCacheService {
    private static instance: VendedorCacheService;
    private cache: RedisCacheService;

    private constructor() {
        this.cache = RedisCacheService.getInstance();
    }

    public static getInstance(): VendedorCacheService {
        if (!VendedorCacheService.instance) {
            VendedorCacheService.instance = new VendedorCacheService();
        }
        return VendedorCacheService.instance;
    }

    public async getVendedor(id: string): Promise<Vendedor | null> {
        const key = `${RedisConfig.keyPrefixes.vendedor}${id}`;
        return this.cache.get<Vendedor>(key);
    }

    public async setVendedor(vendedor: Vendedor): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}${vendedor.id}`;
        await this.cache.set(key, vendedor, RedisConfig.ttl.vendedor);
    }

    public async getVendedores(): Promise<Vendedor[] | null> {
        const key = `${RedisConfig.keyPrefixes.vendedor}list`;
        return this.cache.get<Vendedor[]>(key);
    }

    public async setVendedores(vendedores: Vendedor[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}list`;
        await this.cache.set(key, vendedores, RedisConfig.ttl.vendedor);
    }

    public async getVendedoresPorEquipe(equipeId: string): Promise<Vendedor[] | null> {
        const key = `${RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        return this.cache.get<Vendedor[]>(key);
    }

    public async setVendedoresPorEquipe(equipeId: string, vendedores: Vendedor[]): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        await this.cache.set(key, vendedores, RedisConfig.ttl.vendedor);
    }

    public async deleteVendedor(id: string): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
    }

    public async invalidateList(): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}list`;
        await this.cache.delete(key);
    }

    public async invalidateEquipe(equipeId: string): Promise<void> {
        const key = `${RedisConfig.keyPrefixes.vendedor}equipe:${equipeId}`;
        await this.cache.delete(key);
    }

    public async invalidateAll(): Promise<void> {
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.vendedor}*`);
    }
} 