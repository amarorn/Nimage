![Docker Image Version](https://img.shields.io/docker/v/angellorn/nimage)
![Docker Pulls](https://img.shields.io/docker/pulls/angellorn/nimage)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/angellorn/nimage/api-1.0.1)
![Docker Image Size (tag)](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![GitHub pull request check contexts](https://img.shields.io/github/status/contexts/pulls/amarorn/Nimage/18)
![MyGet Downloads](https://img.shields.io/badge/-MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=FFFFFF)
![MyGet Downloads](https://img.shields.io/badge/Clean_Architecture-0A0A0A?style=flat&logo=microservices&logoColor=white)
![GitHub last commit](https://shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=FFF&style=flat-square)
![Scrutinizer coverage (GitHub/Bitbucket) with branch](https://img.shields.io/scrutinizer/coverage/g/amarorn/Nimage/master)

# Nimage

API em Node.js com TypeScript seguindo Clean Architecture e suporte a Kubernetes

## Funcionalidades Principais

- Gerenciamento de equipes e vendedores
- Sistema de metas e atividades
- Cache distribuído com Redis
- Análise de desempenho com IA (Ollama)
- Monitoramento e health checks
- Suporte a múltiplos ambientes (dev/prod)

## Configuração do Ambiente

### Pré-requisitos

- Node.js v16 ou superior
- MongoDB
- Redis
- Ollama
- Docker
- Kubernetes
- kubectl

### Instalação

#### Usando Kubernetes (Recomendado)

1. Clone o repositório
2. Escolha o ambiente de deploy:
```bash
# Desenvolvimento
./deploy.sh dev

# Produção
./deploy.sh prd
```

O servidor estará disponível em:
- Dev: http://localhost:3001
- Prod: http://localhost:3001

#### Usando Docker Compose (Desenvolvimento Local)

```bash
docker-compose -f docker-compose.dev.yml up
```

#### Instalação Manual

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie `.env.example` para `.env`
- Ajuste as variáveis conforme seu ambiente

4. Inicie os serviços:
```bash
docker-compose up mongodb redis ollama
```

5. Inicie o servidor:
```bash
npm run dev
```

## Arquitetura

### Clean Architecture

```
src/
  ├── application/      # Casos de uso e serviços
  │   ├── services/    # Serviços da aplicação
  │   └── use-cases/   # Casos de uso
  ├── domain/          # Regras de negócio
  │   ├── entities/    # Entidades do domínio
  │   ├── models/      # Modelos de IA
  │   └── repositories/# Interfaces dos repositórios
  ├── infrastructure/  # Implementações
  │   ├── cache/      # Cache Redis
  │   ├── database/   # MongoDB
  │   └── repositories/# Implementações dos repositórios
  └── interfaces/     # Controllers e rotas
```

### Kubernetes

```
k8s/
├── dev/              # Configurações de desenvolvimento
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── mongodb.yaml
│   ├── redis.yaml
│   └── service.yaml
├── prd/              # Configurações de produção
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── mongodb.yaml
│   ├── redis.yaml
│   └── service.yaml
└── monitoring.yaml   # Configuração de monitoramento
```

## Serviços

### Cache Redis
- Cache distribuído para todas as entidades
- TTL configurável por tipo de entidade
- Invalidação automática em atualizações

### MongoDB
- Persistência principal de dados
- Backup automático configurado
- Índices otimizados para consultas frequentes

### Ollama
- Análise de desempenho com IA
- Treinamento de modelos personalizados
- Integração com dados históricos

## Monitoramento

- Health checks para todos os serviços
- Métricas de performance
- Logs estruturados
- Prometheus e Grafana integrados

## Scripts Disponíveis

- `npm run build`: Compila o projeto
- `npm run start`: Inicia em produção
- `npm run dev`: Inicia em desenvolvimento
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes
- `npm run generate-data`: Gera dados de teste

## Variáveis de Ambiente

### Aplicação
- `NODE_ENV`: Ambiente (development/production)
- `PORT`: Porta do servidor
- `LOG_LEVEL`: Nível de logs

### Banco de Dados
- `MONGO_URI`: URL do MongoDB
- `MONGO_DB_NAME`: Nome do banco

### Cache
- `REDIS_URL`: URL do Redis
- `REDIS_TTL`: Tempo de cache

### IA
- `OLLAMA_URL`: URL do serviço Ollama
- `MODEL_NAME`: Nome do modelo

## Contribuição

1. Fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.


