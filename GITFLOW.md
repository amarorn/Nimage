# Git Flow - Projeto Nimage

Este documento descreve o processo de Git Flow e versionamento semântico utilizado no Projeto Nimage.

## Configuração do Git Flow

O projeto utiliza as seguintes configurações do Git Flow:

```ini
[gitflow "branch"]
    master = master
    develop = develop
    feature = feature/
    release = release/
    hotfix = hotfix/
    support = support/
    versiontag = v
```

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
```bash
# Nova funcionalidade
git commit -m "feat: adiciona autenticação JWT"

# Correção de bug
git commit -m "fix: corrige validação de email"

# Alteração na documentação
git commit -m "docs: atualiza README com novas instruções"

# Mudança incompatível
git commit -m "feat!: remove suporte a versão antiga da API"
```

## Configuração Inicial

Para configurar o Git Flow em um novo ambiente:

1. Instale o Git Flow:
```bash
# macOS
brew install git-flow

# Linux
sudo apt-get install git-flow
```

2. Inicialize o Git Flow no projeto:
```bash
git flow init
```

3. Configure o versionamento automático:
```bash
# Torne o script executável
chmod +x scripts/version-bump.sh

# Configure o hook post-commit
cp scripts/post-commit .git/hooks/
chmod +x .git/hooks/post-commit
```

## Boas Práticas

1. **Commits Atômicos**: Cada commit deve representar uma única mudança
2. **Mensagens Descritivas**: Use mensagens claras e descritivas
3. **Branch Naming**: Use nomes descritivos para as branches
4. **Code Review**: Faça review do código antes de merge
5. **Testes**: Mantenha os testes atualizados e passando

## Troubleshooting

### Problemas Comuns

1. **Conflitos de Merge**
   - Resolva os conflitos manualmente
   - Use `git status` para ver arquivos conflitantes
   - Use `git add` após resolver conflitos

2. **Versionamento Incorreto**
   - Verifique a mensagem do último commit
   - Confirme se o hook post-commit está ativo
   - Verifique os logs do script de versionamento

3. **Branch Perdida**
   - Use `git reflog` para encontrar commits perdidos
   - Recupere a branch com `git checkout -b branch-name commit-hash`

## Suporte

Para suporte adicional:
- Consulte a [documentação oficial do Git Flow](https://github.com/nvie/gitflow)
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento 