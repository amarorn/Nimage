import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:admin@127.0.0.1:27017/nimage?authSource=admin";
console.log("MONGO_URI", MONGO_URI);

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