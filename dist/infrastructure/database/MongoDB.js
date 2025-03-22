"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin";
//const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@127.0.0.1:27017/nimage?authSource=admin";
class MongoDB {
    static async conectar() {
        //console.log("🔥 Conectado ao MongoDB com sucesso!")
        try {
            await mongoose_1.default.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 60000, // Aumentado para 60 segundos
                socketTimeoutMS: 90000, // Aumentado para 90 segundos
                connectTimeoutMS: 60000, // Aumentado para 60 segundos
            });
            console.log("✅ Conectado ao MongoDB com sucesso!");
        }
        catch (error) {
            console.error("❌ Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=MongoDB.js.map