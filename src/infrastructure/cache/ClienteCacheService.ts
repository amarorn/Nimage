import { Cliente } from '../../domain/entities/Cliente';

export class ClienteCacheService {
    private static instance: ClienteCacheService;
    private cache: Map<string, any>;
    private readonly TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): ClienteCacheService {
        if (!ClienteCacheService.instance) {
            ClienteCacheService.instance = new ClienteCacheService();
        }
        return ClienteCacheService.instance;
    }

    public async get(key: string): Promise<any> {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    public async set(key: string, value: any): Promise<void> {
        this.cache.set(key, {
            value,
            expiry: Date.now() + this.TTL
        });
    }

    public async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    public async invalidateAll(): Promise<void> {
        this.cache.clear();
    }

    public async getCliente(id: string): Promise<Cliente | null> {
        return await this.cache.get(`cliente:${id}`);
    }

    public async setCliente(cliente: Cliente): Promise<void> {
        await this.cache.set(`cliente:${cliente.id}`, cliente);
    }

    public async getClientes(): Promise<Cliente[] | null> {
        return await this.cache.get('clientes:all');
    }

    public async setClientes(clientes: Cliente[]): Promise<void> {
        await this.cache.set('clientes:all', clientes);
    }

    public async getClientesPaginados(skip: number, limit: number): Promise<{ clientes: Cliente[], total: number } | null> {
        return await this.cache.get(`clientes:page:${skip}:${limit}`);
    }

    public async setClientesPaginados(skip: number, limit: number, data: { clientes: Cliente[], total: number }): Promise<void> {
        await this.cache.set(`clientes:page:${skip}:${limit}`, data);
    }

    public async deleteCliente(id: string): Promise<void> {
        await this.cache.delete(`cliente:${id}`);
        await this.invalidateList();
    }

    public async invalidateList(): Promise<void> {
        const keys = Array.from(this.cache.keys()).filter(key => key.startsWith('clientes:'));
        await Promise.all(keys.map(key => this.cache.delete(key)));
    }
} 