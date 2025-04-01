#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando ambiente de desenvolvimento...${NC}"

# Liberar portas
echo -e "${YELLOW}🔓 Liberando portas...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:9090 | xargs kill -9 2>/dev/null || true
lsof -ti:6379 | xargs kill -9 2>/dev/null || true
lsof -ti:27017 | xargs kill -9 2>/dev/null || true
lsof -ti:11434 | xargs kill -9 2>/dev/null || true
echo -e "${GREEN}✅ Portas liberadas!${NC}"

# Parar e remover containers existentes de forma mais agressiva
echo -e "${YELLOW}🛑 Parando e removendo containers existentes...${NC}"
docker-compose down --remove-orphans --volumes
docker-compose rm -f -s -v
docker system prune -f

# Remover containers antigos
echo -e "${YELLOW}🧹 Removendo containers antigos...${NC}"
docker-compose rm -f

# Construir imagens novamente
echo -e "${YELLOW}🏗️  Construindo imagens...${NC}"
docker-compose build --no-cache

# Iniciar containers em modo desenvolvimento
echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose up -d

# Aguardar Redis estar pronto
echo -e "${YELLOW}⏳ Aguardando Redis estar pronto...${NC}"
until docker-compose exec -T redis redis-cli ping; do
    echo -e "${YELLOW}🔄 Redis ainda não está pronto, tentando novamente em 2 segundos...${NC}"
    sleep 2
done
echo -e "${GREEN}✅ Redis está pronto!${NC}"

# Verificar status dos containers
echo -e "${YELLOW}🔍 Verificando status dos containers...${NC}"
docker-compose ps

# Verificar logs
echo -e "${YELLOW}📝 Logs dos containers:${NC}"
docker-compose logs -f &

# Iniciar a aplicação em modo desenvolvimento
echo -e "${YELLOW}🚀 Iniciando aplicação em modo desenvolvimento...${NC}"
ts-node-dev --respawn --transpile-only src/server.ts

# Função para limpar ao sair
cleanup() {
    echo -e "${YELLOW}🛑 Parando containers...${NC}"
    docker-compose down --remove-orphans --volumes
    docker-compose rm -f -s -v
    docker system prune -f
    exit 0
}

# Registrar a função de limpeza
trap cleanup SIGINT SIGTERM