import mongoose from "mongoose";

const isProduction = process.env.NODE_ENV === 'production';

const MONGO_URI = isProduction
  ? process.env.MONGO_URI_PROD || "mongodb://root:example@production_host:27017/nimage?authSource=admin"
  : process.env.MONGO_URI_DEV || "mongodb://root:example@127.0.0.1:27017/nimage?authSource=admin";

export class MongoDB {
    static async conectar() {
        console.log("🔥 Conectado ao MongoDB com sucesso!")
        try {
            await mongoose.connect(MONGO_URI);
            console.log("🔥 Conectado ao MongoDB com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}