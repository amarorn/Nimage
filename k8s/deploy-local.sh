#!/bin/bash

# Cria namespaces
kubectl create namespace nimage --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Aplica os manifestos
echo "Aplicando manifestos..."
kubectl apply -f configmap.yaml -n nimage
kubectl apply -f mongodb-secret.yaml -n nimage
kubectl apply -f mongodb.yaml -n nimage
kubectl apply -f redis.yaml -n nimage
kubectl apply -f ollama.yaml -n nimage
kubectl apply -f deployment.yaml -n nimage
kubectl apply -f service.yaml -n nimage
kubectl apply -f monitoring.yaml -n monitoring

# Aguarda os pods estarem prontos
echo "Aguardando pods estarem prontos..."
kubectl wait --for=condition=ready pod -l app=nimage -n nimage --timeout=300s
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=300s
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=300s

# Obtém as portas dos serviços
echo "Aplicação está disponível em:"
kubectl get svc -n nimage
echo "Monitoramento está disponível em:"
kubectl get svc -n monitoring 