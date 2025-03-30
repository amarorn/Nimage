import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../monitoring/MetricsService';

export class MetricsMiddleware {
    constructor(private metricsService: MetricsService) {}

    collectMetrics = (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on('finish', () => {
            const duration = (Date.now() - start) / 1000;
            this.metricsService.recordHttpRequest(
                req.method,
                req.route?.path || req.path,
                res.statusCode,
                duration
            );
        });

        next();
    };

    exposeMetrics = async (req: Request, res: Response) => {
        res.set('Content-Type', 'text/plain');
        res.end(await this.metricsService.getMetrics());
    };
} 