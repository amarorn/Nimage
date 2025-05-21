"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = exports.metricsEndpoint = exports.metricsMiddleware = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Criar um registro de métricas
const register = new prom_client_1.default.Registry();
// Adicionar métricas padrão do Node.js
prom_client_1.default.collectDefaultMetrics({ register });
// Criar contador de requisições HTTP
const httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP',
    labelNames: ['method', 'route', 'status'],
});
// Criar histograma de duração das requisições
const httpRequestDurationSeconds = new prom_client_1.default.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duração das requisições HTTP em segundos',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5],
});
// Criar métricas para Redis
const redisOperationsTotal = new prom_client_1.default.Counter({
    name: 'redis_operations_total',
    help: 'Total de operações no Redis',
    labelNames: ['operation', 'status'],
});
const redisOperationDurationSeconds = new prom_client_1.default.Histogram({
    name: 'redis_operation_duration_seconds',
    help: 'Duração das operações no Redis em segundos',
    labelNames: ['operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1],
});
// Criar métricas para MongoDB
const mongoOperationsTotal = new prom_client_1.default.Counter({
    name: 'mongo_operations_total',
    help: 'Total de operações no MongoDB',
    labelNames: ['operation', 'collection', 'status'],
});
const mongoOperationDurationSeconds = new prom_client_1.default.Histogram({
    name: 'mongo_operation_duration_seconds',
    help: 'Duração das operações no MongoDB em segundos',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1],
});
// Registrar as métricas
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(redisOperationsTotal);
register.registerMetric(redisOperationDurationSeconds);
register.registerMetric(mongoOperationsTotal);
register.registerMetric(mongoOperationDurationSeconds);
const metricsMiddleware = (req, res, next) => {
    // Iniciar timer
    const start = Date.now();
    // Interceptar o evento 'finish' da resposta
    res.on('finish', () => {
        var _a, _b;
        // Calcular duração
        const duration = (Date.now() - start) / 1000;
        // Registrar métricas
        httpRequestsTotal.inc({
            method: req.method,
            route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path,
            status: res.statusCode.toString(),
        });
        httpRequestDurationSeconds.observe({
            method: req.method,
            route: ((_b = req.route) === null || _b === void 0 ? void 0 : _b.path) || req.path,
        }, duration);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
const metricsEndpoint = async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
};
exports.metricsEndpoint = metricsEndpoint;
// Exportar métricas para uso em outros módulos
exports.metrics = {
    redisOperationsTotal,
    redisOperationDurationSeconds,
    mongoOperationsTotal,
    mongoOperationDurationSeconds,
};
//# sourceMappingURL=MetricsMiddleware.js.map