from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING
from urllib.request import Request, urlopen

from app.report_config import DownloadedRemoteCsvReport, GOOGLE_SHEETS_REPORTS, RemoteCsvReportConfig

if TYPE_CHECKING:
    from app.config import Settings


class GoogleSheetsClient:
    def __init__(self, settings: Settings) -> None:
        self.download_dir = settings.crm_download_dir / "google_sheets"

    def download_reports(
        self,
        reports: tuple[RemoteCsvReportConfig, ...] = GOOGLE_SHEETS_REPORTS
    ) -> list[DownloadedRemoteCsvReport]:
        run_dir = self.download_dir / datetime.now().strftime("%Y%m%d_%H%M%S")
        run_dir.mkdir(parents=True, exist_ok=True)
        downloaded: list[DownloadedRemoteCsvReport] = []

        for report in reports:
            request = Request(report.url, headers={"User-Agent": "NPS-Supabase-Sync/1.0"})

            with urlopen(request, timeout=60) as response:
                content = response.read()

            output_path = run_dir / f"{report.key}.csv"
            output_path.write_bytes(content)
            downloaded.append(DownloadedRemoteCsvReport(config=report, path=output_path))

        return downloaded
