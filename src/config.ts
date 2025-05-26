export const config = {
    mongoUri: process.env.MONGO_URI || "mongodb+srv://root:VTTgLMuwxpgCbjRw@cluster0.xft7o.mongodb.net/nimage?authSource=admin",
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    cache: {
        ttl: 3600, // 1 hora em segundos
        checkPeriod: 600 // 10 minutos em segundos
    }
}; 