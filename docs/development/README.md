# Guia de Desenvolvimento

Este guia fornece informações detalhadas sobre o processo de desenvolvimento do Nimage.

## 🛠️ Ambiente de Desenvolvimento

### Configuração do Editor

Recomendamos usar o VS Code com as seguintes extensões:

- ESLint
- Prettier
- GitLens
- Docker
- Kubernetes
- REST Client

### Configuração do TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 📝 Convenções de Código

### Nomenclatura

- **Classes**: PascalCase (ex: `UserService`)
- **Interfaces**: PascalCase com prefixo 'I' (ex: `IUserRepository`)
- **Funções**: camelCase (ex: `getUserById`)
- **Variáveis**: camelCase (ex: `userId`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_RETRIES`)
- **Arquivos**: kebab-case (ex: `user-service.ts`)

### Estrutura de Arquivos

```
src/
  ├── application/
  │   ├── services/
  │   │   └── user-service.ts
  │   └── use-cases/
  │       └── create-user.ts
  ├── domain/
  │   ├── entities/
  │   │   └── user.ts
  │   └── repositories/
  │       └── i-user-repository.ts
  └── infrastructure/
      └── repositories/
          └── user-repository.ts
```

## 🔄 Git Flow

### Branches

- `develop`: Branch principal de desenvolvimento
- `feature/*`: Novas funcionalidades
- `release/*`: Preparação de releases
- `hotfix/*`: Correções urgentes

### Commits

Siga o formato [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### Versionamento

O projeto usa versionamento semântico automático:

- `feat:` -> Incrementa MINOR
- `fix:` -> Incrementa PATCH
- `BREAKING` ou `!:` -> Incrementa MAJOR

## 🧪 Testes

### Unitários

```bash
# Executar todos os testes
npm test

# Executar testes específicos
npm test -- src/application/services/user-service.test.ts

# Modo watch
npm test -- --watch
```

### Cobertura

```bash
# Gerar relatório de cobertura
npm test -- --coverage
```

### E2E

```bash
# Executar testes E2E
npm run test:e2e
```

## 🔍 Linting e Formatação

```bash
# Executar linter
npm run lint

# Corrigir problemas automaticamente
npm run lint -- --fix

# Formatar código
npm run format
```

## 📦 Dependências

### Gerenciamento

```bash
# Adicionar dependência
npm install package-name

# Adicionar dependência de desenvolvimento
npm install --save-dev package-name

# Atualizar dependências
npm update
```

### Auditoria

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

## 🐳 Docker

### Desenvolvimento

```bash
# Construir imagem
docker build -f Dockerfile.dev -t nimage-dev .

# Executar container
docker run -p 3001:3001 -v $(pwd):/app nimage-dev
```

### Produção

```bash
# Construir imagem
docker build -t nimage .

# Executar container
docker run -p 3001:3001 nimage
```

## 🔄 CI/CD

### GitHub Actions

O projeto usa GitHub Actions para:

- Testes automatizados
- Linting
- Build
- Deploy

### Workflows

- `ci.yml`: Executa testes e linting
- `deploy.yml`: Deploy para produção
- `release.yml`: Gerenciamento de releases

## 📚 Documentação

### API

```bash
# Gerar documentação da API
npm run docs:api
```

### Código

```bash
# Gerar documentação do código
npm run docs:code
```

## 🐛 Debugging

### VS Code

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Program",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json"
    }
  ]
}
```

### Logs

```bash
# Logs de desenvolvimento
npm run dev

# Logs de produção
npm start
```

## 🔒 Segurança

### Variáveis de Ambiente

```bash
# Desenvolvimento
cp .env.example .env.development

# Produção
cp .env.example .env.production
```

### Secrets

- Use variáveis de ambiente
- Não commite arquivos `.env`
- Use secrets do GitHub Actions

## 📊 Performance

### Otimizações

- Cache Redis
- Índices MongoDB
- Queries otimizadas
- Rate limiting

### Monitoramento

- Health checks
- Métricas Prometheus
- Logs estruturados 