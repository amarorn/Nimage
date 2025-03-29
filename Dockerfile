# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Compila o TypeScript
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Instala o wait-for-it script para esperar serviços
RUN apk add --no-cache bash
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Instala apenas as dependências de produção
RUN npm ci --only=production

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Expõe a porta
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Comando para iniciar a aplicação com retry na conexão
CMD ["node", "dist/server.js"]