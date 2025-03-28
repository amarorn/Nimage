"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/health", async (req, res) => {
    try {
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            status: "unhealthy",
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map