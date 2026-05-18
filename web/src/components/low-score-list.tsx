import type { LowScoreAlert } from "@/types/dashboard";

type LowScoreListProps = {
  alerts: LowScoreAlert[];
};

export function LowScoreList({ alerts }: LowScoreListProps) {
  if (!alerts.length) {
    return <p className="empty-state">Nenhuma resposta critica encontrada.</p>;
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => (
        <article className="alert-card" key={alert.id}>
          <div className="alert-card__header">
            <strong>{alert.customerName}</strong>
            <span className="alert-score">{alert.score}</span>
          </div>
          <p>{alert.feedback || "Sem comentario informado."}</p>
          <time>{alert.respondedAt}</time>
        </article>
      ))}
    </div>
  );
}
