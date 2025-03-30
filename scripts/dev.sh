#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando ambiente de desenvolvimento...${NC}"

# Parar e remover containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose down

# Remover imagens antigas
echo -e "${YELLOW}🧹 Removendo imagens antigas...${NC}"
docker-compose rm -f

# Construir imagens novamente
echo -e "${YELLOW}🏗️  Construindo imagens...${NC}"
docker-compose build --no-cache

# Iniciar containers em modo desenvolvimento
echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose up -d

# Verificar status dos containers
echo -e "${YELLOW}🔍 Verificando status dos containers...${NC}"
docker-compose ps

# Verificar logs
echo -e "${YELLOW}📝 Logs dos containers:${NC}"
docker-compose logs -f &

# Iniciar a aplicação em modo desenvolvimento
echo -e "${YELLOW}🚀 Iniciando aplicação em modo desenvolvimento...${NC}"
npm run dev