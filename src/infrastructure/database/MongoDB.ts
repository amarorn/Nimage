import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nimage";

export class MongoDB {
    static async conectar() {
        try {
            await mongoose.connect(MONGO_URI);
            console.log("🔥 Conectado ao MongoDB com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}