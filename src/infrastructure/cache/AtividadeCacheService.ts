import { RedisCacheService } from './RedisCacheService';
import { RedisConfig } from './config';
import { Atividade } from '../../domain/entities/Atividade';

export class AtividadeCacheService {
    private static instance: AtividadeCacheService;
    private cache: RedisCacheService;

    private constructor() {
        this.cache = RedisCacheService.getInstance();
    }

    public static getInstance(): AtividadeCacheService {
        if (!AtividadeCacheService.instance) {
            AtividadeCacheService.instance = new AtividadeCacheService();
        }
        return AtividadeCacheService.instance;
    }

    public async getAtividade(id: string): Promise<Atividade | null> {
        console.log('🔍 Buscando atividade no cache:', id);
        const key = `${RedisConfig.keyPrefixes.atividade}${id}`;
        const result = await this.cache.get<Atividade>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividade(atividade: Atividade): Promise<void> {
        console.log('💾 Salvando atividade no cache:', atividade.id);
        const key = `${RedisConfig.keyPrefixes.atividade}${atividade.id}`;
        await this.cache.set(key, atividade, RedisConfig.ttl.atividade);
        console.log('✅ Atividade salva no cache');
    }

    public async getAtividades(): Promise<Atividade[] | null> {
        console.log('🔍 Buscando lista de atividades no cache');
        const key = `${RedisConfig.keyPrefixes.atividade}list`;
        const result = await this.cache.get<Atividade[]>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividades(atividades: Atividade[]): Promise<void> {
        console.log('💾 Salvando lista de atividades no cache');
        const key = `${RedisConfig.keyPrefixes.atividade}list`;
        await this.cache.set(key, atividades, RedisConfig.ttl.atividade);
        console.log('✅ Lista de atividades salva no cache');
    }

    public async getAtividadesPaginadas(skip: number, limit: number): Promise<{ atividades: Atividade[], total: number } | null> {
        console.log('🔍 Buscando atividades paginadas no cache:', { skip, limit });
        const key = `${RedisConfig.keyPrefixes.atividade}list:${skip}:${limit}`;
        const result = await this.cache.get<{ atividades: Atividade[], total: number }>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividadesPaginadas(skip: number, limit: number, data: { atividades: Atividade[], total: number }): Promise<void> {
        console.log('💾 Salvando atividades paginadas no cache:', { skip, limit });
        const key = `${RedisConfig.keyPrefixes.atividade}list:${skip}:${limit}`;
        await this.cache.set(key, data, RedisConfig.ttl.atividade);
        console.log('✅ Atividades paginadas salvas no cache');
    }

    public async getAtividadesPorVendedor(vendedorId: string): Promise<Atividade[] | null> {
        console.log('🔍 Buscando atividades por vendedor no cache:', vendedorId);
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}`;
        const result = await this.cache.get<Atividade[]>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividadesPorVendedor(vendedorId: string, atividades: Atividade[]): Promise<void> {
        console.log('💾 Salvando atividades por vendedor no cache:', vendedorId);
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}`;
        await this.cache.set(key, atividades, RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor salvas no cache');
    }

    public async getAtividadesPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<Atividade[] | null> {
        console.log('🔍 Buscando atividades por vendedor e data no cache:', { vendedorId, dataInicio, dataFim });
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:data:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        const result = await this.cache.get<Atividade[]>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividadesPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date, atividades: Atividade[]): Promise<void> {
        console.log('💾 Salvando atividades por vendedor e data no cache:', { vendedorId, dataInicio, dataFim });
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:data:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        await this.cache.set(key, atividades, RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor e data salvas no cache');
    }

    public async getAtividadesPorVendedorEMes(vendedorId: string, data: Date): Promise<Atividade[] | null> {
        console.log('🔍 Buscando atividades por vendedor e mês no cache:', { vendedorId, data });
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:mes:${ano}:${mes}`;
        const result = await this.cache.get<Atividade[]>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividadesPorVendedorEMes(vendedorId: string, data: Date, atividades: Atividade[]): Promise<void> {
        console.log('💾 Salvando atividades por vendedor e mês no cache:', { vendedorId, data });
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:mes:${ano}:${mes}`;
        await this.cache.set(key, atividades, RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor e mês salvas no cache');
    }

    public async getAtividadesPorEquipe(equipeId: string): Promise<Atividade[] | null> {
        console.log('🔍 Buscando atividades por equipe no cache:', equipeId);
        const key = `${RedisConfig.keyPrefixes.atividade}equipe:${equipeId}`;
        const result = await this.cache.get<Atividade[]>(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }

    public async setAtividadesPorEquipe(equipeId: string, atividades: Atividade[]): Promise<void> {
        console.log('💾 Salvando atividades por equipe no cache:', equipeId);
        const key = `${RedisConfig.keyPrefixes.atividade}equipe:${equipeId}`;
        await this.cache.set(key, atividades, RedisConfig.ttl.atividade);
        console.log('✅ Atividades por equipe salvas no cache');
    }

    public async deleteAtividade(id: string): Promise<void> {
        console.log('🗑️ Deletando atividade do cache:', id);
        const key = `${RedisConfig.keyPrefixes.atividade}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
        console.log('✅ Atividade deletada do cache');
    }

    public async invalidateList(): Promise<void> {
        console.log('🗑️ Invalidando lista de atividades no cache');
        const key = `${RedisConfig.keyPrefixes.atividade}list`;
        await this.cache.delete(key);
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.atividade}list:*`);
        console.log('✅ Lista de atividades invalidada no cache');
    }

    public async invalidateVendedor(vendedorId: string): Promise<void> {
        console.log('🗑️ Invalidando cache do vendedor:', vendedorId);
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}*`);
        console.log('✅ Cache do vendedor invalidado');
    }

    public async invalidateEquipe(equipeId: string): Promise<void> {
        console.log('🗑️ Invalidando cache da equipe:', equipeId);
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.atividade}equipe:${equipeId}*`);
        console.log('✅ Cache da equipe invalidado');
    }

    public async invalidateAll(): Promise<void> {
        console.log('🗑️ Invalidando todo o cache de atividades');
        await this.cache.deletePattern(`${RedisConfig.keyPrefixes.atividade}*`);
        console.log('✅ Todo o cache de atividades invalidado');
    }
} 