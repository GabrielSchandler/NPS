type ScoreRow = {
  operator: string;
  scores: string[];
  total: string;
  satisfaction: string;
  participation: string;
  answered: string;
  tma: string;
  sms: string;
  retornoAnswered: string;
  retorno: string;
};

type RankingRow = {
  operator: string;
  value: string;
};

const scoreHeaders = [
  "0 - Péssimo",
  "1 - Péssimo",
  "2 - Ruim",
  "3 - Ruim",
  "4 - Regular",
  "5 - Regular",
  "6 - Regular",
  "7 - Bom",
  "8 - Bom",
  "9 - Excelente",
  "10 - Excelente"
];

const totals = {
  scores: ["8", "2", "1", "1", "3", "13", "4", "9", "37", "167", "234"],
  total: "479",
  satisfaction: "90%",
  participation: "48%",
  answered: "1006",
  tma: "00:04:36",
  sms: "81%",
  retornoAnswered: "71",
  retorno: "59%"
};

const analyticRows: ScoreRow[] = [
  { operator: "ailton.silva", scores: ["", "", "", "", "", "", "", "", "", "6", "11"], total: "17", satisfaction: "100%", participation: "49%", answered: "35", tma: "00:03:49", sms: "87%", retornoAnswered: "6", retorno: "83%" },
  { operator: "ana.borges", scores: ["", "", "", "", "", "", "", "", "", "", "1"], total: "1", satisfaction: "100%", participation: "50%", answered: "2", tma: "00:02:03", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "aurora.silva", scores: ["", "", "", "", "", "", "", "1", "", "2", ""], total: "3", satisfaction: "100%", participation: "50%", answered: "6", tma: "00:05:35", sms: "114%", retornoAnswered: "1", retorno: "100%" },
  { operator: "aysla.costa", scores: ["", "", "", "", "", "", "", "", "", "5", "12"], total: "17", satisfaction: "100%", participation: "53%", answered: "32", tma: "00:04:02", sms: "70%", retornoAnswered: "", retorno: "" },
  { operator: "beatriz.xavier", scores: ["", "", "", "", "", "", "", "", "2", "1", "2"], total: "5", satisfaction: "100%", participation: "100%", answered: "5", tma: "00:04:02", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "bianca.alves", scores: ["4", "", "", "", "1", "", "", "1", "2", "4", "4"], total: "16", satisfaction: "43%", participation: "53%", answered: "30", tma: "00:04:23", sms: "59%", retornoAnswered: "", retorno: "" },
  { operator: "daniel.lompisano", scores: ["", "", "", "", "", "", "", "", "", "4", "6"], total: "10", satisfaction: "100%", participation: "32%", answered: "31", tma: "00:04:50", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "eryk.santos", scores: ["", "", "", "", "", "", "", "", "1", "7", "5"], total: "13", satisfaction: "100%", participation: "43%", answered: "30", tma: "00:04:51", sms: "93%", retornoAnswered: "8", retorno: "50%" },
  { operator: "gabrielly.salvador", scores: ["", "1", "", "", "", "", "", "", "1", "3", "3"], total: "8", satisfaction: "75%", participation: "33%", answered: "24", tma: "00:05:21", sms: "79%", retornoAnswered: "", retorno: "" },
  { operator: "gustavo.bezerra", scores: ["", "", "", "", "", "", "1", "", "", "9", "6"], total: "16", satisfaction: "93%", participation: "37%", answered: "43", tma: "00:04:56", sms: "95%", retornoAnswered: "", retorno: "" },
  { operator: "gustavo.souza", scores: ["", "", "", "", "", "", "", "", "1", "9", "10"], total: "20", satisfaction: "100%", participation: "69%", answered: "29", tma: "00:05:26", sms: "83%", retornoAnswered: "4", retorno: "100%" },
  { operator: "heloysa.leite", scores: ["", "", "", "", "", "", "", "", "1", "1", "6"], total: "8", satisfaction: "100%", participation: "30%", answered: "27", tma: "00:05:51", sms: "81%", retornoAnswered: "", retorno: "" },
  { operator: "iris.macedo", scores: ["", "", "", "", "", "", "", "", "1", "6", "8"], total: "15", satisfaction: "100%", participation: "44%", answered: "34", tma: "00:05:09", sms: "90%", retornoAnswered: "", retorno: "" },
  { operator: "isabelle.cunha", scores: ["", "", "", "", "", "", "", "", "", "2", "3"], total: "5", satisfaction: "100%", participation: "45%", answered: "11", tma: "00:06:35", sms: "100%", retornoAnswered: "1", retorno: "0%" },
  { operator: "isabelly.morais", scores: ["", "", "", "", "1", "", "1", "1", "2", "3", "6"], total: "14", satisfaction: "85%", participation: "40%", answered: "35", tma: "00:03:57", sms: "72%", retornoAnswered: "2", retorno: "100%" },
  { operator: "kayky.otavio", scores: ["", "", "", "", "1", "2", "1", "", "2", "6", "7"], total: "19", satisfaction: "78%", participation: "58%", answered: "33", tma: "00:04:34", sms: "93%", retornoAnswered: "3", retorno: "67%" },
  { operator: "kevin.santos", scores: ["", "", "", "", "", "", "1", "", "", "4", "9"], total: "14", satisfaction: "92%", participation: "40%", answered: "35", tma: "00:04:53", sms: "52%", retornoAnswered: "2", retorno: "100%" },
  { operator: "kimberly.lima", scores: ["", "", "", "", "", "", "", "", "", "1", ""], total: "1", satisfaction: "100%", participation: "50%", answered: "2", tma: "00:02:06", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "larissa.evangelista", scores: ["", "", "", "", "", "1", "", "2", "", "7", "6"], total: "16", satisfaction: "93%", participation: "48%", answered: "33", tma: "00:05:01", sms: "77%", retornoAnswered: "5", retorno: "40%" },
  { operator: "lucas.ribeiro", scores: ["", "", "", "", "", "", "", "", "1", "6", "8"], total: "15", satisfaction: "100%", participation: "42%", answered: "36", tma: "00:04:26", sms: "74%", retornoAnswered: "1", retorno: "100%" },
  { operator: "maria.caetano", scores: ["", "", "", "", "", "2", "", "", "1", "", "16"], total: "19", satisfaction: "89%", participation: "59%", answered: "32", tma: "00:03:28", sms: "87%", retornoAnswered: "5", retorno: "100%" },
  { operator: "maria.soares", scores: ["", "", "", "", "", "", "", "", "1", "5", "3"], total: "9", satisfaction: "100%", participation: "53%", answered: "17", tma: "00:03:36", sms: "92%", retornoAnswered: "5", retorno: "100%" },
  { operator: "miguel.silva", scores: ["", "", "", "", "", "", "", "1", "1", "5", "3"], total: "10", satisfaction: "100%", participation: "48%", answered: "21", tma: "00:06:21", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "mirella.santos", scores: ["1", "", "", "", "", "", "", "", "1", "2", "5"], total: "9", satisfaction: "77%", participation: "22%", answered: "41", tma: "00:03:07", sms: "47%", retornoAnswered: "3", retorno: "0%" },
  { operator: "nathalia.oliveira", scores: ["", "", "", "", "", "1", "", "", "", "2", "3"], total: "6", satisfaction: "83%", participation: "67%", answered: "9", tma: "00:04:28", sms: "44%", retornoAnswered: "", retorno: "" },
  { operator: "nathaly.vitoria", scores: ["1", "", "", "", "", "2", "", "1", "2", "5", "9"], total: "20", satisfaction: "80%", participation: "53%", answered: "38", tma: "00:03:50", sms: "79%", retornoAnswered: "3", retorno: "100%" },
  { operator: "nicoli.cunha", scores: ["", "", "", "", "", "", "", "", "", "5", "6"], total: "11", satisfaction: "100%", participation: "37%", answered: "30", tma: "00:05:33", sms: "78%", retornoAnswered: "", retorno: "" },
  { operator: "nikolas.oliveira", scores: ["", "", "", "", "", "", "", "", "", "6", "7"], total: "13", satisfaction: "100%", participation: "52%", answered: "25", tma: "00:05:24", sms: "91%", retornoAnswered: "", retorno: "" },
  { operator: "pedro.cruz", scores: ["", "", "", "", "", "", "", "", "2", "8", "7"], total: "17", satisfaction: "100%", participation: "47%", answered: "36", tma: "00:04:03", sms: "96%", retornoAnswered: "", retorno: "" },
  { operator: "pyetro.cruz", scores: ["", "", "", "", "", "3", "", "1", "3", "10", "8"], total: "25", satisfaction: "88%", participation: "68%", answered: "37", tma: "00:04:23", sms: "90%", retornoAnswered: "", retorno: "" },
  { operator: "rafael.santana", scores: ["", "", "", "", "", "", "", "", "1", "1", "10"], total: "12", satisfaction: "100%", participation: "63%", answered: "19", tma: "00:05:48", sms: "100%", retornoAnswered: "", retorno: "" },
  { operator: "rafaela.figueredo", scores: ["", "", "", "", "", "", "", "", "", "2", "10"], total: "12", satisfaction: "100%", participation: "38%", answered: "32", tma: "00:03:01", sms: "86%", retornoAnswered: "", retorno: "" },
  { operator: "riquelmy.dias", scores: ["", "", "", "", "", "", "", "", "2", "", "7"], total: "9", satisfaction: "100%", participation: "60%", answered: "15", tma: "00:02:37", sms: "111%", retornoAnswered: "2", retorno: "100%" },
  { operator: "ryan.oliveira", scores: ["", "", "1", "", "", "2", "", "1", "", "8", "4"], total: "16", satisfaction: "75%", participation: "57%", answered: "28", tma: "00:04:38", sms: "85%", retornoAnswered: "", retorno: "" },
  { operator: "tayna.santos", scores: ["", "1", "", "", "", "", "", "", "1", "2", "5"], total: "9", satisfaction: "77%", participation: "35%", answered: "26", tma: "00:07:48", sms: "81%", retornoAnswered: "", retorno: "" },
  { operator: "thatyana.santos", scores: ["1", "", "", "", "", "", "", "", "2", "4", "2"], total: "9", satisfaction: "77%", participation: "36%", answered: "25", tma: "00:04:43", sms: "81%", retornoAnswered: "13", retorno: "0%" },
  { operator: "victor.cardoso", scores: ["", "", "", "", "", "", "", "", "2", "9", "12"], total: "23", satisfaction: "100%", participation: "74%", answered: "31", tma: "00:05:52", sms: "97%", retornoAnswered: "", retorno: "" },
  { operator: "wendy.silva", scores: ["1", "", "", "1", "", "", "", "", "4", "7", "4"], total: "17", satisfaction: "76%", participation: "55%", answered: "31", tma: "00:04:17", sms: "98%", retornoAnswered: "7", retorno: "86%" }
];

const summaryCards = [
  {
    label: "Satisfação",
    value: "90%",
    tone: "cyan",
    description: "Índice consolidado da operação SAC"
  },
  {
    label: "Participação",
    value: "48%",
    tone: "cyan",
    description: "Aderência dos atendimentos com pesquisa"
  },
  {
    label: "SMS",
    value: "81%",
    tone: "green",
    description: "Performance do canal de disparo"
  },
  {
    label: "Retorno cobrança",
    value: "59%",
    tone: "green",
    description: "Ligações da fila tabuladas na planilha"
  }
];

const secondaryKpis = [
  { label: "Vendas", value: "14", description: "Conversões registradas", tone: "yellow" },
  { label: "Retenção", value: "69", description: "Casos retidos no ciclo", tone: "yellow" },
  { label: "Atendidas", value: totals.answered, description: "Volume total receptivo", tone: "purple" },
  { label: "TMA", value: totals.tma, description: "Tempo médio receptivo", tone: "purple" }
];

const scoreDistribution = [
  { label: "Promotores", value: "401", detail: "Notas 9 e 10", tone: "green", percent: "84%" },
  { label: "Neutros", value: "46", detail: "Notas 7 e 8", tone: "yellow", percent: "10%" },
  { label: "Críticos", value: "32", detail: "Notas 0 a 6", tone: "cyan", percent: "7%" }
];

const dashboardRankings: Array<{
  title: string;
  tone: "cyan" | "green" | "yellow";
  columns: [string, string];
  rows: RankingRow[];
}> = [
  {
    title: "SATISFAÇÃO",
    tone: "cyan",
    columns: ["OPERADOR", "SATISFAÇÃO"],
    rows: [
      { operator: "bianca.alves", value: "43%" },
      { operator: "gabrielly.salvador", value: "75%" },
      { operator: "ryan.oliveira", value: "75%" },
      { operator: "wendy.silva", value: "76%" },
      { operator: "tayna.santos", value: "77%" }
    ]
  },
  {
    title: "SMS",
    tone: "green",
    columns: ["OPERADOR", "SATISFAÇÃO"],
    rows: [
      { operator: "nathalia.oliveira", value: "44%" },
      { operator: "mirella.santos", value: "47%" },
      { operator: "kevin.santos", value: "52%" },
      { operator: "bianca.alves", value: "59%" },
      { operator: "aysla.costa", value: "70%" }
    ]
  },
  {
    title: "PARTICIPAÇÃO",
    tone: "cyan",
    columns: ["OPERADOR", "TRANSFERENCIA"],
    rows: [
      { operator: "aurora.silva", value: "0%" },
      { operator: "gabrielly.salvador", value: "0%" },
      { operator: "tayna.santos", value: "0%" },
      { operator: "heloysa.leite", value: "0%" },
      { operator: "ana.borges", value: "0%" }
    ]
  },
  {
    title: "RETORNO COBRANÇA",
    tone: "green",
    columns: ["OPERADOR", "TABULAÇÃO"],
    rows: [
      { operator: "isabelle.cunha", value: "0%" },
      { operator: "mirella.santos", value: "0%" },
      { operator: "larissa.evangelista", value: "40%" },
      { operator: "eryk.santos", value: "50%" },
      { operator: "kayky.otavio", value: "67%" }
    ]
  }
];

function metricClass(value: string, kind: "good" | "participation" | "time") {
  if (!value) {
    return "";
  }

  if (kind === "time") {
    if (value >= "00:07:00") return "metric-cell--red";
    if (value >= "00:05:00") return "metric-cell--orange";
    if (value >= "00:04:00") return "metric-cell--yellow";
    return "metric-cell--green";
  }

  const numericValue = Number(value.replace("%", ""));

  if (kind === "participation") {
    if (numericValue >= 60) return "metric-cell--green";
    if (numericValue >= 48) return "metric-cell--yellow";
    if (numericValue >= 35) return "metric-cell--orange";
    return "metric-cell--red";
  }

  if (numericValue >= 90) return "metric-cell--green";
  if (numericValue >= 75) return "metric-cell--orange";
  if (numericValue >= 50) return "metric-cell--yellow";
  return "metric-cell--red";
}

function hasBadScores(row: ScoreRow) {
  return row.scores.slice(0, 4).some((value) => value !== "");
}

function RankingPanel({
  title,
  tone,
  columns,
  rows
}: {
  title: string;
  tone: "cyan" | "green" | "yellow";
  columns: [string, string];
  rows: RankingRow[];
}) {
  return (
    <section className={`ranking-card ranking-card--${tone}`}>
      <div className="section-eyebrow">Top 5 ofensores</div>
      <div className="ranking-card__header">
        <h3>{title}</h3>
        <span>{columns[1]}</span>
      </div>
      <div className="ranking-list">
        {rows.map((row, index) => (
          <article className="ranking-item" key={`${title}-${row.operator}`}>
            <div className="ranking-item__meta">
              <span className="ranking-position">{String(index + 1).padStart(2, "0")}</span>
              <strong>{row.operator}</strong>
              <em>{row.value}</em>
            </div>
            <div className="ranking-bar" aria-hidden="true">
              <span style={{ width: row.value }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyValue({ value }: { value: string }) {
  return value ? <>{value}</> : <span className="muted-value">-</span>;
}

export default function HomePage() {
  return (
    <main className="dashboard-shell">
      <section className="hero-panel" aria-label="Visão executiva da operação">
        <div className="hero-panel__content">
          <div>
            <span className="report-kicker">SAC | Operação NPS</span>
            <h1>NPS realtime</h1>
            <p>
              Painel para acompanhamento hora a hora da NPS, participação e os principais indicadores.
            </p>
          </div>
          <aside className="hero-stamp">
            <span>Atualização</span>
            <strong>20:54h</strong>
            <small>Ciclo operacional ativo</small>
          </aside>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Indicadores principais">
        {summaryCards.map((card) => (
          <article className={`kpi-card kpi-card--${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="insight-grid" aria-label="Indicadores complementares">
        <div className="distribution-card">
          <div className="section-heading">
            <span className="section-eyebrow">Distribuição NPS</span>
            <h2>479 respostas consolidadas</h2>
          </div>
          <div className="distribution-stack">
            {scoreDistribution.map((item) => (
              <article className={`distribution-item distribution-item--${item.tone}`} key={item.label}>
                <div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.detail}</small>
                </div>
                <em>{item.percent}</em>
              </article>
            ))}
          </div>
        </div>

        <div className="secondary-kpi-grid">
          {secondaryKpis.map((item) => (
            <article className={`compact-kpi compact-kpi--${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rankings-section" aria-label="Ranking dos ofensores">
        <div className="section-heading section-heading--wide">
          <span className="section-eyebrow">Plano de ação</span>
          <h2>Ranking dos 5 ofensores por indicador</h2>
          <p>Os cards destacam onde a liderança do SAC deve atuar primeiro no próximo ciclo.</p>
        </div>
        <div className="rankings-grid">
          {dashboardRankings.map((ranking) => (
            <RankingPanel {...ranking} key={ranking.title} />
          ))}
        </div>
      </section>

      <section className="analytics-section" aria-label="Matriz analítica por operador">
        <div className="section-heading section-heading--wide">
          <span className="section-eyebrow">Base operacional</span>
          <h2>Analítico por operador</h2>
          <p>
            Matriz com notas, total de respostas, participação, SMS, TMA receptivo e retorno de cobrança.
          </p>
        </div>

        <div className="table-card">
          <div className="table-card__summary">
            <span>Total geral: <strong>{totals.total}</strong></span>
            <span>Satisfação: <strong>{totals.satisfaction}</strong></span>
            <span>Participação: <strong>{totals.participation}</strong></span>
            <span>SMS: <strong>{totals.sms}</strong></span>
            <span>Retorno cobrança: <strong>{totals.retorno}</strong></span>
          </div>
          <div className="table-scroll">
            <table className="analytic-table">
              <thead>
                <tr className="total-row">
                  <th>Total</th>
                  {totals.scores.map((value, index) => (
                    <th key={`total-score-${scoreHeaders[index]}`}>{value}</th>
                  ))}
                  <th>{totals.total}</th>
                  <th>{totals.satisfaction}</th>
                  <th>{totals.participation}</th>
                  <th>{totals.answered}</th>
                  <th>{totals.tma}</th>
                  <th>{totals.sms}</th>
                  <th>{totals.retornoAnswered}</th>
                  <th>{totals.retorno}</th>
                </tr>
                <tr className="header-row">
                  <th>Operador</th>
                  {scoreHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Total</th>
                  <th>Satisfação</th>
                  <th>Participação</th>
                  <th>Atendidas</th>
                  <th>TMA</th>
                  <th>SMS</th>
                  <th>Ligações retorno</th>
                  <th>% tabulado</th>
                </tr>
              </thead>
              <tbody>
                {analyticRows.map((row) => (
                  <tr key={row.operator}>
                    <th className={hasBadScores(row) ? "operator-cell operator-cell--alert" : "operator-cell"}>
                      {row.operator}
                    </th>
                    {row.scores.map((score, index) => (
                      <td
                        className={index < 4 && score ? "score-cell score-cell--bad" : "score-cell"}
                        key={`${row.operator}-${scoreHeaders[index]}`}
                      >
                        <EmptyValue value={score} />
                      </td>
                    ))}
                    <td className="score-cell">{row.total}</td>
                    <td className={`metric-cell ${metricClass(row.satisfaction, "good")}`}>{row.satisfaction}</td>
                    <td className={`metric-cell ${metricClass(row.participation, "participation")}`}>{row.participation}</td>
                    <td>{row.answered}</td>
                    <td className={`metric-cell ${metricClass(row.tma, "time")}`}>{row.tma}</td>
                    <td className={`metric-cell ${metricClass(row.sms, "good")}`}>{row.sms}</td>
                    <td><EmptyValue value={row.retornoAnswered} /></td>
                    <td className={`metric-cell ${metricClass(row.retorno, "good")}`}>
                      <EmptyValue value={row.retorno} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
