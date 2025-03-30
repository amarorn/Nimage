# Documentação da API

Este documento descreve os endpoints e funcionalidades da API do Nimage.

## 📋 Visão Geral

A API do Nimage é construída com Node.js, TypeScript e Express, seguindo os princípios da Clean Architecture.

### Versão
- Atual: v1.0.1

### Base URL
```
http://localhost:3001/api/v1
```

## 🔑 Autenticação

A API utiliza autenticação via JWT (JSON Web Token).

### Headers
```
Authorization: Bearer <token>
```

### Obter Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## 📝 Endpoints

### Usuários

#### Criar Usuário

```http
POST /users
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### Listar Usuários

```http
GET /users
Authorization: Bearer <token>
```

#### Obter Usuário

```http
GET /users/:id
Authorization: Bearer <token>
```

#### Atualizar Usuário

```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "email": "novo@exemplo.com"
}
```

#### Deletar Usuário

```http
DELETE /users/:id
Authorization: Bearer <token>
```

### Imagens

#### Upload de Imagem

```http
POST /images
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <arquivo>
```

#### Listar Imagens

```http
GET /images
Authorization: Bearer <token>
```

#### Obter Imagem

```http
GET /images/:id
Authorization: Bearer <token>
```

#### Deletar Imagem

```http
DELETE /images/:id
Authorization: Bearer <token>
```

### Análise

#### Analisar Imagem

```http
POST /analysis
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageId": "id_da_imagem",
  "type": "object_detection"
}
```

#### Obter Resultados

```http
GET /analysis/:id
Authorization: Bearer <token>
```

## 🔍 Parâmetros de Query

### Paginação

```
?page=1&limit=10
```

### Ordenação

```
?sort=createdAt&order=desc
```

### Filtros

```
?type=object_detection&status=completed
```

## 📦 Respostas

### Sucesso

```json
{
  "success": true,
  "data": {
    // dados da resposta
  }
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem de erro",
    "details": {}
  }
}
```

## 🚨 Códigos de Erro

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## 📊 Rate Limiting

- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário

## 🔒 Segurança

### CORS

```javascript
{
  "origin": ["http://localhost:3000"],
  "methods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["Content-Type", "Authorization"]
}
```

### Validação

- Todos os inputs são validados usando Joi
- Sanitização de dados para prevenir XSS
- Proteção contra CSRF

## 📈 Performance

### Cache

- Redis para cache de respostas
- TTL: 1 hora para dados estáticos
- TTL: 5 minutos para dados dinâmicos

### Compressão

- Gzip para respostas > 1KB
- Brotli para navegadores modernos

## 🔄 Webhooks

### Eventos Disponíveis

- `image.uploaded`
- `image.analyzed`
- `analysis.completed`

### Configuração

```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://seu-dominio.com/webhook",
  "events": ["image.uploaded", "analysis.completed"],
  "secret": "seu_secret"
}
```

## 📝 Exemplos

### Upload e Análise

```bash
# 1. Upload da imagem
curl -X POST http://localhost:3001/api/v1/images \
  -H "Authorization: Bearer <token>" \
  -F "file=@imagem.jpg"

# 2. Iniciar análise
curl -X POST http://localhost:3001/api/v1/analysis \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"imageId": "id_da_imagem", "type": "object_detection"}'

# 3. Obter resultados
curl http://localhost:3001/api/v1/analysis/id_da_analise \
  -H "Authorization: Bearer <token>"
```

## 🔍 Health Check

```http
GET /health
```

Resposta:
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