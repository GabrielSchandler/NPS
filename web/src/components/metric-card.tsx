import type { Metric } from "@/types/dashboard";

type MetricCardProps = {
  metric: Metric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-label">{metric.label}</span>
      <strong className="metric-value">{metric.value}</strong>
      <span className="metric-helper">{metric.helper}</span>
    </article>
  );
}
