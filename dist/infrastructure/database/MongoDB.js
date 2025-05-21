"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../config");
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin";
//const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@127.0.0.1:27017/nimage?authSource=admin";
class MongoDB {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }
    async connect() {
        if (this.isConnected) {
            console.log('🔄 MongoDB já está conectado');
            return;
        }
        try {
            console.log('🔌 Conectando ao MongoDB...');
            await mongoose_1.default.connect(config_1.config.mongoUri);
            this.isConnected = true;
            console.log('✅ MongoDB conectado com sucesso');
            mongoose_1.default.connection.on('error', (error) => {
                console.error('❌ Erro na conexão com MongoDB:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB desconectado');
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconectado');
                this.isConnected = true;
            });
        }
        catch (error) {
            console.error('❌ Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            console.log('ℹ️ MongoDB já está desconectado');
            return;
        }
        try {
            console.log('🔌 Desconectando do MongoDB...');
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('✅ MongoDB desconectado com sucesso');
        }
        catch (error) {
            console.error('❌ Erro ao desconectar do MongoDB:', error);
            throw error;
        }
    }
    static async trackOperation(operation, collection, callback) {
        const startTime = Date.now();
        console.log(`⏱️ Iniciando operação ${operation} na coleção ${collection}`);
        try {
            const result = await callback();
            const duration = Date.now() - startTime;
            console.log(`✅ Operação ${operation} concluída em ${duration}ms`);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Erro na operação ${operation} após ${duration}ms:`, error);
            throw error;
        }
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=MongoDB.js.map