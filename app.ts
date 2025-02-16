import express from "express";
import vendedorRoutes from  "./src/interfaces/routes/vendedorRoutes";
import atividadeRoutes from "./src/interfaces/routes/atividadeRoutes";
import equipeRoutes from "./src/interfaces/routes/equipeRoutes";
import metaRoutes from "./src/interfaces/routes/metaRoutes";

const app = express();
app.use(express.json());
app.use("/api", vendedorRoutes);
app.use("/api", atividadeRoutes);
app.use("/api", equipeRoutes);
app.use("/api", metaRoutes);

export default app;