import app from "./app";
import { MongoDB } from "./infrastructure/database/MongoDB";

const PORT = process.env.PORT || 3000;

MongoDB.conectar().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
});