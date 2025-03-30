# Git Flow - Projeto Nimage

Este documento descreve o processo de Git Flow utilizado no Projeto Nimage.

## Estrutura de Branches

- `master`: Branch principal que contém o código em produção
- `develop`: Branch de desenvolvimento que contém as últimas alterações
- `feature/*`: Branches para desenvolvimento de novas funcionalidades
- `release/*`: Branches para preparação de releases
- `hotfix/*`: Branches para correções urgentes em produção
- `support/*`: Branches para suporte a versões antigas

## Fluxo de Trabalho

### 1. Iniciando uma Nova Feature

```bash
# Criar e mudar para uma nova branch de feature
git flow feature start nome-da-feature

# Desenvolver a feature
# Fazer commits normalmente

# Finalizar a feature
git flow feature finish nome-da-feature
```

### 2. Preparando um Release

```bash
# Criar uma branch de release
git flow release start 1.0.0

# Fazer ajustes necessários
# Atualizar versão no package.json
# Atualizar changelog

# Finalizar o release
git flow release finish 1.0.0
```

### 3. Corrigindo um Bug em Produção

```bash
# Criar uma branch de hotfix
git flow hotfix start nome-do-hotfix

# Fazer as correções necessárias
# Fazer commits normalmente

# Finalizar o hotfix
git flow hotfix finish nome-do-hotfix
```

## Convenções de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações de formatação
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Atualizações de build, configurações, etc.

Exemplo:
```
feat: adiciona sistema de autenticação
fix: corrige bug no cálculo de metas
docs: atualiza README com novas instruções
```

## Processo de Code Review

1. Criar Pull Request da branch de feature para develop
2. Aguardar revisão e aprovação
3. Resolver conflitos se necessário
4. Merge após aprovação

## Tags e Versões

- Cada release deve ser tagado com a versão
- Formato: v1.0.0
- Seguir Semantic Versioning (MAJOR.MINOR.PATCH)

## Comandos Úteis

```bash
# Inicializar Git Flow
git flow init

# Listar todas as features
git flow feature list

# Listar todos os releases
git flow release list

# Listar todos os hotfixes
git flow hotfix list

# Visualizar status do Git Flow
git flow status
```

## Boas Práticas

1. Manter branches atualizadas com develop
2. Fazer commits frequentes e atômicos
3. Seguir as convenções de commits
4. Manter a documentação atualizada
5. Resolver conflitos localmente antes de fazer push
6. Não fazer merge direto em master ou develop 