import express from "express";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import atividadeRoutes from "./interfaces/routes/atividadeRoutes";
import equipeRoutes from "./interfaces/routes/equipeRoutes";
import metaRoutes from "./interfaces/routes/metaRoutes";

const app = express();
app.use(express.json());

// Adicionando o endpoint de health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Service is running smoothly" });
});

app.use("/api", vendedorRoutes);
app.use("/api", atividadeRoutes);
app.use("/api", equipeRoutes);
app.use("/api", metaRoutes);

export default app;