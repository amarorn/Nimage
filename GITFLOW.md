# Git Flow - Projeto Nimage

Este documento descreve o processo de Git Flow e versionamento semântico utilizado no Projeto Nimage.

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

## Versionamento Semântico

O projeto utiliza versionamento semântico automático baseado nas mensagens de commit:

### Formato da Versão

`MAJOR.MINOR.PATCH` (exemplo: 1.2.3)

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades mantendo compatibilidade
- **PATCH**: Correções de bugs mantendo compatibilidade

### Incremento Automático

O versionamento é incrementado automaticamente baseado no tipo de commit:

- **MAJOR**: Commits com "BREAKING CHANGE" ou "!"
  - Exemplo: "feat!: nova API incompatível"
  - Resultado: 1.0.0 -> 2.0.0

- **MINOR**: Commits começando com "feat:"
  - Exemplo: "feat: nova funcionalidade"
  - Resultado: 1.0.0 -> 1.1.0

- **PATCH**: Commits começando com "fix:" ou outros
  - Exemplo: "fix: correção de bug"
  - Resultado: 1.0.0 -> 1.0.1

### Scripts de Versionamento

- `scripts/version-bump.sh`: Script principal de versionamento
- Hook `post-commit`: Executa o versionamento após cada commit

## Convenções de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações de formatação
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Atualizações de build, configurações, etc.

Exemplos:
```
feat: adiciona sistema de autenticação
fix: corrige bug no cálculo de metas
docs: atualiza README com novas instruções
feat!: nova API incompatível com versão anterior
```

## Processo de Code Review

1. Criar Pull Request da branch de feature para develop
2. Aguardar revisão e aprovação
3. Resolver conflitos se necessário
4. Merge após aprovação

## Tags e Versões

- Cada versão é automaticamente tagada
- Formato: v1.0.0
- Tags são criadas automaticamente pelo script de versionamento

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

# Ver histórico de versões
git tag -l
```

## Boas Práticas

1. Manter branches atualizadas com develop
2. Fazer commits frequentes e atômicos
3. Seguir as convenções de commits
4. Manter a documentação atualizada
5. Resolver conflitos localmente antes de fazer push
6. Não fazer merge direto em master ou develop 