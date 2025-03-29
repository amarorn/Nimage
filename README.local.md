# Nimage - Ambiente Local

Este documento contém instruções para configurar e executar o projeto Nimage em um ambiente local usando Docker Desktop com Kubernetes.

## Pré-requisitos

- Docker Desktop instalado e configurado
- Kubernetes habilitado no Docker Desktop
- kubectl instalado
- Git instalado

## Configuração do Ambiente

1. Certifique-se de que o Docker Desktop está rodando e que o Kubernetes está habilitado:
   - Abra o Docker Desktop
   - Vá para Settings > Kubernetes
   - Marque a opção "Enable Kubernetes"
   - Clique em "Apply & Restart"

2. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/nimage.git
cd nimage
```

3. Execute o script de deploy local:
```bash
./deploy.local.sh
```

## Verificação do Deploy

Para verificar o status dos pods:
```bash
kubectl get pods -n nimage
```

Para ver os logs da aplicação:
```bash
kubectl logs -f deployment/nimage-app -n nimage
```

Para ver os logs do MongoDB:
```bash
kubectl logs -f statefulset/mongodb -n nimage
```

Para ver os logs do Redis:
```bash
kubectl logs -f statefulset/redis -n nimage
```

Para ver os logs do Ollama:
```bash
kubectl logs -f statefulset/ollama -n nimage
```

## Acessando a Aplicação

A aplicação estará disponível em:
- API: http://localhost:3001
- MongoDB: localhost:27017
- Redis: localhost:6379
- Ollama: http://localhost:11434

## Limpeza

Para remover todos os recursos:
```bash
kubectl delete namespace nimage
```

## Solução de Problemas

1. Se os pods não iniciarem, verifique os logs:
```bash
kubectl describe pod -n nimage
```

2. Se precisar reiniciar o deploy:
```bash
./deploy.local.sh
```

3. Se precisar reconstruir a imagem:
```bash
docker build -t nimage-app:local .
kubectl rollout restart deployment nimage-app -n nimage
```

## Estrutura do Projeto

- `docker-compose.local.yml`: Configuração dos serviços para ambiente local
- `deploy.local.sh`: Script para automatizar o deploy local
- `k8s/`: Diretório com os manifestos do Kubernetes
  - `configmap.yaml`: Configurações da aplicação
  - `deployment.yaml`: Deployment da aplicação
  - `service.yaml`: Serviço para expor a aplicação
  - `mongodb.yaml`: Estado e serviço do MongoDB
  - `redis.yaml`: Estado e serviço do Redis
  - `ollama.yaml`: Estado e serviço do Ollama 