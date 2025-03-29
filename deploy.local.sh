#!/bin/bash

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

# Cria o namespace se não existir
kubectl create namespace nimage --dry-run=client -o yaml | kubectl apply -f -

# Constrói a imagem local
echo "Construindo imagem Docker..."
docker build -t nimage-app:local .

# Aplica os manifestos do Kubernetes
echo "Aplicando manifestos do Kubernetes..."
kubectl apply -f k8s/configmap.yaml -n nimage
kubectl apply -f k8s/mongodb.yaml -n nimage
kubectl apply -f k8s/redis.yaml -n nimage
kubectl apply -f k8s/ollama.yaml -n nimage
kubectl apply -f k8s/deployment.yaml -n nimage
kubectl apply -f k8s/service.yaml -n nimage

# Aguarda os pods estarem prontos
echo "Aguardando pods estarem prontos..."
kubectl wait --for=condition=ready pod -l app=nimage -n nimage --timeout=300s

# Obtém o IP do serviço
echo "Obtendo IP do serviço..."
SERVICE_IP=$(kubectl get service nimage-service -n nimage -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Aplicação está disponível em: http://$SERVICE_IP:3001" 