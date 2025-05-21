"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMonitoring = void 0;
const MetricsMiddleware_1 = require("../middleware/MetricsMiddleware");
class DatabaseMonitoring {
    static async trackRedisOperation(operation, callback) {
        const startTime = Date.now();
        try {
            const result = await callback();
            MetricsMiddleware_1.metrics.redisOperationsTotal.inc({ operation, status: 'success' });
            MetricsMiddleware_1.metrics.redisOperationDurationSeconds.observe({ operation }, (Date.now() - startTime) / 1000);
            return result;
        }
        catch (error) {
            MetricsMiddleware_1.metrics.redisOperationsTotal.inc({ operation, status: 'error' });
            MetricsMiddleware_1.metrics.redisOperationDurationSeconds.observe({ operation }, (Date.now() - startTime) / 1000);
            throw error;
        }
    }
    static async trackMongoOperation(operation, collection, callback) {
        const startTime = Date.now();
        try {
            const result = await callback();
            MetricsMiddleware_1.metrics.mongoOperationsTotal.inc({ operation, collection, status: 'success' });
            MetricsMiddleware_1.metrics.mongoOperationDurationSeconds.observe({ operation, collection }, (Date.now() - startTime) / 1000);
            return result;
        }
        catch (error) {
            MetricsMiddleware_1.metrics.mongoOperationsTotal.inc({ operation, collection, status: 'error' });
            MetricsMiddleware_1.metrics.mongoOperationDurationSeconds.observe({ operation, collection }, (Date.now() - startTime) / 1000);
            throw error;
        }
    }
}
exports.DatabaseMonitoring = DatabaseMonitoring;
//# sourceMappingURL=DatabaseMonitoring.js.map