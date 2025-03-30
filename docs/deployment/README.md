# Guia de Deployment

Este guia fornece instruções detalhadas para implantar o Nimage em diferentes ambientes.

## 🚀 Preparação

### Pré-requisitos

- Docker e Docker Compose
- Kubernetes (para deploy em cluster)
- Helm (opcional, para gerenciamento de pacotes)
- kubectl (para interação com clusters Kubernetes)

### Configuração de Ambiente

1. Configure as variáveis de ambiente:
```bash
cp .env.example .env.production
```

2. Ajuste as configurações específicas do ambiente:
```bash
# Produção
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/nimage
REDIS_URL=redis://redis:6379
```

## 🐳 Deploy com Docker

### Construção da Imagem

```bash
# Construir imagem de produção
docker build -t nimage:latest .

# Verificar imagem
docker images | grep nimage
```

### Execução do Container

```bash
# Executar container
docker run -d \
  --name nimage \
  -p 3001:3001 \
  --env-file .env.production \
  nimage:latest
```

### Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Logs
docker-compose logs -f
```

## 🌐 Deploy em Kubernetes

### Configuração do Cluster

1. Configure o contexto do Kubernetes:
```bash
kubectl config use-context seu-cluster
```

2. Crie o namespace:
```bash
kubectl create namespace nimage
```

### Deploy dos Recursos

1. Aplique os manifests:
```bash
# ConfigMaps e Secrets
kubectl apply -f k8s/config/

# Deployments e Services
kubectl apply -f k8s/deployments/
```

2. Verifique o status:
```bash
kubectl get pods -n nimage
kubectl get services -n nimage
```

### Helm (Opcional)

```bash
# Instalar chart
helm install nimage ./helm/nimage

# Atualizar chart
helm upgrade nimage ./helm/nimage

# Desinstalar chart
helm uninstall nimage
```

## 🔄 CI/CD Pipeline

### GitHub Actions

O pipeline de CI/CD inclui:

1. **Build e Testes**:
```yaml
- name: Build and Test
  run: |
    npm ci
    npm test
    npm run build
```

2. **Deploy**:
```yaml
- name: Deploy to Production
  run: |
    kubectl apply -f k8s/
```

### Rollback

```bash
# Rollback do deployment
kubectl rollout undo deployment/nimage

# Verificar histórico
kubectl rollout history deployment/nimage
```

## 📊 Monitoramento

### Prometheus e Grafana

1. Instale o stack de monitoramento:
```bash
helm install monitoring prometheus-community/kube-prometheus-stack
```

2. Configure os dashboards:
```bash
kubectl apply -f k8s/monitoring/
```

### Logs

```bash
# Logs dos pods
kubectl logs -f deployment/nimage

# Logs específicos
kubectl logs -f deployment/nimage -c nimage
```

## 🔒 Segurança

### Secrets

1. Crie os secrets:
```bash
kubectl create secret generic nimage-secrets \
  --from-file=.env.production \
  -n nimage
```

2. Configure o uso nos deployments:
```yaml
envFrom:
  - secretRef:
      name: nimage-secrets
```

### Network Policies

```bash
# Aplique as políticas de rede
kubectl apply -f k8s/network-policies/
```

## 📈 Escalabilidade

### HPA (Horizontal Pod Autoscaling)

```bash
# Criar HPA
kubectl autoscale deployment nimage \
  --cpu-percent=80 \
  --min=2 \
  --max=10 \
  -n nimage
```

### Recursos

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

## 🔍 Troubleshooting

### Verificação de Saúde

```bash
# Verificar endpoints
kubectl get endpoints -n nimage

# Verificar eventos
kubectl get events -n nimage
```

### Debug

```bash
# Executar pod em modo debug
kubectl debug nimage-xxxxx -it --image=busybox

# Port-forward para debug local
kubectl port-forward svc/nimage 3001:3001
```

## 📝 Manutenção

### Backup

```bash
# Backup do MongoDB
kubectl exec -it mongodb-0 -- mongodump --out /backup

# Backup do Redis
kubectl exec -it redis-0 -- redis-cli SAVE
```

### Atualização

```bash
# Atualizar imagem
kubectl set image deployment/nimage nimage=nimage:new-version

# Verificar rollout
kubectl rollout status deployment/nimage
``` 