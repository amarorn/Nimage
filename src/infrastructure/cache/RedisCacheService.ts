import Redis from 'ioredis';
import { RedisConfig } from './config';
import { MetricsService } from '../monitoring/MetricsService';

export class RedisCacheService {
    private static instance: RedisCacheService;
    private client: Redis;
    private metrics: MetricsService;

    private constructor() {
        this.client = new Redis(RedisConfig.url);
        this.metrics = new MetricsService();
        
        this.client.on('connect', () => {
            console.log('✅ Conectado ao Redis com sucesso');
        });

        this.client.on('error', (error: Error) => {
            console.error('❌ Erro na conexão com Redis:', error);
        });
    }

    public static getInstance(): RedisCacheService {
        if (!RedisCacheService.instance) {
            RedisCacheService.instance = new RedisCacheService();
        }
        return RedisCacheService.instance;
    }

    public async disconnect(): Promise<void> {
        try {
            console.log('🔌 Desconectando do Redis...');
            await this.client.quit();
            console.log('✅ Desconectado do Redis com sucesso');
        } catch (error) {
            console.error('❌ Erro ao desconectar do Redis:', error);
        }
    }

    public async get<T>(key: string): Promise<T | null> {
        try {
            console.log('🔍 Redis GET:', key);
            const data = await this.client.get(key);
            if (!data) {
                console.log('📭 Redis: Chave não encontrada');
                this.metrics.recordRedisOperation('get', 'success');
                return null;
            }
            console.log('📦 Redis: Dados encontrados');
            this.metrics.recordRedisOperation('get', 'success');
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Erro ao obter dados do Redis:', error);
            this.metrics.recordRedisOperation('get', 'error');
            return null;
        }
    }

    public async set(key: string, value: any, ttl: number): Promise<void> {
        try {
            console.log('💾 Redis SET:', key, 'TTL:', ttl);
            const data = JSON.stringify(value);
            await this.client.setex(key, ttl, data);
            console.log('✅ Redis: Dados salvos com sucesso');
            this.metrics.recordRedisOperation('set', 'success');
        } catch (error) {
            console.error('❌ Erro ao salvar dados no Redis:', error);
            this.metrics.recordRedisOperation('set', 'error');
        }
    }

    public async delete(key: string): Promise<void> {
        try {
            console.log('🗑️ Redis DEL:', key);
            await this.client.del(key);
            console.log('✅ Redis: Chave deletada com sucesso');
            this.metrics.recordRedisOperation('delete', 'success');
        } catch (error) {
            console.error('❌ Erro ao deletar chave do Redis:', error);
            this.metrics.recordRedisOperation('delete', 'error');
        }
    }

    public async deletePattern(pattern: string): Promise<void> {
        try {
            console.log('🗑️ Redis DEL (pattern):', pattern);
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(...keys);
                console.log('✅ Redis: Chaves deletadas com sucesso:', keys.length);
                this.metrics.recordRedisOperation('deletePattern', 'success');
            } else {
                console.log('📭 Redis: Nenhuma chave encontrada para o padrão');
                this.metrics.recordRedisOperation('deletePattern', 'success');
            }
        } catch (error) {
            console.error('❌ Erro ao deletar chaves do Redis:', error);
            this.metrics.recordRedisOperation('deletePattern', 'error');
        }
    }

    public async exists(key: string): Promise<boolean> {
        try {
            console.log('🔍 Redis EXISTS:', key);
            const exists = await this.client.exists(key);
            console.log('📦 Redis: Chave existe?', exists === 1);
            this.metrics.recordRedisOperation('exists', 'success');
            return exists === 1;
        } catch (error) {
            console.error('❌ Erro ao verificar existência da chave no Redis:', error);
            this.metrics.recordRedisOperation('exists', 'error');
            return false;
        }
    }
} 