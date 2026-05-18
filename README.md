# NPS

Base inicial para substituir o dashboard atual em Excel por uma aplicacao online com:

- frontend em Next.js hospedado na Vercel
- banco e API no Supabase
- ingestao em Python para buscar relatorios no CRM e subir os dados direto para o banco

## Estrutura

```text
.
|-- docs/
|-- ingestion/
|   `-- app/
|-- supabase/
|   `-- schema.sql
`-- web/
    `-- src/
```

## Objetivo da arquitetura

O fluxo alvo deste projeto e:

1. O Python faz login no CRM.
2. O Python baixa os tres relatorios usados no processo atual.
3. O Python baixa os tres CSVs do Google Sheets usados pelo Excel.
4. O Python sobe todas as linhas brutas para o Supabase.
5. Quando encontra colunas de NPS compativeis, tambem normaliza as respostas para `nps_responses`.
6. O dashboard em Next.js le direto do Supabase, sem pasta local e sem Power Query.

## O que ja deixei preparado

- estrutura inicial do app web
- dashboard inicial com fallback para mock quando o Supabase ainda nao estiver configurado
- pipeline Python pronta para ler arquivos exportados do CRM e enviar para o Supabase
- automacao Selenium baseada no fluxo legado de login e download do CRM
- importacao automatica dos CSVs do Google Sheets usados no Excel
- schema SQL inicial com tabelas e views para NPS
- documentacao da arquitetura e do mapeamento que ainda precisamos fechar

## Como rodar o frontend

```powershell
cd web
npm install
npm run dev
```

## Deploy na Vercel com Supabase

Ao importar o projeto na Vercel, use:

- `Framework Preset`: Next.js
- `Root Directory`: `web`
- `Build Command`: `npm run build`

A integracao da Vercel com Supabase deve disponibilizar `NEXT_PUBLIC_SUPABASE_URL` e uma chave publica, normalmente `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. O frontend aceita as duas.

Para o banco ficar pronto, rode o arquivo `supabase/schema.sql` no SQL Editor do Supabase. A chave `SUPABASE_SERVICE_ROLE_KEY` deve ficar somente na automacao Python/local, nunca exposta no frontend.

## Como rodar a ingestao

Crie um ambiente virtual e instale as dependencias:

```powershell
cd ingestion
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Exemplo de carga a partir de um CSV exportado do CRM:

```powershell
python -m app.main --csv "C:\caminho\para\relatorio.csv"
```

Exemplo para baixar direto do CRM e subir as bases para o Supabase:

```powershell
python -m app.main --download-from-crm
```

Exemplo para baixar somente as bases do Google Sheets e subir para o Supabase:

```powershell
python -m app.main --sync-google-sheets
```

Exemplo para rodar CRM + Google Sheets no mesmo ciclo:

```powershell
python -m app.main --sync-all
```

Exemplo para manter o robo ativo no mesmo modelo do script antigo:

```powershell
python -m app.main --sync-all --loop --run-now --interval-minutes 25
```

O fluxo atual substitui as pastas usadas pelo Power Query por upsert no Supabase:

- `crm_report_rows`: guarda todas as linhas brutas dos relatorios do CRM e dos CSVs do Google Sheets
- `nps_responses`: guarda respostas de NPS ja normalizadas quando as colunas do arquivo forem reconhecidas
- `crm_sync_runs`: guarda historico de execucao, sucesso, falha e quantidade de linhas processadas

## Proximos insumos para avancar

Para eu transformar isso na automacao final, voce vai me mandar:

- telas do dashboard atual em Excel
- exemplo de cada relatorio que o CRM exporta
- nome das colunas e regras de negocio importantes
- fluxo real de login e download no CRM, ou o codigo atual dessa automacao se ele estiver em outro lugar

## Observacao importante

Os repositorios `GabrielSchandler/NPS` e `GabrielSchandler/NPS_HORAAHORA-AUTOMATE` estavam vazios quando eu os validei em 17 de maio de 2026. Por isso, esta base foi criada do zero em cima da arquitetura que voce descreveu.
