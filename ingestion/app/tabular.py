from __future__ import annotations

import csv
import unicodedata
from pathlib import Path

import pandas as pd


def normalize_header(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return (
        ascii_value.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace("/", "_")
    )


def normalize_row(row: dict[str, str]) -> dict[str, str]:
    return {normalize_header(key): (value or "").strip() for key, value in row.items() if key}


def _read_text(path: Path) -> str:
    for encoding in ("utf-8-sig", "cp1252", "latin1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue

    return path.read_text(encoding="utf-8-sig", errors="ignore")


def _read_csv(path: Path) -> list[dict[str, str]]:
    text = _read_text(path)
    sample = text[:4096]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
    except csv.Error:
        dialect = csv.excel
        dialect.delimiter = ";"

    reader = csv.DictReader(text.splitlines(), dialect=dialect)
    return [{key: value for key, value in row.items() if key} for row in reader]


def _read_excel(path: Path) -> list[dict[str, str]]:
    frame = pd.read_excel(path, dtype=str).fillna("")
    return frame.to_dict(orient="records")


def read_tabular_file(path: Path) -> list[dict[str, str]]:
    suffix = path.suffix.lower()

    if suffix in {".csv", ".txt"}:
        return _read_csv(path)

    if suffix in {".xlsx", ".xls"}:
        return _read_excel(path)

    raise ValueError(f"Formato de arquivo nao suportado: {path.suffix}")
