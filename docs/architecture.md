# Arquitetura proposta

## Visao geral

Queremos sair de um fluxo local baseado em pasta + Power Query para um fluxo online e rastreavel.

```text
CRM -> Python ingestion -> Supabase -> Next.js dashboard -> Vercel
```

## Camadas

### 1. Ingestion

Responsavel por:

- autenticar no CRM
- baixar os relatorios dos modulos `389`, `446` e `516`
- baixar os CSVs do Google Sheets usados pelo Excel
- transformar colunas e formatos
- deduplicar registros
- subir os dados com upsert para o Supabase
- registrar execucoes e falhas

### 2. Banco

Responsavel por:

- armazenar respostas normalizadas
- manter trilha de sincronizacao
- expor views agregadas para o dashboard

### 3. Dashboard

Responsavel por:

- mostrar NPS consolidado
- acompanhar variacao diaria
- destacar notas baixas e comentarios criticos
- servir como base para as telas que hoje estao no Excel

## Estrategia de implementacao

### Fase 1

- ligar o dashboard ao Supabase
- subir o schema inicial
- permitir carga por arquivo exportado do CRM
- subir dados brutos dos relatorios para `crm_report_rows`

### Fase 2

- automatizar login no CRM
- baixar relatorios sem passo manual
- executar a sincronizacao por agendamento

### Fase 3

- reproduzir fielmente as telas do Excel no site
- criar filtros, drill-down e historico
- publicar na Vercel com ambiente de producao

## Decisoes atuais

- `Next.js` para o frontend porque encaixa bem com deploy na Vercel
- `Supabase` para banco, API e possivel autenticacao
- `Python` para a automacao porque e uma boa camada para browser automation, parsing e carga

## Riscos e dependencias

- sem telas do dashboard atual, ainda nao temos o desenho final das paginas
- sem amostra dos arquivos exportados pelo CRM, o parser precisa trabalhar com hipoteses
- sem o fluxo real de login, a automacao de navegador ainda nao pode ser implementada por completo
