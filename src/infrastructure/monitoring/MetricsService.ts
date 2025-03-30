import { injectable } from 'inversify';
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

// Registro global para evitar duplicação
const globalRegistry = new Registry();

@injectable()
export class MetricsService {
    private httpRequestDuration: Histogram;
    private httpRequestTotal: Counter;
    private activeConnections: Gauge;
    private redisOperations: Counter;
    private mongoOperations: Counter;

    constructor() {
        // Métricas de requisições HTTP
        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duração das requisições HTTP em segundos',
            labelNames: ['method', 'route', 'status'],
            buckets: [0.1, 0.5, 1, 2, 5]
        });

        this.httpRequestTotal = new Counter({
            name: 'http_requests_total',
            help: 'Total de requisições HTTP',
            labelNames: ['method', 'route', 'status']
        });

        // Métricas de conexões
        this.activeConnections = new Gauge({
            name: 'active_connections',
            help: 'Número de conexões ativas',
            labelNames: ['type']
        });

        // Métricas de operações no Redis
        this.redisOperations = new Counter({
            name: 'redis_operations_total',
            help: 'Total de operações no Redis',
            labelNames: ['operation', 'status']
        });

        // Métricas de operações no MongoDB
        this.mongoOperations = new Counter({
            name: 'mongo_operations_total',
            help: 'Total de operações no MongoDB',
            labelNames: ['operation', 'status']
        });

        // Registrar todas as métricas apenas se ainda não estiverem registradas
        try {
            globalRegistry.registerMetric(this.httpRequestDuration);
            globalRegistry.registerMetric(this.httpRequestTotal);
            globalRegistry.registerMetric(this.activeConnections);
            globalRegistry.registerMetric(this.redisOperations);
            globalRegistry.registerMetric(this.mongoOperations);
        } catch (error: any) {
            // Ignora erros de registro duplicado
            console.debug('Métricas já registradas:', error.message);
        }
    }

    // Métricas HTTP
    recordHttpRequest(method: string, route: string, status: number, duration: number) {
        this.httpRequestDuration.observe({ method, route, status: status.toString() }, duration);
        this.httpRequestTotal.inc({ method, route, status: status.toString() });
    }

    // Métricas de conexões
    setActiveConnections(type: string, count: number) {
        this.activeConnections.set({ type }, count);
    }

    // Métricas Redis
    recordRedisOperation(operation: string, status: 'success' | 'error') {
        this.redisOperations.inc({ operation, status });
    }

    // Métricas MongoDB
    recordMongoOperation(operation: string, status: 'success' | 'error') {
        this.mongoOperations.inc({ operation, status });
    }

    // Obter métricas em formato Prometheus
    async getMetrics(): Promise<string> {
        return await globalRegistry.metrics();
    }
} 