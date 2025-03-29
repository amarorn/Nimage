#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações
REGISTRY="registry.digitalocean.com"
REPOSITORY="nimage"
IMAGE_NAME="app"
TAG="latest"

echo -e "${YELLOW}🚀 Iniciando processo de deploy em produção...${NC}"

# Verifica se o doctl está instalado
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ doctl não está instalado. Por favor, instale o doctl primeiro.${NC}"
    exit 1
fi

# Verifica se está autenticado no DigitalOcean
if ! doctl account get &> /dev/null; then
    echo -e "${RED}❌ Não está autenticado no DigitalOcean. Por favor, faça login primeiro.${NC}"
    echo -e "${YELLOW}Use: doctl auth init${NC}"
    exit 1
fi

# Para containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose -f docker-compose.prod.yml down

# Remove imagens antigas
echo -e "${YELLOW}🧹 Removendo imagens antigas...${NC}"
docker system prune -f

# Pull da imagem mais recente do registry
echo -e "${YELLOW}📥 Baixando imagem mais recente do registry...${NC}"
docker pull ${REGISTRY}/${REPOSITORY}/${IMAGE_NAME}:${TAG}

# Inicia os containers
echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Verifica o status dos containers
echo -e "${YELLOW}📊 Verificando status dos containers...${NC}"
docker-compose -f docker-compose.prod.yml ps

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}" 