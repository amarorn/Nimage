# Use a imagem base do Node.js
FROM node:18-alpine AS builder

# Instale curl para healthcheck
RUN apk add --no-cache curl

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./

# Instale todas as dependências (incluindo as de desenvolvimento)
RUN npm ci

# Copie o restante do código da aplicação
COPY . .

# Compile o TypeScript para JavaScript
RUN npm run build

# Imagem de produção
FROM node:18-alpine

# Instale curl para healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copie apenas os arquivos necessários do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Exponha a porta que a aplicação irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]