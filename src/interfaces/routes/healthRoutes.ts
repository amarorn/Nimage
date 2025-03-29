import { Router } from "express";

const router = Router();

router.get("/health", async (req, res) => {
    try {
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: "unhealthy",
            error: (error as Error).message
        });
    }
});

export default router; 