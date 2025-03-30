#!/bin/bash

# Função para incrementar versão
increment_version() {
    local version=$1
    local type=$2

    # Separa a versão em partes
    IFS='.' read -r -a parts <<< "$version"
    local major="${parts[0]}"
    local minor="${parts[1]}"
    local patch="${parts[2]}"

    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
    esac

    echo "${major}.${minor}.${patch}"
}

# Obtém a versão atual do package.json
current_version=$(node -p "require('./package.json').version")

# Determina o tipo de versão baseado no último commit
commit_message=$(git log -1 --pretty=%B)

if [[ $commit_message =~ ^feat[[:space:]]*(\([^)]+\))?:[[:space:]].*$ ]]; then
    version_type="minor"
elif [[ $commit_message =~ ^fix[[:space:]]*(\([^)]+\))?:[[:space:]].*$ ]]; then
    version_type="patch"
elif [[ $commit_message =~ ^BREAKING[[:space:]].*$ ]] || [[ $commit_message =~ .*!:.* ]]; then
    version_type="major"
else
    version_type="patch"
fi

# Calcula a nova versão
new_version=$(increment_version "$current_version" "$version_type")

# Atualiza o package.json
tmp=$(mktemp)
jq ".version = \"$new_version\"" package.json > "$tmp" && mv "$tmp" package.json

# Cria o commit de versão
git add package.json
git commit -m "chore: atualiza versão para $new_version"

# Cria a tag
git tag -a "v$new_version" -m "Versão $new_version"

echo "Versão atualizada: $current_version -> $new_version" 