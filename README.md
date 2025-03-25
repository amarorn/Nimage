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

API em Node.js com TypeScript seguindo Clean Architecture

## Configuração do Ambiente

### Pré-requisitos

- Node.js v16 ou superior
- MongoDB
- Redis
- Docker (opcional)
- Docker Compose (opcional)

### Instalação

#### Usando Docker (Recomendado)

1. Clone o repositório
2. Execute o ambiente de desenvolvimento:
```bash
docker-compose -f docker-compose.dev.yml up
```

O servidor estará disponível em `http://localhost:3001`

#### Instalação Manual

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme seu ambiente

4. Inicie o MongoDB e Redis:
```bash
docker-compose up mongodb redis
```

5. Inicie o servidor:
```bash
npm run dev
```

### Variáveis de Ambiente

- `MONGO_URI`: URL de conexão com o MongoDB
- `PORT`: Porta do servidor (padrão: 3001)
- `REDIS_URL`: URL de conexão com o Redis (padrão: redis://localhost:6379)

### Cache Redis

O projeto utiliza Redis para cache das seguintes entidades:
- Equipes
- Vendedores
- Metas
- Atividades

Cada entidade possui seu próprio serviço de cache com TTL configurável.

### Scripts Disponíveis

- `npm run build`: Compila o projeto
- `npm run start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em desenvolvimento com hot-reload
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código
- `npm run test`: Executa os testes

### Docker

O projeto inclui configurações Docker para desenvolvimento e produção:

- `docker-compose.yml`: Configuração padrão com MongoDB e Redis
- `docker-compose.dev.yml`: Configuração de desenvolvimento completa
- `Dockerfile.dev`: Configuração do container da aplicação para desenvolvimento

Para iniciar apenas os serviços de banco de dados:
```bash
docker-compose up mongodb redis
```

Para iniciar o ambiente de desenvolvimento completo:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Estrutura do Projeto

```
src/
  ├── application/      # Casos de uso da aplicação
  ├── domain/          # Entidades e regras de negócio
  ├── infrastructure/  # Implementações de interfaces
  │   └── cache/      # Serviços de cache Redis
  └── presentation/    # Controllers e rotas
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request


