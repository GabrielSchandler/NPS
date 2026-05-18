# Inventario do Excel legado

Arquivo analisado: `C:\Users\gabri\OneDrive\Area de Trabalho\Relatorio hora a hora.xlsm`

## Telas principais

- `Dashboard`: tela executiva enviada como print. Area usada pelo robo antigo: `A1:Q36`.
- `Analitico`: tabela operacional por operador. Area usada pelo robo antigo: `A1:U{ultima linha}`.
- `Auxiliar`: apoio com tabelas dinamicas, listas de operadores e bases intermediarias.

## Abas encontradas

- `Dashboard`: indicadores e rankings.
- `Analitico`: detalhamento por operador, notas, satisfacao, participacao, TMA, SMS e retorno cobranca.
- `Auxiliar`: suporte para os calculos e filtros de tabela dinamica.
- `Retorno Cob`: base de retorno de cobranca vinda de CSV externo.
- `pesquisa hr a hr relatorio cham`: base principal de chamadas.
- `ura satisfaçao pesquisa analiti`: base analitica da pesquisa URA.
- `chamadas com retorno cobran`: segunda transformacao da base de chamadas.
- `vendas`: base de vendas vinda de CSV externo.
- `SMS`: base de SMS.
- `retenção`: base de retencao vinda de CSV externo.

## Fontes de dados

### CRM / arquivos em pasta

- `ura satisfaçao pesquisa analitica`
  - Origem Power Query: `Y:\RELATÓRIOS\2025\04.Abril\powerquery\ura satisfaçao pesquisa analitica`
  - CSV: delimitador `;`, encoding `1252`, 11 colunas.
  - Colunas principais: `id_pesquisa_registro`, `valor`, `pesquisa`, `nome_campanha`, `datahora_registro`, `status_chamada`, `id_agente`, `nome_agente`, `telefone_f`, `nome`.

- `pesquisa hr a hr relatorio chamada`
  - Origem Power Query: `\\192.168.15.102\e\CaeduADM\RELATÓRIOS\2025\04.Abril\powerquery\pesquisa hr a hr relatorio chamada`
  - CSV: delimitador `;`, encoding `1252`, 93 colunas no arquivo original.
  - Excel expande para 94 colunas apos separar `Data/Hora Inicio` em data e hora.
  - Filtros aplicados:
    - `Tipo = ENTRANTE`
    - `Status Chamada = Atendida`
    - `Nome Campanha <> EMPRESTIMO PESSOAL`
    - `Nome Campanha <> E_COMMERCE`
    - `Nome Campanha <> RETORNO COBRANCA`

- `chamadas com retorno cobran`
  - Usa a mesma pasta de `pesquisa hr a hr relatorio chamada`.
  - Filtros aplicados:
    - `Tipo = ENTRANTE`
    - `Nome Campanha <> EMPRESTIMO PESSOAL`

- `SMS`
  - Origem Power Query: `\\192.168.15.102\e\CaeduADM\RELATÓRIOS\2025\04.Abril\powerquery\SMS`
  - CSV: delimitador `;`, encoding `1252`, 10 colunas.
  - Colunas mantidas: `agrupador`, `confirmado`, `nao_entregue`, `falha`, `acima_limite`, `Custo`.
  - Colunas removidas: `Nome da Origem`, `enviada`, `recebido`, `aguardando`.

### CSVs externos do Google Sheets

- `Retorno Cob`
  - URL: `https://docs.google.com/spreadsheets/d/1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/export?format=csv&gid=270472721`
  - CSV: delimitador `,`, encoding `1252`, 6 colunas.
  - Colunas: `Data`, `Hora`, `CPF`, `Cliente`, `Login Smart`, `Column1`.
  - Filtro: `Login Smart <> ""`.

- `retenção`
  - URL: `https://docs.google.com/spreadsheets/d/1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/export?format=csv&gid=0`
  - CSV: delimitador `,`, encoding `65001`, 7 colunas.
  - Colunas: `DATA`, `ATENDENTE`, `CPF`, `TABULAÇÃO`, `RETENÇÃO`, `OPERADOR`, `Column1`.
  - Filtros:
    - `DATA` no dia atual.
    - `OPERADOR <> "#N/A"`.

- `vendas`
  - URL: `https://docs.google.com/spreadsheets/d/1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/export?format=csv&gid=1134130602`
  - CSV: delimitador `,`, encoding `65001`, 8 colunas.
  - Colunas: `DATA`, `CPF`, `CLIENTE`, `ATENDENTE`, `VENDA`, `CANAL`, `VALIDA`, `Column1`.
  - Filtro: `DATA` no dia atual.

## Indicadores do dashboard

- `SATISFACAO`: calculada no `Analitico` como `(promotores - detratores) / total`, usando as notas agrupadas por operador.
- `PARTICIPACAO`: respostas da pesquisa divididas por chamadas atendidas.
- `SMS`: percentual lido da aba `SMS`.
- `RETORNO COBRANCA`: percentual lido da aba `Retorno Cob`.
- `VENDAS`: contagem da base `vendas`.
- `RETENCAO`: contagem da base `retenção`.

## Macros VBA encontradas

- `Planilha4.FiltrarTabelaDinamicaPorColunaA`
  - Aba alvo: `Auxiliar`.
  - Tabela dinamica: `Tabela dinâmica2`.
  - Campo filtrado: `Login Agente`.
  - Usa a coluna `A` da aba `Auxiliar` como lista de operadores validos.
  - Limpa filtros, oculta todos os itens e reexibe apenas os operadores presentes na coluna `A`.
  - Ordena o campo alfabeticamente.

- `Dashboard_Seguro`
  - Slicer: `SegmentaçãodeDados_Rótulos_de_Linha`.
  - Limpa o filtro manual.
  - Remove apenas itens vazios, `(blank)` ou `em branco`.

## Implicacoes para o site

- O Supabase precisa receber bases brutas separadas por fonte para manter rastreabilidade.
- A camada de transformacao deve reproduzir os filtros do Power Query, principalmente chamadas entrantes/atendidas e exclusoes de campanha.
- O dashboard web deve ter pelo menos duas visoes:
  - resumo executivo equivalente ao `Dashboard`;
  - analitico por operador equivalente ao `Analitico`.
- Alem dos relatorios do CRM, a automacao importa os tres CSVs externos do Google Sheets direto pelas URLs de exportacao e grava em `crm_report_rows`.
