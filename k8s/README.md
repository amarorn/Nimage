# Deploy no Kubernetes

Este diretório contém os manifestos necessários para fazer o deploy da aplicação Nimage no Kubernetes.

## Pré-requisitos

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)
- Conta no DigitalOcean com créditos suficientes
- Docker instalado localmente
- Domínio configurado (api.nimage.com.br e monitoring.nimage.com.br)
- Conta AWS com acesso ao S3

## Configuração

1. Faça login no DigitalOcean:
```bash
doctl auth init
```

2. Configure as variáveis de ambiente necessárias no arquivo `configmap.yaml`:
- `MONGODB_URI`: URL de conexão com o MongoDB
- `REDIS_URI`: URL de conexão com o Redis
- `OLLAMA_URL`: URL do serviço Ollama (se estiver usando)

3. Configure a senha do MongoDB:
   - Edite o arquivo `mongodb-secret.yaml`
   - Gere uma senha em base64:
     ```bash
     echo -n "sua_senha" | base64
     ```
   - Substitua o valor de `mongodb-root-password` pela sua senha codificada em base64

4. Configure as credenciais da AWS:
   - Edite o arquivo `aws-secret.yaml`
   - Gere as credenciais em base64:
     ```bash
     echo -n "sua_access_key" | base64
     echo -n "sua_secret_key" | base64
     ```
   - Substitua os valores de `aws-access-key-id` e `aws-secret-access-key` pelas suas credenciais codificadas em base64

5. Configure o domínio:
   - Adicione um registro A apontando para o IP do cluster
   - Configure o certificado SSL usando cert-manager
   - Atualize o email no arquivo `cert-manager.yaml`

## Deploy

Para fazer o deploy da aplicação, execute:

```bash
./deploy.sh
```

Este script irá:
1. Verificar se o cluster existe, se não, criará um novo
2. Configurar o contexto do kubectl
3. Instalar o nginx-ingress
4. Instalar o cert-manager
5. Criar o namespace `nimage`
6. Criar o namespace `monitoring`
7. Aplicar todos os manifestos necessários
8. Aguardar os pods estarem prontos
9. Exibir o IP externo do serviço e as URLs dos domínios

## Monitoramento

Para verificar o status dos pods:
```bash
kubectl get pods -n nimage
```

Para ver os logs da aplicação:
```bash
kubectl logs -f deployment/nimage-app -n nimage
```

Para ver os logs do Ollama:
```bash
kubectl logs -f statefulset/ollama -n nimage
```

Para verificar o status do Ingress:
```bash
kubectl get ingress -n nimage
```

Para verificar o status do cert-manager:
```bash
kubectl get pods -n cert-manager
kubectl get certificates -n nimage
```

Para verificar o status do nginx-ingress:
```bash
kubectl get pods -n nginx-ingress
kubectl get service -n nginx-ingress
```

Para verificar o status do monitoring stack:
```bash
kubectl get pods -n monitoring
kubectl get ingress -n monitoring
```

Para verificar o status dos backups:
```bash
kubectl get cronjobs -n nimage
kubectl get jobs -n nimage
```

## Acessando o Monitoring Stack

1. Prometheus:
   - URL: https://monitoring.nimage.com.br/prometheus
   - Credenciais padrão: admin/admin

2. Grafana:
   - URL: https://monitoring.nimage.com.br/grafana
   - Credenciais padrão: admin/admin

## Backup e Restore do MongoDB

### Backup

O backup do MongoDB é executado automaticamente todos os dias à meia-noite e é armazenado no bucket S3 `nimage-backups`. Os backups são mantidos por 30 dias.

Para executar um backup manual:
```bash
kubectl create job --from=cronjob/mongodb-backup manual-backup-$(date +%s) -n nimage
```

### Restore

Para restaurar um backup do MongoDB:

1. Primeiro, verifique os backups disponíveis:
```bash
aws s3 ls s3://nimage-backups/
```

2. Execute o restore:
```bash
kubectl apply -f mongodb-restore.yaml -n nimage
```

3. Monitore o progresso:
```bash
kubectl get pods -n nimage -l job-name=mongodb-restore
kubectl logs -f job/mongodb-restore -n nimage
```

## Limpeza

Para remover todos os recursos:
```bash
kubectl delete namespace nimage
kubectl delete namespace nginx-ingress
kubectl delete namespace monitoring
```

## Estrutura dos Manifests

- `configmap.yaml`: Configurações da aplicação
- `deployment.yaml`: Deployment da aplicação
- `service.yaml`: Serviço para expor a aplicação
- `mongodb.yaml`: Estado e serviço do MongoDB
- `mongodb-secret.yaml`: Secret com a senha do MongoDB
- `aws-secret.yaml`: Secret com as credenciais da AWS
- `redis.yaml`: Estado e serviço do Redis
- `ollama.yaml`: Estado e serviço do Ollama
- `ingress.yaml`: Configuração do Ingress com SSL
- `cert-manager.yaml`: Configuração do cert-manager para SSL
- `nginx-ingress.yaml`: Configuração do nginx-ingress
- `monitoring.yaml`: Stack de monitoramento (Prometheus + Grafana)
- `mongodb-backup.yaml`: Configuração do backup automático do MongoDB
- `mongodb-restore.yaml`: Configuração do restore do MongoDB 