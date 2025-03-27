"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeCacheService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const config_1 = require("./config");
class AtividadeCacheService {
    constructor() {
        this.cache = RedisCacheService_1.RedisCacheService.getInstance();
    }
    static getInstance() {
        if (!AtividadeCacheService.instance) {
            AtividadeCacheService.instance = new AtividadeCacheService();
        }
        return AtividadeCacheService.instance;
    }
    async getAtividade(id) {
        console.log('🔍 Buscando atividade no cache:', id);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}${id}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividade(atividade) {
        console.log('💾 Salvando atividade no cache:', atividade.id);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}${atividade.id}`;
        await this.cache.set(key, atividade, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividade salva no cache');
    }
    async getAtividades() {
        console.log('🔍 Buscando lista de atividades no cache');
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}list`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividades(atividades) {
        console.log('💾 Salvando lista de atividades no cache');
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}list`;
        await this.cache.set(key, atividades, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Lista de atividades salva no cache');
    }
    async getAtividadesPaginadas(skip, limit) {
        console.log('🔍 Buscando atividades paginadas no cache:', { skip, limit });
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}list:${skip}:${limit}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividadesPaginadas(skip, limit, data) {
        console.log('💾 Salvando atividades paginadas no cache:', { skip, limit });
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}list:${skip}:${limit}`;
        await this.cache.set(key, data, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividades paginadas salvas no cache');
    }
    async getAtividadesPorVendedor(vendedorId) {
        console.log('🔍 Buscando atividades por vendedor no cache:', vendedorId);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividadesPorVendedor(vendedorId, atividades) {
        console.log('💾 Salvando atividades por vendedor no cache:', vendedorId);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}`;
        await this.cache.set(key, atividades, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor salvas no cache');
    }
    async getAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim) {
        console.log('🔍 Buscando atividades por vendedor e data no cache:', { vendedorId, dataInicio, dataFim });
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:data:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim, atividades) {
        console.log('💾 Salvando atividades por vendedor e data no cache:', { vendedorId, dataInicio, dataFim });
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:data:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        await this.cache.set(key, atividades, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor e data salvas no cache');
    }
    async getAtividadesPorVendedorEMes(vendedorId, data) {
        console.log('🔍 Buscando atividades por vendedor e mês no cache:', { vendedorId, data });
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:mes:${ano}:${mes}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividadesPorVendedorEMes(vendedorId, data, atividades) {
        console.log('💾 Salvando atividades por vendedor e mês no cache:', { vendedorId, data });
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}:mes:${ano}:${mes}`;
        await this.cache.set(key, atividades, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividades por vendedor e mês salvas no cache');
    }
    async getAtividadesPorEquipe(equipeId) {
        console.log('🔍 Buscando atividades por equipe no cache:', equipeId);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}equipe:${equipeId}`;
        const result = await this.cache.get(key);
        console.log('📦 Resultado do cache:', result ? 'encontrado' : 'não encontrado');
        return result;
    }
    async setAtividadesPorEquipe(equipeId, atividades) {
        console.log('💾 Salvando atividades por equipe no cache:', equipeId);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}equipe:${equipeId}`;
        await this.cache.set(key, atividades, config_1.RedisConfig.ttl.atividade);
        console.log('✅ Atividades por equipe salvas no cache');
    }
    async deleteAtividade(id) {
        console.log('🗑️ Deletando atividade do cache:', id);
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}${id}`;
        await this.cache.delete(key);
        await this.invalidateList();
        console.log('✅ Atividade deletada do cache');
    }
    async invalidateList() {
        console.log('🗑️ Invalidando lista de atividades no cache');
        const key = `${config_1.RedisConfig.keyPrefixes.atividade}list`;
        await this.cache.delete(key);
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.atividade}list:*`);
        console.log('✅ Lista de atividades invalidada no cache');
    }
    async invalidateVendedor(vendedorId) {
        console.log('🗑️ Invalidando cache do vendedor:', vendedorId);
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.atividade}vendedor:${vendedorId}*`);
        console.log('✅ Cache do vendedor invalidado');
    }
    async invalidateEquipe(equipeId) {
        console.log('🗑️ Invalidando cache da equipe:', equipeId);
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.atividade}equipe:${equipeId}*`);
        console.log('✅ Cache da equipe invalidado');
    }
    async invalidateAll() {
        console.log('🗑️ Invalidando todo o cache de atividades');
        await this.cache.deletePattern(`${config_1.RedisConfig.keyPrefixes.atividade}*`);
        console.log('✅ Todo o cache de atividades invalidado');
    }
}
exports.AtividadeCacheService = AtividadeCacheService;
//# sourceMappingURL=AtividadeCacheService.js.map