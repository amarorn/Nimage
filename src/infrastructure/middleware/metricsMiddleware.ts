import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Criar um registro de métricas
const register = new client.Registry();

// Adicionar métricas padrão do Node.js
client.collectDefaultMetrics({ register });

// Criar contador de requisições HTTP por status
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP por status',
  labelNames: ['method', 'route', 'status'],
});

// Criar contador específico para erros 404
const http404Errors = new client.Counter({
  name: 'http_404_errors_total',
  help: 'Total de erros 404 (Not Found)',
  labelNames: ['method', 'route'],
});

// Criar contador específico para erros 500
const http500Errors = new client.Counter({
  name: 'http_500_errors_total',
  help: 'Total de erros 500 (Internal Server Error)',
  labelNames: ['method', 'route'],
});

// Criar contador específico para sucessos 200
const http200Success = new client.Counter({
  name: 'http_200_success_total',
  help: 'Total de sucessos 200 (OK)',
  labelNames: ['method', 'route'],
});

// Criar contador específico para sucessos 201
const http201Success = new client.Counter({
  name: 'http_201_success_total',
  help: 'Total de sucessos 201 (Created)',
  labelNames: ['method', 'route'],
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
register.registerMetric(http404Errors);
register.registerMetric(http500Errors);
register.registerMetric(http200Success);
register.registerMetric(http201Success);
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
    const method = req.method;
    const route = req.route?.path || req.path;
    const status = res.statusCode.toString();

    // Registrar métricas gerais
    httpRequestsTotal.inc({
      method,
      route,
      status,
    });

    // Registrar métricas específicas por status
    switch (status) {
      case '404':
        http404Errors.inc({ method, route });
        break;
      case '500':
        http500Errors.inc({ method, route });
        break;
      case '200':
        http200Success.inc({ method, route });
        break;
      case '201':
        http201Success.inc({ method, route });
        break;
    }

    // Registrar duração
    httpRequestDurationSeconds.observe(
      {
        method,
        route,
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