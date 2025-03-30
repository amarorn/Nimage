# Começando com o Nimage

Este guia fornece instruções passo a passo para configurar e executar o projeto Nimage localmente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18 ou superior
- Docker e Docker Compose
- MongoDB
- Redis
- Ollama (para IA)

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/nimage.git
cd nimage
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

### 4. Inicie os Serviços

```bash
# Inicie MongoDB e Redis
docker-compose up -d mongodb redis

# Verifique se os serviços estão rodando
docker-compose ps
```

### 5. Inicie a Aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm start`: Inicia o servidor em modo produção
- `npm run lint`: Executa o linter
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes
- `npm run build`: Compila o projeto
- `npm run seed`: Gera dados de teste

## 🔍 Verificando a Instalação

### 1. Acesse a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3001
```

### 2. Verifique o Health Check

Acesse o endpoint de health check:
```
http://localhost:3001/health
```

Você deve ver uma resposta como:
```json
{
  "status": "ok",
  "timestamp": "2024-03-21T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ai": "ready"
  }
}
```

## 📚 Próximos Passos

### 1. Explore a Documentação

- [Documentação da API](api/README.md)
- [Arquitetura do Projeto](architecture/README.md)
- [Guia de Desenvolvimento](development/README.md)
- [Guia de Deployment](deployment/README.md)

### 2. Configure seu Editor

Recomendamos usar o VS Code com as seguintes extensões:

- ESLint
- Prettier
- GitLens
- Docker
- Kubernetes
- REST Client

### 3. Configure o Git Flow

```bash
# Inicialize o Git Flow
git flow init

# Crie uma feature
git flow feature start minha-feature

# Finalize uma feature
git flow feature finish minha-feature
```

## 🐛 Troubleshooting

### Logs

```bash
# Logs da aplicação
npm run dev

# Logs do Docker
docker-compose logs -f

# Logs específicos
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Status dos Serviços

```bash
# Verifique o status dos containers
docker-compose ps

# Verifique os logs de um serviço específico
docker-compose logs -f mongodb
```

### Problemas Comuns

1. **Porta em uso**
   ```bash
   # Verifique processos usando a porta
   lsof -i :3001
   ```

2. **Erro de conexão com MongoDB**
   ```bash
   # Verifique se o MongoDB está rodando
   docker-compose ps mongodb
   ```

3. **Erro de conexão com Redis**
   ```bash
   # Verifique se o Redis está rodando
   docker-compose ps redis
   ```

## 💬 Suporte

Se você encontrar problemas:

1. Verifique os logs
2. Consulte a documentação
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

## 📈 Monitoramento

### Health Check

```
http://localhost:3001/health
```

### Métricas

```
http://localhost:3001/metrics
```

### Logs

```bash
# Logs da aplicação
npm run dev

# Logs do Docker
docker-compose logs -f
```

## 🔒 Segurança

### Variáveis de Ambiente

- Não commite arquivos `.env`
- Use `.env.example` como template
- Mantenha secrets seguros

### Autenticação

```bash
# Gere um token JWT
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "senha123"}'
```

## 📊 Performance

### Cache

- Redis está configurado para cache
- TTL: 1 hora para dados estáticos
- TTL: 5 minutos para dados dinâmicos

### Otimizações

- Índices MongoDB
- Queries otimizadas
- Rate limiting 