# Arquitetura do Projeto

Este documento descreve a arquitetura do projeto Nimage, baseada nos princípios da Clean Architecture.

## 🏗️ Visão Geral

A arquitetura do projeto segue os princípios da Clean Architecture, dividindo a aplicação em camadas independentes e com responsabilidades bem definidas.

### Camadas

```
src/
├── application/     # Casos de uso e regras de aplicação
├── domain/         # Entidades e regras de negócio
├── infrastructure/ # Implementações concretas
└── interfaces/     # Controllers e adaptadores
```

## 🔄 Fluxo de Dados

1. **HTTP Request** → Controller
2. **Controller** → Use Case
3. **Use Case** → Domain Entities
4. **Use Case** → Repository Interface
5. **Repository Implementation** → Database/Cache
6. **Response** → HTTP Response

## 📦 Camadas em Detalhe

### 1. Domain Layer

- **Entities**: Objetos de domínio com regras de negócio
- **Value Objects**: Objetos imutáveis que representam conceitos do domínio
- **Repository Interfaces**: Definições de contratos para persistência
- **Domain Events**: Eventos que ocorrem no domínio

```typescript
// Exemplo de Entity
export class Image {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly metadata: ImageMetadata
  ) {}

  public analyze(): void {
    // Regras de negócio
  }
}

// Exemplo de Repository Interface
export interface IImageRepository {
  save(image: Image): Promise<void>;
  findById(id: string): Promise<Image>;
  findAll(): Promise<Image[]>;
}
```

### 2. Application Layer

- **Use Cases**: Implementação dos casos de uso
- **DTOs**: Objetos de transferência de dados
- **Application Services**: Orquestração de casos de uso
- **Application Events**: Eventos da camada de aplicação

```typescript
// Exemplo de Use Case
export class AnalyzeImageUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly aiService: IAIService
  ) {}

  async execute(imageId: string): Promise<AnalysisResult> {
    const image = await this.imageRepository.findById(imageId);
    return this.aiService.analyze(image);
  }
}
```

### 3. Infrastructure Layer

- **Repository Implementations**: Implementações concretas dos repositórios
- **External Services**: Integrações com serviços externos
- **Database**: Configurações e conexões com banco de dados
- **Cache**: Implementações de cache

```typescript
// Exemplo de Repository Implementation
export class MongoDBImageRepository implements IImageRepository {
  constructor(private readonly collection: Collection) {}

  async save(image: Image): Promise<void> {
    await this.collection.insertOne(image);
  }
}
```

### 4. Interface Layer

- **Controllers**: Manipulação de requisições HTTP
- **Middlewares**: Middlewares da aplicação
- **Routes**: Definição de rotas
- **Validators**: Validação de dados

```typescript
// Exemplo de Controller
export class ImageController {
  constructor(private readonly analyzeImageUseCase: AnalyzeImageUseCase) {}

  async analyze(req: Request, res: Response): Promise<void> {
    const { imageId } = req.params;
    const result = await this.analyzeImageUseCase.execute(imageId);
    res.json(result);
  }
}
```

## 🔄 Injeção de Dependência

O projeto utiliza injeção de dependência para desacoplar as camadas:

```typescript
// Container de DI
const container = new Container();

// Registro de dependências
container.register('IImageRepository', {
  useClass: MongoDBImageRepository
});

container.register('IAIService', {
  useClass: OllamaAIService
});
```

## 🗄️ Persistência

### MongoDB

- Armazenamento principal de dados
- Schemas e índices otimizados
- Transações quando necessário

### Redis

- Cache de respostas
- Sessões
- Rate limiting
- Filas de processamento

## 🤖 IA e Análise

### Ollama

- Modelos de IA para análise de imagens
- Detecção de objetos
- Classificação de imagens
- Processamento assíncrono

## 📊 Monitoramento

### Prometheus

- Métricas da aplicação
- Tempo de resposta
- Taxa de erros
- Uso de recursos

### Grafana

- Dashboards
- Alertas
- Visualização de métricas

## 🐳 Containerização

### Docker

- Imagens otimizadas
- Multi-stage builds
- Volumes para persistência

### Kubernetes

- Deployments
- Services
- ConfigMaps
- Secrets

## 🔒 Segurança

### Autenticação

- JWT
- Refresh tokens
- Rate limiting

### Autorização

- RBAC
- Permissões granulares
- Validação de tokens

## 📈 Performance

### Otimizações

- Cache Redis
- Índices MongoDB
- Queries otimizadas
- Rate limiting

### Monitoramento

- Health checks
- Métricas Prometheus
- Logs estruturados

## 🔄 CI/CD

### GitHub Actions

- Testes automatizados
- Linting
- Build
- Deploy

### Workflows

- `ci.yml`: Executa testes e linting
- `deploy.yml`: Deploy para produção
- `release.yml`: Gerenciamento de releases

## 📝 Documentação

### API

- Swagger/OpenAPI
- Exemplos de uso
- Códigos de erro

### Código

- JSDoc
- TypeScript
- READMEs por módulo

## 🧪 Testes

### Unitários

- Jest
- Mocks
- Stubs
- Assertions

### E2E

- Cypress
- Cenários reais
- Integração

### Cobertura

- Relatórios
- Thresholds
- SonarQube 