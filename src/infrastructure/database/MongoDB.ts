import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin"
//const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@127.0.0.1:27017/nimage?authSource=admin";


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