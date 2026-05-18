from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class NPSResponse(BaseModel):
    external_response_id: str
    customer_name: str
    score: int
    responded_at: datetime
    reference_date: str
    classification: str
    customer_code: str | None = None
    contract_code: str | None = None
    company_name: str | None = None
    unit_name: str | None = None
    operator_name: str | None = None
    survey_name: str | None = None
    feedback: str | None = None
    source: str = "crm"
    raw_payload: dict[str, str] = Field(default_factory=dict)


class CRMReportRow(BaseModel):
    report_key: str
    source_file_name: str
    row_number: int
    row_hash: str
    raw_payload: dict[str, dict[str, str]]
