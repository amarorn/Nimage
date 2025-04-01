import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Criar um registro de métricas
const register = new client.Registry();

// Adicionar métricas padrão do Node.js
client.collectDefaultMetrics({ register });

// Criar contador de requisições HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status'],
});

// Criar histograma de duração das requisições
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Criar métricas para Redis
const redisOperationsTotal = new client.Counter({
  name: 'redis_operations_total',
  help: 'Total de operações no Redis',
  labelNames: ['operation', 'status'],
});

const redisOperationDurationSeconds = new client.Histogram({
  name: 'redis_operation_duration_seconds',
  help: 'Duração das operações no Redis em segundos',
  labelNames: ['operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

// Criar métricas para MongoDB
const mongoOperationsTotal = new client.Counter({
  name: 'mongo_operations_total',
  help: 'Total de operações no MongoDB',
  labelNames: ['operation', 'collection', 'status'],
});

const mongoOperationDurationSeconds = new client.Histogram({
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

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Iniciar timer
  const start = Date.now();

  // Interceptar o evento 'finish' da resposta
  res.on('finish', () => {
    // Calcular duração
    const duration = (Date.now() - start) / 1000;

    // Registrar métricas
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString(),
    });

    httpRequestDurationSeconds.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
      },
      duration
    );
  });

  next();
};

export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

// Exportar métricas para uso em outros módulos
export const metrics = {
  redisOperationsTotal,
  redisOperationDurationSeconds,
  mongoOperationsTotal,
  mongoOperationDurationSeconds,
};