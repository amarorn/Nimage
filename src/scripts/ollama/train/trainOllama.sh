#!/bin/bash

echo "🚀 Iniciando processo de treinamento do modelo Ollama..."

# Gerar dados de treinamento
echo "\n📊 Gerando dados de treinamento..."
npx ts-node src/scripts/data/generateTrainingData.ts

# Treinar o modelo com dados do banco
echo "\n🤖 Treinando modelo com dados do banco..."
npx ts-node src/scripts/ollama/train/trainOllamaWithDB.ts

echo "\n🎉 Processo de treinamento concluído!" 