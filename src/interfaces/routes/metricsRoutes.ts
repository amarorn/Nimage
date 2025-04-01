import { Router } from 'express';
import { metricsEndpoint } from '../../infrastructure/middleware/metricsMiddleware';

const router = Router();

router.get('/metrics', metricsEndpoint);

export default router; 