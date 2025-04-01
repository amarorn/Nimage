#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para limpeza completa
clean_all() {
    echo -e "${YELLOW}🧹 Realizando limpeza completa...${NC}"
    docker rm -f $(docker ps -aq)
    docker rmi -f $(docker images -q)
    docker volume prune -f
    docker network prune -f
}

# Função para reinicialização rápida
fast_restart() {
    echo -e "${YELLOW}🔄 Reinicialização rápida...${NC}"
    docker rm -f mongodb redis ollama 2>/dev/null || true
}

# Função para esperar um serviço estar pronto
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=15
    local attempt=1

    echo -e "${YELLOW}⏳ Aguardando $service...${NC}"
    while ! nc -z localhost $port; do
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}❌ $service não iniciou após $max_attempts tentativas${NC}"
            exit 1
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    echo -e "${GREEN}✅ $service pronto!${NC}"
}

# Verificar argumentos
if [ "$1" = "--clean" ]; then
    echo -e "${YELLOW}🚀 Iniciando ambiente com limpeza completa...${NC}"
    clean_all
else
    echo -e "${YELLOW}🚀 Iniciando ambiente com reinicialização rápida...${NC}"
    fast_restart
fi

# Liberar porta 3001 se estiver em uso
echo -e "${YELLOW}🔓 Liberando porta 3001...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Criar rede para os containers
echo -e "${YELLOW}🌐 Criando rede para os containers...${NC}"
docker network create nimage-network 2>/dev/null || true

# Iniciar MongoDB
echo -e "${YELLOW}🚀 Iniciando MongoDB...${NC}"
docker run -d \
    --name mongodb \
    --network nimage-network \
    --restart unless-stopped \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=example \
    -v mongodb_data:/data/db \
    mongo:latest

# Iniciar Redis
echo -e "${YELLOW}🚀 Iniciando Redis...${NC}"
docker run -d \
    --name redis \
    --network nimage-network \
    --restart unless-stopped \
    -p 6379:6379 \
    -v redis_data:/data \
    redis:latest redis-server --appendonly yes

# Iniciar Ollama
echo -e "${YELLOW}🚀 Iniciando Ollama...${NC}"
docker run -d \
    --name ollama \
    --network nimage-network \
    --restart unless-stopped \
    -p 11434:11434 \
    -v ollama_data:/root/.ollama \
    ollama/ollama:latest

# Aguardar serviços essenciais
wait_for_service "MongoDB" 27017 &
wait_for_service "Redis" 6379 &
wait_for_service "Ollama" 11434 &

# Aguardar todos os processos em background terminarem
wait

# Aguardar um pouco mais para garantir que o Redis esteja pronto
echo -e "${YELLOW}⏳ Aguardando Redis inicializar completamente...${NC}"
sleep 5

# Verificar status dos containers
echo -e "${YELLOW}🔍 Status dos containers:${NC}"
docker ps

# Iniciar logs em background
echo -e "${YELLOW}📝 Logs dos containers:${NC}"
docker logs -f mongodb redis ollama &

# Iniciar a aplicação em modo desenvolvimento
echo -e "${YELLOW}🚀 Iniciando modo desenvolvimento...${NC}"
ts-node-dev --respawn --transpile-only src/server.ts