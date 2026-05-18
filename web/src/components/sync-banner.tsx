import type { SyncStatus } from "@/types/dashboard";

type SyncBannerProps = {
  status: SyncStatus;
};

export function SyncBanner({ status }: SyncBannerProps) {
  return (
    <section className="sync-banner">
      <div>
        <span className="section-kicker">Sync</span>
        <h2>{status.message}</h2>
      </div>
      <p>{status.lastRunLabel}</p>
      <span className={`sync-pill sync-pill--${status.status}`}>{status.status}</span>
    </section>
  );
}
