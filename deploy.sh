#!/bin/bash

# Verifica se o ambiente foi especificado
if [ -z "$1" ]; then
    echo "Por favor, especifique o ambiente (dev ou prd)"
    echo "Uso: ./deploy.sh [dev|prd]"
    exit 1
fi

ENV=$1
NAMESPACE="nimage-$ENV"

# Verifica se o ambiente é válido
if [ "$ENV" != "dev" ] && [ "$ENV" != "prd" ]; then
    echo "Ambiente inválido. Use 'dev' ou 'prd'"
    exit 1
fi

# Verifica se o Docker Desktop está rodando
if ! docker info > /dev/null 2>&1; then
    echo "Docker Desktop não está rodando. Por favor, inicie o Docker Desktop primeiro."
    exit 1
fi

# Verifica se o Kubernetes está habilitado no Docker Desktop
if ! kubectl get nodes > /dev/null 2>&1; then
    echo "Kubernetes não está habilitado no Docker Desktop. Por favor, habilite o Kubernetes nas configurações do Docker Desktop."
    exit 1
fi

# Constrói a imagem local
echo "Construindo imagem Docker..."
docker build -t nimage-app:$ENV .

# Aplica os manifestos do Kubernetes
echo "Aplicando manifestos do Kubernetes para ambiente $ENV..."
kubectl apply -f k8s/$ENV/configmap.yaml
kubectl apply -f k8s/mongodb.yaml -n $NAMESPACE
kubectl apply -f k8s/redis.yaml -n $NAMESPACE
kubectl apply -f k8s/ollama.yaml -n $NAMESPACE
kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
kubectl apply -f k8s/service.yaml -n $NAMESPACE

# Aguarda os pods estarem prontos
echo "Aguardando pods estarem prontos..."
kubectl wait --for=condition=ready pod -l app=nimage -n $NAMESPACE --timeout=300s

# Obtém o IP do serviço
echo "Obtendo IP do serviço..."
SERVICE_IP=$(kubectl get service nimage-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Aplicação está disponível em: http://$SERVICE_IP:3001"

# Mostra o status dos pods
echo "Status dos pods:"
kubectl get pods -n $NAMESPACE 