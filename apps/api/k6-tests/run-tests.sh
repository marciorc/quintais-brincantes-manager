#!/bin/bash

# Script para executar testes k6
echo "🚀 Iniciando testes de carga com k6"

# Variáveis
TEST_TYPE=${1:-"smoke"}
RESULTS_DIR="./results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Criar diretório de resultados se não existir
mkdir -p $RESULTS_DIR

case $TEST_TYPE in
  "smoke")
    echo "📊 Executando Smoke Test..."
    k6 run scripts/smoke-test.js --out json=${RESULTS_DIR}/smoke_${TIMESTAMP}.json
    ;;
  "load")
    echo "📈 Executando Load Test..."
    k6 run scripts/load-test.js --out json=${RESULTS_DIR}/load_${TIMESTAMP}.json
    ;;
  "stress")
    echo "🔥 Executando Stress Test..."
    k6 run scripts/stress-test.js --out json=${RESULTS_DIR}/stress_${TIMESTAMP}.json
    ;;
  "all")
    echo "🔄 Executando todos os testes..."
    k6 run scripts/smoke-test.js --out json=${RESULTS_DIR}/smoke_${TIMESTAMP}.json
    sleep 5
    k6 run scripts/load-test.js --out json=${RESULTS_DIR}/load_${TIMESTAMP}.json
    sleep 10
    k6 run scripts/stress-test.js --out json=${RESULTS_DIR}/stress_${TIMESTAMP}.json
    ;;
  *)
    echo "❌ Tipo de teste não reconhecido: $TEST_TYPE"
    echo "Usage: ./run-tests.sh [smoke|load|stress|all]"
    exit 1
    ;;
esac

echo "✅ Teste $TEST_TYPE concluído! Resultados em: $RESULTS_DIR/"