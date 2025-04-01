export const RedisConfig = {
    url: process.env.REDIS_URL || 'redis://redis:6379',

    ttl: {
        default: 3600, // 1 hora
        equipe: 3600,
        vendedor: 3600,
        meta: 3600,
        atividade: 3600,
        equipeMeta: 1800 // 30 minutos
    },
    keyPrefixes: {
        equipe: 'equipe:',
        vendedor: 'vendedor:',
        meta: 'meta:',
        atividade: 'atividade:',
        equipeMeta: 'equipe-meta:'
    }
}; 