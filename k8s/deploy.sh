#!/bin/bash

# Verifica se o kubectl está instalado
if ! command -v kubectl &> /dev/null; then
    echo "kubectl não está instalado. Por favor, instale o kubectl primeiro."
    exit 1
fi

# Verifica se o doctl está instalado
if ! command -v doctl &> /dev/null; then
    echo "doctl não está instalado. Por favor, instale o doctl primeiro."
    exit 1
fi

# Verifica se está autenticado no DigitalOcean
if ! doctl account get &> /dev/null; then
    echo "Não está autenticado no DigitalOcean. Por favor, faça login primeiro."
    exit 1
fi

# Nome do cluster
CLUSTER_NAME="nimage-cluster"

# Verifica se o cluster existe
if ! doctl kubernetes cluster get $CLUSTER_NAME &> /dev/null; then
    echo "Criando cluster Kubernetes..."
    doctl kubernetes cluster create $CLUSTER_NAME \
        --region nyc1 \
        --size s-1vcpu-2gb \
        --count 2 \
        --wait
fi

# Configura o contexto do kubectl
doctl kubernetes cluster kubeconfig save $CLUSTER_NAME

# Cria o namespace nginx-ingress
kubectl create namespace nginx-ingress --dry-run=client -o yaml | kubectl apply -f -

# Instala o nginx-ingress
echo "Instalando nginx-ingress..."
kubectl apply -f nginx-ingress.yaml -n nginx-ingress

# Aguarda o nginx-ingress estar pronto
echo "Aguardando nginx-ingress estar pronto..."
kubectl wait --for=condition=ready pod -l app=nginx-ingress -n nginx-ingress --timeout=300s

# Instala o cert-manager
echo "Instalando cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml

# Aguarda o cert-manager estar pronto
echo "Aguardando cert-manager estar pronto..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s

# Cria o namespace se não existir
kubectl create namespace nimage --dry-run=client -o yaml | kubectl apply -f -

# Cria o namespace monitoring
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Aplica os manifestos
echo "Aplicando manifestos..."
kubectl apply -f configmap.yaml -n nimage
kubectl apply -f mongodb-secret.yaml -n nimage
kubectl apply -f aws-secret.yaml -n nimage
kubectl apply -f mongodb.yaml -n nimage
kubectl apply -f redis.yaml -n nimage
kubectl apply -f ollama.yaml -n nimage
kubectl apply -f deployment.yaml -n nimage
kubectl apply -f service.yaml -n nimage
kubectl apply -f cert-manager.yaml
kubectl apply -f ingress.yaml -n nimage
kubectl apply -f monitoring.yaml -n monitoring
kubectl apply -f mongodb-backup.yaml -n nimage

# Aguarda os pods estarem prontos
echo "Aguardando pods estarem prontos..."
kubectl wait --for=condition=ready pod -l app=nimage -n nimage --timeout=300s
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=300s
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=300s

# Obtém o IP externo do serviço
echo "Obtendo IP externo do serviço..."
EXTERNAL_IP=$(kubectl get service nginx-ingress -n nginx-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Aplicação está disponível em: http://$EXTERNAL_IP"
echo "Aplicação está disponível em: https://api.nimage.com.br"
echo "Monitoramento está disponível em: https://monitoring.nimage.com.br" 