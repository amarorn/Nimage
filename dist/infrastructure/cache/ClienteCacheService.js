"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteCacheService = void 0;
class ClienteCacheService {
    constructor() {
        this.TTL = 5 * 60 * 1000; // 5 minutos em milissegundos
        this.cache = new Map();
    }
    static getInstance() {
        if (!ClienteCacheService.instance) {
            ClienteCacheService.instance = new ClienteCacheService();
        }
        return ClienteCacheService.instance;
    }
    async get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + this.TTL
        });
    }
    async delete(key) {
        this.cache.delete(key);
    }
    async invalidateAll() {
        this.cache.clear();
    }
    async getCliente(id) {
        return await this.cache.get(`cliente:${id}`);
    }
    async setCliente(cliente) {
        await this.cache.set(`cliente:${cliente.id}`, cliente);
    }
    async getClientes() {
        return await this.cache.get('clientes:all');
    }
    async setClientes(clientes) {
        await this.cache.set('clientes:all', clientes);
    }
    async getClientesPaginados(skip, limit) {
        return await this.cache.get(`clientes:page:${skip}:${limit}`);
    }
    async setClientesPaginados(skip, limit, data) {
        await this.cache.set(`clientes:page:${skip}:${limit}`, data);
    }
    async deleteCliente(id) {
        await this.cache.delete(`cliente:${id}`);
        await this.invalidateList();
    }
    async invalidateList() {
        const keys = Array.from(this.cache.keys()).filter(key => key.startsWith('clientes:'));
        await Promise.all(keys.map(key => this.cache.delete(key)));
    }
}
exports.ClienteCacheService = ClienteCacheService;
//# sourceMappingURL=ClienteCacheService.js.map