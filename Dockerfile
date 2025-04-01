# Use a imagem base do Node.js
FROM node:18-alpine

# Instale curl e wget para healthcheck
RUN apk add --no-cache curl wget

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale todas as dependências (incluindo as de desenvolvimento)
RUN npm ci

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"]