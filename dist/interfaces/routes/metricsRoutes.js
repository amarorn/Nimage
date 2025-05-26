"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MetricsMiddleware_1 = require("../../infrastructure/middleware/MetricsMiddleware");
const router = (0, express_1.Router)();
router.get('/metrics', MetricsMiddleware_1.metricsEndpoint);
exports.default = router;
//# sourceMappingURL=metricsRoutes.js.map