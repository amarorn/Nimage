import mongoose from "mongoose";
import { MongoConfig } from './config';
import { DatabaseMonitoring } from '../monitoring/DatabaseMonitoring';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin"
//const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@127.0.0.1:27017/nimage?authSource=admin";


export class MongoDB {
    static async conectar() {
        return DatabaseMonitoring.trackMongoOperation('connect', 'system', async () => {
            try {
                await mongoose.connect(MongoConfig.url, MongoConfig.options);
                console.log("✅ Conectado ao MongoDB com sucesso!");
            } catch (error) {
                console.error("❌ Erro ao conectar ao MongoDB:", error);
                process.exit(1);
            }
        });
    }

    static async trackOperation<T>(
        operation: string,
        collection: string,
        callback: () => Promise<T>
    ): Promise<T> {
        return DatabaseMonitoring.trackMongoOperation(operation, collection, callback);
    }
}