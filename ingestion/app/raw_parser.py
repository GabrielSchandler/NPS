from __future__ import annotations

import hashlib
import json
from pathlib import Path

from app.models import CRMReportRow
from app.tabular import normalize_row, read_tabular_file


def parse_raw_report(report_key: str, file_path: Path) -> list[CRMReportRow]:
    rows = read_tabular_file(file_path)
    parsed_rows: list[CRMReportRow] = []

    for index, row in enumerate(rows, start=1):
        normalized = normalize_row(row)
        payload = {
            "original": {key: (value or "").strip() for key, value in row.items()},
            "normalized": normalized
        }
        row_hash = hashlib.sha256(
            json.dumps(
                {
                    "report_key": report_key,
                    "payload": normalized
                },
                sort_keys=True,
                ensure_ascii=True
            ).encode("utf-8")
        ).hexdigest()

        parsed_rows.append(
            CRMReportRow(
                report_key=report_key,
                source_file_name=file_path.name,
                row_number=index,
                row_hash=row_hash,
                raw_payload=payload
            )
        )

    return parsed_rows
