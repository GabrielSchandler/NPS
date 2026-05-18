from __future__ import annotations

import hashlib
import json
from datetime import datetime
from pathlib import Path

from app.models import NPSResponse
from app.tabular import normalize_row, read_tabular_file


COLUMN_ALIASES = {
    "external_response_id": ["id", "response_id", "resposta_id", "protocolo", "codigo_resposta"],
    "customer_name": ["cliente", "nome_cliente", "customer_name", "razao_social", "nome"],
    "customer_code": ["codigo_cliente", "customer_code", "id_cliente"],
    "contract_code": ["codigo_contrato", "contract_code", "id_contrato", "contrato"],
    "company_name": ["empresa", "company_name"],
    "unit_name": ["unidade", "filial", "unit_name"],
    "operator_name": ["operador", "consultor", "responsavel", "operator_name"],
    "survey_name": ["pesquisa", "survey_name", "campanha"],
    "score": ["nota", "nps", "score", "nota_nps"],
    "feedback": ["comentario", "observacao", "feedback", "comentarios"],
    "responded_at": ["data_resposta", "responded_at", "criado_em", "data", "data_pesquisa"]
}

DATETIME_FORMATS = (
    "%d/%m/%Y %H:%M:%S",
    "%d/%m/%Y %H:%M",
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
    "%d/%m/%Y",
    "%Y-%m-%d"
)


def lookup_column(row: dict[str, str], key: str) -> str | None:
    aliases = COLUMN_ALIASES[key]

    for alias in aliases:
        if alias in row and row[alias]:
            return row[alias].strip()

    return None


def parse_datetime(value: str) -> datetime:
    for fmt in DATETIME_FORMATS:
        try:
            parsed = datetime.strptime(value, fmt)
            if fmt in ("%d/%m/%Y", "%Y-%m-%d"):
                return parsed.replace(hour=0, minute=0, second=0)
            return parsed
        except ValueError:
            continue

    return datetime.fromisoformat(value)


def classify_score(score: int) -> str:
    if score >= 9:
        return "promoter"
    if score >= 7:
        return "neutral"
    return "detractor"


def build_external_id(raw_row: dict[str, str], customer_name: str, score: int, responded_at: datetime) -> str:
    explicit_id = lookup_column(raw_row, "external_response_id")
    if explicit_id:
        return explicit_id

    fingerprint = {
        "customer_name": customer_name,
        "score": score,
        "responded_at": responded_at.isoformat(),
        "raw_row": raw_row
    }
    return hashlib.sha256(json.dumps(fingerprint, sort_keys=True).encode("utf-8")).hexdigest()


def parse_csv_report(csv_path: Path) -> list[NPSResponse]:
    rows = []

    for source_row in read_tabular_file(csv_path):
        normalized_row = normalize_row(source_row)
        customer_name = lookup_column(normalized_row, "customer_name")
        score_raw = lookup_column(normalized_row, "score")
        responded_at_raw = lookup_column(normalized_row, "responded_at")

        if not customer_name or not score_raw or not responded_at_raw:
            continue

        score = int(float(score_raw.replace(",", ".")))
        responded_at = parse_datetime(responded_at_raw)

        rows.append(
            NPSResponse(
                external_response_id=build_external_id(normalized_row, customer_name, score, responded_at),
                customer_name=customer_name,
                customer_code=lookup_column(normalized_row, "customer_code"),
                contract_code=lookup_column(normalized_row, "contract_code"),
                company_name=lookup_column(normalized_row, "company_name"),
                unit_name=lookup_column(normalized_row, "unit_name"),
                operator_name=lookup_column(normalized_row, "operator_name"),
                survey_name=lookup_column(normalized_row, "survey_name"),
                score=score,
                classification=classify_score(score),
                feedback=lookup_column(normalized_row, "feedback"),
                responded_at=responded_at,
                reference_date=responded_at.date().isoformat(),
                raw_payload=normalized_row
            )
        )

    return rows
