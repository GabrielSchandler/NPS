import { createClient } from "@supabase/supabase-js";

import type { DashboardData, DailyTrend, LowScoreAlert } from "@/types/dashboard";

type OverviewRow = {
  total_responses: number;
  nps_score: number | null;
  promoters_pct: number | null;
  detractors_pct: number | null;
  last_response_at: string | null;
};

type TrendRow = {
  reference_date: string;
  total_responses: number;
  nps_score: number | null;
  promoters_pct: number | null;
  detractors_pct: number | null;
};

type SyncRow = {
  status: string;
  started_at: string;
  ended_at: string | null;
  rows_processed: number;
};

type ResponseRow = {
  external_response_id: string;
  customer_name: string;
  score: number;
  feedback: string | null;
  responded_at: string;
};

const mockData: DashboardData = {
  headerDate: "Atualizado com dados de exemplo",
  metrics: [
    { label: "NPS atual", value: "74", helper: "baseado nos ultimos 30 dias" },
    { label: "Respostas", value: "1.248", helper: "janela consolidada" },
    { label: "Promotores", value: "81%", helper: "clientes com nota 9 ou 10" },
    { label: "Detratores", value: "7%", helper: "clientes com nota de 0 a 6" }
  ],
  syncStatus: {
    status: "mock",
    message: "Dashboard pronto para conectar no Supabase",
    lastRunLabel: "Configure as variaveis de ambiente para trocar os dados de exemplo pelos dados reais."
  },
  trends: [
    { referenceDate: "2026-05-11", responses: 164, npsScore: 71, promotersPct: 78, detractorsPct: 7 },
    { referenceDate: "2026-05-12", responses: 152, npsScore: 76, promotersPct: 82, detractorsPct: 6 },
    { referenceDate: "2026-05-13", responses: 179, npsScore: 73, promotersPct: 80, detractorsPct: 7 },
    { referenceDate: "2026-05-14", responses: 183, npsScore: 75, promotersPct: 81, detractorsPct: 6 },
    { referenceDate: "2026-05-15", responses: 171, npsScore: 77, promotersPct: 83, detractorsPct: 6 },
    { referenceDate: "2026-05-16", responses: 190, npsScore: 72, promotersPct: 79, detractorsPct: 7 },
    { referenceDate: "2026-05-17", responses: 209, npsScore: 74, promotersPct: 81, detractorsPct: 7 }
  ],
  lowScoreAlerts: [
    {
      id: "demo-1",
      customerName: "Cliente com atraso de retorno",
      score: 4,
      feedback: "Atendimento demorou para responder e nao tive retorno no prazo combinado.",
      respondedAt: "17/05/2026 08:14"
    },
    {
      id: "demo-2",
      customerName: "Cliente com problema de implantacao",
      score: 5,
      feedback: "Faltou alinhamento entre comercial e operacao durante a entrega.",
      respondedAt: "17/05/2026 10:42"
    },
    {
      id: "demo-3",
      customerName: "Cliente pedindo acompanhamento",
      score: 2,
      feedback: "Precisei cobrar varias vezes para ter uma posicao clara.",
      respondedAt: "17/05/2026 11:33"
    }
  ]
};

function formatPercent(value: number | null | undefined) {
  return `${Math.round(value ?? 0)}%`;
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return "Sem sincronizacao registrada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatResponseTimestamp(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function mapTrendRows(rows: TrendRow[]): DailyTrend[] {
  return rows.map((row) => ({
    referenceDate: row.reference_date,
    responses: row.total_responses,
    npsScore: Math.round(row.nps_score ?? 0),
    promotersPct: Math.round(row.promoters_pct ?? 0),
    detractorsPct: Math.round(row.detractors_pct ?? 0)
  }));
}

function mapLowScoreRows(rows: ResponseRow[]): LowScoreAlert[] {
  return rows.map((row) => ({
    id: row.external_response_id,
    customerName: row.customer_name,
    score: row.score,
    feedback: row.feedback,
    respondedAt: formatResponseTimestamp(row.responded_at)
  }));
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublicKey) {
    return mockData;
  }

  const supabase = createClient(supabaseUrl, supabasePublicKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const [overviewResult, trendsResult, syncResult, lowScoresResult] = await Promise.all([
    supabase.from("nps_summary_overview").select("*").limit(1).maybeSingle<OverviewRow>(),
    supabase
      .from("nps_daily_summary")
      .select("*")
      .order("reference_date", { ascending: false })
      .limit(7)
      .returns<TrendRow[]>(),
    supabase
      .from("crm_sync_runs")
      .select("status, started_at, ended_at, rows_processed")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle<SyncRow>(),
    supabase
      .from("nps_responses")
      .select("external_response_id, customer_name, score, feedback, responded_at")
      .lte("score", 6)
      .order("responded_at", { ascending: false })
      .limit(5)
      .returns<ResponseRow[]>()
  ]);

  if (overviewResult.error || trendsResult.error || syncResult.error || lowScoresResult.error) {
    return {
      ...mockData,
      syncStatus: {
        status: "fallback",
        message: "Falha ao consultar o Supabase. Mantendo dados de exemplo.",
        lastRunLabel: [
          overviewResult.error?.message,
          trendsResult.error?.message,
          syncResult.error?.message,
          lowScoresResult.error?.message
        ]
          .filter(Boolean)
          .join(" | ")
      }
    };
  }

  const overview = overviewResult.data;
  const trends = mapTrendRows(trendsResult.data ?? []);
  const lowScoreAlerts = mapLowScoreRows(lowScoresResult.data ?? []);
  const lastSync = syncResult.data;
  const npsScore = Math.round(overview?.nps_score ?? 0);

  return {
    headerDate: overview?.last_response_at
      ? `Atualizado ate ${formatDateLabel(overview.last_response_at)}`
      : "Sem respostas importadas ainda",
    metrics: [
      { label: "NPS atual", value: `${npsScore}`, helper: "calculado a partir das respostas importadas" },
      { label: "Respostas", value: `${overview?.total_responses ?? 0}`, helper: "base consolidada no Supabase" },
      { label: "Promotores", value: formatPercent(overview?.promoters_pct), helper: "notas 9 e 10" },
      { label: "Detratores", value: formatPercent(overview?.detractors_pct), helper: "notas entre 0 e 6" }
    ],
    syncStatus: {
      status: lastSync?.status ?? "idle",
      message:
        lastSync?.status === "success"
          ? "Sincronizacao do CRM concluida com sucesso"
          : "Aguardando primeira sincronizacao automatizada",
      lastRunLabel: lastSync
        ? `${lastSync.rows_processed} linhas processadas na ultima execucao iniciada em ${formatDateLabel(lastSync.started_at)}`
        : "Nenhuma execucao registrada em crm_sync_runs"
    },
    trends,
    lowScoreAlerts
  };
}
