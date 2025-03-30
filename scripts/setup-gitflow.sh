#!/bin/bash

# Verifica se o git-flow está instalado
if ! command -v git-flow &> /dev/null; then
    echo "git-flow não está instalado. Instalando..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git-flow
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install git-flow
    else
        echo "Sistema operacional não suportado"
        exit 1
    fi
fi

# Inicializa o git-flow
git flow init -d

# Configura os hooks do git-flow
mkdir -p .git/hooks
cp .git/hooks/*.sample .git/hooks/

# Remove a extensão .sample dos hooks
for hook in .git/hooks/*.sample; do
    mv "$hook" "${hook%.sample}"
done

# Configura o hook de commit-msg para validar as mensagens de commit
cat > .git/hooks/commit-msg << 'EOL'
#!/bin/bash
commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Padrão de commit message
pattern='^(feat|fix|docs|style|refactor|test|chore)(\([a-z-]+\))?: .+$'

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "Erro: A mensagem de commit não segue o padrão correto."
    echo "Padrão esperado: <tipo>(<escopo>): <descrição>"
    echo "Tipos permitidos: feat, fix, docs, style, refactor, test, chore"
    exit 1
fi
EOL

chmod +x .git/hooks/commit-msg

# Configura o hook de pre-commit para executar testes e lint
cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash

# Executa o linter
echo "Executando linter..."
npm run lint

# Executa os testes
echo "Executando testes..."
npm test

# Se houver erros, impede o commit
if [ $? -ne 0 ]; then
    echo "Erro: Lint ou testes falharam. Commit cancelado."
    exit 1
fi
EOL

chmod +x .git/hooks/pre-commit

echo "Git Flow configurado com sucesso!"
echo "Por favor, leia o arquivo GITFLOW.md para entender o processo de trabalho." 