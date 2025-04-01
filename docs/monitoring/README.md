# Monitoramento

Este documento descreve a configuração e uso do sistema de monitoramento do Nimage, que utiliza Prometheus e Grafana para coletar, armazenar e visualizar métricas.

## 📊 Visão Geral

O sistema de monitoramento é composto por:
- **Prometheus**: Coleta e armazena métricas
- **Grafana**: Visualização e análise das métricas
- **Exportadores**: Coletam métricas de serviços específicos (MongoDB, Redis)

## 🛠️ Configuração

### Prometheus

O Prometheus está configurado para coletar métricas dos seguintes serviços:
- Aplicação Node.js (porta 3001)
- MongoDB (porta 9216)
- Redis (porta 9121)

Configuração em `prometheus/prometheus.yml`:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'nimage-app'
    static_configs:
      - targets: ['app:3001']

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb-exporter:9216']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### Grafana

O Grafana está configurado com:
- Dashboards pré-configurados
- Fonte de dados Prometheus
- Alertas configurados

Configuração em `grafana/provisioning/datasources/prometheus.yml`:
```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

## 📈 Métricas Disponíveis

### Métricas da Aplicação

- **Requisições HTTP**
  - `http_requests_total`: Total de requisições
  - `http_request_duration_seconds`: Duração das requisições
  - `http_requests_total{status!=""}`: Requisições por status
  - `http_requests_total{route!=""}`: Requisições por rota

- **Performance**
  - `rate(http_requests_total[5m])`: Taxa de requisições
  - `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])`: Tempo médio de resposta

### Métricas do MongoDB

- **Collections**
  - `mongodb_collection_size_bytes`: Tamanho das collections
  - `mongodb_collection_document_count`: Número de documentos

- **Operações**
  - `mongodb_op_counters_total`: Contadores de operações
  - `mongodb_op_latency_seconds`: Latência das operações

### Métricas do Redis

- **Memória**
  - `redis_memory_used_bytes`: Memória utilizada
  - `redis_memory_max_bytes`: Memória máxima

- **Cache**
  - `redis_keyspace_hits_total`: Hits do cache
  - `redis_keyspace_misses_total`: Misses do cache

## 📊 Dashboards

### Visão Geral da Aplicação
- Total de requisições
- Taxa de requisições por segundo
- Tempo médio de resposta
- Erros por minuto
- Status codes

### Métricas do MongoDB
- Tamanho das collections
- Número de documentos
- Operações por segundo
- Latência das operações

### Métricas do Redis
- Uso de memória
- Hit/miss ratio
- Conexões ativas
- Latência de operações

## 🔔 Alertas

Alertas configurados para:
- Alta taxa de erros (5xx)
- Latência alta
- Uso de memória do Redis
- Conexões ativas do MongoDB

## 🚀 Como Usar

1. **Acessar o Grafana**
   ```bash
   # Inicie os serviços
   docker-compose up -d
   
   # Acesse o Grafana
   http://localhost:3000
   ```

2. **Credenciais**
   - Usuário: `admin`
   - Senha: `admin`

3. **Navegação**
   - Use o menu lateral para acessar os dashboards
   - Explore as métricas usando o painel de consultas
   - Configure alertas conforme necessário

## 🔍 Troubleshooting

### Problemas Comuns

1. **Prometheus não está coletando métricas**
   - Verifique se os serviços estão rodando
   - Confirme as portas de exposição
   - Verifique os logs do Prometheus

2. **Grafana não está conectando ao Prometheus**
   - Verifique a configuração do datasource
   - Confirme se o Prometheus está acessível
   - Verifique os logs do Grafana

3. **Métricas não aparecem nos dashboards**
   - Verifique se as queries estão corretas
   - Confirme se os labels estão corretos
   - Verifique o intervalo de tempo selecionado

## 📚 Recursos Adicionais

- [Documentação do Prometheus](https://prometheus.io/docs/)
- [Documentação do Grafana](https://grafana.com/docs/)
- [Métricas do Node.js](https://nodejs.org/api/process.html#process_process_memoryusage)
- [Métricas do MongoDB](https://www.mongodb.com/docs/manual/reference/command/serverStatus/)
- [Métricas do Redis](https://redis.io/commands/info/) 