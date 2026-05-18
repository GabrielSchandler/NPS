export type Metric = {
  label: string;
  value: string;
  helper: string;
};

export type DailyTrend = {
  referenceDate: string;
  responses: number;
  npsScore: number;
  promotersPct: number;
  detractorsPct: number;
};

export type LowScoreAlert = {
  id: string;
  customerName: string;
  score: number;
  feedback: string | null;
  respondedAt: string;
};

export type SyncStatus = {
  status: string;
  message: string;
  lastRunLabel: string;
};

export type DashboardData = {
  headerDate: string;
  metrics: Metric[];
  trends: DailyTrend[];
  lowScoreAlerts: LowScoreAlert[];
  syncStatus: SyncStatus;
};
