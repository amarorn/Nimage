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
  - `GET /api/equipes/:equipeId/calcular-meta` - Calcula métricas de desempenho para uma equipe.

- **Vendedores**:
  - `POST /api/vendedores` - Cria um novo vendedor.
  - `GET /api/vendedores/all` - Recupera todos os vendedores.

- **Atividades**:
  - `POST /api/atividades` - Registra uma nova atividade.
  - `GET /api/atividades/all` - Recupera todas as atividades.

## Contribuição

Contribuições são bem-vindas! Por favor, leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para orientações sobre como contribuir para este projeto.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```