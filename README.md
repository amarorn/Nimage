
![Docker Image Version](https://img.shields.io/docker/v/angellorn/nimage)
![Docker Pulls](https://img.shields.io/docker/pulls/angellorn/nimage)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/angellorn/nimage/api-1.0.1)
![GitHub pull request check contexts](https://img.shields.io/github/status/contexts/pulls/amarorn/Nimage/18)
![MyGet Downloads](https://img.shields.io/myget/mongodb/dt/MongoDB.Driver.Core?logo=mongodb)
![GitHub last commit](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)

```markdown
# Nimage

Nimage é uma API em Node.js construída com TypeScript, seguindo os princípios da Arquitetura Limpa. Ela oferece um framework robusto para gerenciar equipes, vendedores, atividades e métricas de desempenho.

## Índice

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Clean Architecture**: Separação de responsabilidades com foco em manutenibilidade e escalabilidade.
- **TypeScript**: Recursos de linguagem fortemente tipada para melhor qualidade de código
- **Express.js**: Framework web rápido e minimalista para Node.js.
- **MongoDB**: Integração com banco de dados NoSQL para persistência de dados.
- **Performance Metrics**: Calcular e rastrear métricas de desempenho diárias e totais para membros da equipe.
- **CRUD Operations**: Criar, ler, atualizar e deletar operações para equipes, vendedores e atividades.


## Instalação

Para começar a usar o Nimage, siga estes passos:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seuusuario/nimage.git
   cd nimage
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` no diretório raiz e configure sua string de conexão com o MongoDB e outras variáveis de ambiente necessárias.

4. **Compile o projeto**:
   ```bash
   npm run build
   ```

5. **Inicie o servidor**:
   ```bash
   npm start
   ```

## Uso

Com o servidor em execução, você pode acessar a API em `http://localhost:3000`. Use ferramentas como Postman ou cURL para interagir com os endpoints.

## Endpoints da API

Aqui estão alguns dos principais endpoints da API disponíveis:

- **Verificação de Saúde**: `GET /health` - Verifica se o serviço está em execução.
- **Equipes**:
  - `POST /api/equipes` - Cria uma nova equipe.
  - `GET /api/equipes/all` - Recupera todas as equipes.
  - `GET /api/equipes/:id` - Obtém detalhes de uma equipe específica.
  - `PUT /api/equipes/:id` - Atualiza uma equipe específica.
  - `GET /api/equipes/:equipeId/calcular-meta` - Calcula métricas de desempenho para uma equipe.

- **Vendedores**:
  - `POST /api/vendedores` - Cria um novo vendedor.
  - `GET /api/vendedores/all` - Recupera todos os vendedores.
  - `GET /api/vendedores/:id` - Obtém detalhes de um vendedor específico.
  - `PUT /api/vendedores/:id` - Atualiza um vendedor específico.

- **Atividades**:
  - `POST /api/atividades` - Registra uma nova atividade.
  - `GET /api/atividades/all` - Recupera todas as atividades.
  - `GET /api/atividades/:id` - Obtém detalhes de uma atividade específica.
  - `PUT /api/atividades/:id` - Atualiza uma atividade específica.

- **Metas**:
  - `POST /api/metas` - Cria uma nova meta.
  - `GET /api/metas/all` - Recupera todas as metas.
  - `GET /api/metas/:id` - Obtém detalhes de uma meta específica.
  - `PUT /api/metas/:id` - Atualiza uma meta específica.

```