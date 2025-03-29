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

echo -e "${YELLOW}🚀 Iniciando processo de build e push da imagem...${NC}"

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

# Build da imagem
echo -e "${YELLOW}🏗️  Construindo imagem...${NC}"
docker build -t ${REGISTRY}/${REPOSITORY}/${IMAGE_NAME}:${TAG} -f Dockerfile.prod .

# Push da imagem para o registry
echo -e "${YELLOW}📤 Enviando imagem para o registry...${NC}"
docker push ${REGISTRY}/${REPOSITORY}/${IMAGE_NAME}:${TAG}

echo -e "${GREEN}✅ Processo concluído com sucesso!${NC}" 