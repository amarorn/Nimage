#!/bin/bash

# Lista de arquivos YAML
FILES=(
    "mongodb.yaml"
    "redis.yaml"
    "ollama.yaml"
    "deployment.yaml"
    "service.yaml"
)

# Corrige o namespace em cada arquivo
for file in "${FILES[@]}"; do
    if [ -f "k8s/$file" ]; then
        sed -i '' 's/namespace: nimage/namespace: nimage-dev/g' "k8s/$file"
    fi
done

echo "Namespaces corrigidos nos arquivos YAML" 