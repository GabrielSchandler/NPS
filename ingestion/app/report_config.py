from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ReportConfig:
    key: str
    label: str
    path: str
    click_search: bool = False
    group_by_user: bool = False


@dataclass(frozen=True)
class DownloadedReport:
    config: ReportConfig
    path: Path


@dataclass(frozen=True)
class RemoteCsvReportConfig:
    key: str
    label: str
    url: str


@dataclass(frozen=True)
class DownloadedRemoteCsvReport:
    config: RemoteCsvReportConfig
    path: Path


CRM_REPORTS = (
    ReportConfig(
        key="pesquisa_hora_a_hora_chamada",
        label="Pesquisa hora a hora - relatorio chamada",
        path="/index.php?codmodulo=389",
        click_search=True
    ),
    ReportConfig(
        key="ura_satisfacao_analitica",
        label="URA satisfacao - pesquisa analitica",
        path="/index.php?codmodulo=446"
    ),
    ReportConfig(
        key="sms_usuario",
        label="SMS por usuario",
        path="/index.php?codmodulo=516",
        click_search=True,
        group_by_user=True
    )
)


GOOGLE_SHEETS_REPORTS = (
    RemoteCsvReportConfig(
        key="retorno_cobranca_google_sheets",
        label="Retorno cobranca",
        url=(
            "https://docs.google.com/spreadsheets/d/"
            "1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/"
            "export?format=csv&gid=270472721"
        )
    ),
    RemoteCsvReportConfig(
        key="retencao_google_sheets",
        label="Retencao",
        url=(
            "https://docs.google.com/spreadsheets/d/"
            "1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/"
            "export?format=csv&gid=0"
        )
    ),
    RemoteCsvReportConfig(
        key="vendas_google_sheets",
        label="Vendas",
        url=(
            "https://docs.google.com/spreadsheets/d/"
            "1VuCuRJP4S912Sep1M4cfaZ4njxQN6Mak_L1lLT9SyAo/"
            "export?format=csv&gid=1134130602"
        )
    )
)
