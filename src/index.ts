import express from "express";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";

const app = express();

// Middleware de logging
app.use((req, res, next) => {
    //console.log(`📝 ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        //console.log(`🕒 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.use(express.json());
app.use("/api", vendedorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
