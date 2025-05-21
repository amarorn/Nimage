import { metrics } from '../middleware/MetricsMiddleware';

export class DatabaseMonitoring {
  static async trackRedisOperation<T>(
    operation: string,
    callback: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await callback();
      metrics.redisOperationsTotal.inc({ operation, status: 'success' });
      metrics.redisOperationDurationSeconds.observe(
        { operation },
        (Date.now() - startTime) / 1000
      );
      return result;
    } catch (error) {
      metrics.redisOperationsTotal.inc({ operation, status: 'error' });
      metrics.redisOperationDurationSeconds.observe(
        { operation },
        (Date.now() - startTime) / 1000
      );
      throw error;
    }
  }

  static async trackMongoOperation<T>(
    operation: string,
    collection: string,
    callback: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await callback();
      metrics.mongoOperationsTotal.inc({ operation, collection, status: 'success' });
      metrics.mongoOperationDurationSeconds.observe(
        { operation, collection },
        (Date.now() - startTime) / 1000
      );
      return result;
    } catch (error) {
      metrics.mongoOperationsTotal.inc({ operation, collection, status: 'error' });
      metrics.mongoOperationDurationSeconds.observe(
        { operation, collection },
        (Date.now() - startTime) / 1000
      );
      throw error;
    }
  }
} 