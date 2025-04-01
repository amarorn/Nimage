import Redis from 'ioredis';
import { RedisConfig } from './config';
import { DatabaseMonitoring } from '../monitoring/DatabaseMonitoring';

export class RedisCacheService {
    private static instance: RedisCacheService;
    private client: Redis;

    private constructor() {
        this.client = new Redis(RedisConfig.url);
        
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
        return DatabaseMonitoring.trackRedisOperation('get', async () => {
            try {
                console.log('🔍 Redis GET:', key);
                const data = await this.client.get(key);
                if (!data) {
                    console.log('📭 Redis: Chave não encontrada');
                    return null;
                }
                console.log('📦 Redis: Dados encontrados');
                return JSON.parse(data);
            } catch (error) {
                console.error('❌ Erro ao obter dados do Redis:', error);
                return null;
            }
        });
    }

    public async set(key: string, value: any, ttl: number): Promise<void> {
        return DatabaseMonitoring.trackRedisOperation('set', async () => {
            try {
                console.log('💾 Redis SET:', key, 'TTL:', ttl);
                const data = JSON.stringify(value);
                await this.client.setex(key, ttl, data);
                console.log('✅ Redis: Dados salvos com sucesso');
            } catch (error) {
                console.error('❌ Erro ao salvar dados no Redis:', error);
            }
        });
    }

    public async delete(key: string): Promise<void> {
        return DatabaseMonitoring.trackRedisOperation('delete', async () => {
            try {
                console.log('🗑️ Redis DEL:', key);
                await this.client.del(key);
                console.log('✅ Redis: Chave deletada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao deletar chave do Redis:', error);
            }
        });
    }

    public async deletePattern(pattern: string): Promise<void> {
        return DatabaseMonitoring.trackRedisOperation('deletePattern', async () => {
            try {
                console.log('🗑️ Redis DEL (pattern):', pattern);
                const keys = await this.client.keys(pattern);
                if (keys.length > 0) {
                    await this.client.del(...keys);
                    console.log('✅ Redis: Chaves deletadas com sucesso:', keys.length);
                } else {
                    console.log('📭 Redis: Nenhuma chave encontrada para o padrão');
                }
            } catch (error) {
                console.error('❌ Erro ao deletar chaves do Redis:', error);
            }
        });
    }

    public async exists(key: string): Promise<boolean> {
        return DatabaseMonitoring.trackRedisOperation('exists', async () => {
            try {
                console.log('🔍 Redis EXISTS:', key);
                const exists = await this.client.exists(key);
                console.log('📦 Redis: Chave existe?', exists === 1);
                return exists === 1;
            } catch (error) {
                console.error('❌ Erro ao verificar existência da chave no Redis:', error);
                return false;
            }
        });
    }
} 