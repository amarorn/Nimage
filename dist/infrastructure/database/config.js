"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConfig = void 0;
exports.MongoConfig = {
    url: process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin",
    options: {
        serverSelectionTimeoutMS: 60000, // 60 segundos
        socketTimeoutMS: 90000, // 90 segundos
        connectTimeoutMS: 60000, // 60 segundos
    }
};
//# sourceMappingURL=config.js.map