import mongoose from "mongoose";
import { config } from '../../config';
import { DatabaseMonitoring } from '../monitoring/DatabaseMonitoring';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin"
//const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@127.0.0.1:27017/nimage?authSource=admin";

export class MongoDB {
    private static instance: MongoDB;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): MongoDB {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('🔄 MongoDB já está conectado');
            return;
        }

        try {
            console.log('🔌 Conectando ao MongoDB...');
            await mongoose.connect(config.mongoUri);
            this.isConnected = true;
            console.log('✅ MongoDB conectado com sucesso');

            mongoose.connection.on('error', (error) => {
                console.error('❌ Erro na conexão com MongoDB:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB desconectado');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconectado');
                this.isConnected = true;
            });

        } catch (error) {
            console.error('❌ Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            console.log('ℹ️ MongoDB já está desconectado');
            return;
        }

        try {
            console.log('🔌 Desconectando do MongoDB...');
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('✅ MongoDB desconectado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao desconectar do MongoDB:', error);
            throw error;
        }
    }

    public static async trackOperation<T>(
        operation: string,
        collection: string,
        callback: () => Promise<T>
    ): Promise<T> {
        const startTime = Date.now();
        console.log(`⏱️ Iniciando operação ${operation} na coleção ${collection}`);

        try {
            const result = await callback();
            const duration = Date.now() - startTime;
            console.log(`✅ Operação ${operation} concluída em ${duration}ms`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Erro na operação ${operation} após ${duration}ms:`, error);
            throw error;
        }
    }
}