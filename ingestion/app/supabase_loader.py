from __future__ import annotations

from datetime import datetime, timezone

from supabase import Client, create_client

from app.config import Settings
from app.models import CRMReportRow, NPSResponse


def create_supabase_client(settings: Settings) -> Client:
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def start_sync_run(client: Client, source: str) -> str:
    result = client.table("crm_sync_runs").insert(
        {
            "source": source,
            "status": "running",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "rows_processed": 0
        }
    ).execute()

    return result.data[0]["id"]


def finish_sync_run(client: Client, sync_run_id: str, rows_processed: int, status: str, error_message: str | None = None) -> None:
    payload = {
        "status": status,
        "ended_at": datetime.now(timezone.utc).isoformat(),
        "rows_processed": rows_processed,
        "error_message": error_message
    }
    client.table("crm_sync_runs").update(payload).eq("id", sync_run_id).execute()


def upload_responses(client: Client, responses: list[NPSResponse]) -> int:
    if not responses:
        return 0

    payload = [response.model_dump(mode="json") for response in responses]
    client.table("nps_responses").upsert(payload, on_conflict="external_response_id").execute()
    return len(payload)


def upload_report_rows(client: Client, rows: list[CRMReportRow], batch_size: int = 500) -> int:
    if not rows:
        return 0

    total = 0
    payload = [row.model_dump(mode="json") for row in rows]

    for start in range(0, len(payload), batch_size):
        batch = payload[start:start + batch_size]
        client.table("crm_report_rows").upsert(batch, on_conflict="report_key,row_hash").execute()
        total += len(batch)

    return total
