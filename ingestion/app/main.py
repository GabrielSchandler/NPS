from __future__ import annotations

import argparse
import time
from datetime import datetime
from pathlib import Path

import schedule

from app.config import get_settings
from app.crm_client import CRMClient
from app.google_sheets_client import GoogleSheetsClient
from app.parser import parse_csv_report
from app.raw_parser import parse_raw_report
from app.supabase_loader import (
    create_supabase_client,
    finish_sync_run,
    start_sync_run,
    upload_report_rows,
    upload_responses
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sincroniza relatorios de NPS para o Supabase.")
    parser.add_argument("--csv", type=Path, help="Caminho de um CSV exportado do CRM.")
    parser.add_argument("--report-file", type=Path, help="Caminho de um relatorio exportado do CRM.")
    parser.add_argument("--report-key", help="Identificador do relatorio para carga em crm_report_rows.")
    parser.add_argument(
        "--download-from-crm",
        action="store_true",
        help="Baixa os relatorios diretamente do CRM antes de processar."
    )
    parser.add_argument(
        "--sync-google-sheets",
        action="store_true",
        help="Baixa os CSVs do Google Sheets usados no Excel e sobe para o Supabase."
    )
    parser.add_argument(
        "--sync-all",
        action="store_true",
        help="Executa CRM e Google Sheets no mesmo ciclo."
    )
    parser.add_argument("--loop", action="store_true", help="Mantem a sincronizacao rodando em loop.")
    parser.add_argument("--run-now", action="store_true", help="Executa uma sincronizacao imediatamente ao iniciar o loop.")
    parser.add_argument("--interval-minutes", type=int, default=25, help="Intervalo do loop em minutos.")
    parser.add_argument("--start-hour", type=int, default=9, help="Hora inicial permitida para o robo.")
    parser.add_argument("--end-hour", type=int, default=21, help="Hora final permitida para o robo.")
    parser.add_argument("--ignore-time-window", action="store_true", help="Ignora a janela de horario permitida.")
    return parser.parse_args()


def is_inside_time_window(args: argparse.Namespace) -> bool:
    if args.ignore_time_window:
        return True

    hour = datetime.now().hour
    return args.start_hour <= hour <= args.end_hour


def upload_nps_if_possible(supabase, report_path: Path) -> int:
    try:
        responses = parse_csv_report(report_path)
        return upload_responses(supabase, responses)
    except Exception as exc:
        print(f"NPS nao normalizado para {report_path.name}: {exc}")
        return 0


def sync_nps_file(csv_path: Path) -> tuple[int, int]:
    settings = get_settings()
    supabase = create_supabase_client(settings)
    sync_run_id = start_sync_run(supabase, "csv_import")

    try:
        responses = parse_csv_report(csv_path)
        processed = upload_responses(supabase, responses)
        finish_sync_run(supabase, sync_run_id, processed, "success")
        return 0, processed
    except Exception as exc:
        finish_sync_run(supabase, sync_run_id, 0, "failed", str(exc))
        raise


def sync_report_file(report_key: str, report_path: Path) -> tuple[int, int]:
    settings = get_settings()
    supabase = create_supabase_client(settings)
    sync_run_id = start_sync_run(supabase, f"manual_report:{report_key}")

    try:
        raw_rows = parse_raw_report(report_key, report_path)
        raw_processed = upload_report_rows(supabase, raw_rows)
        nps_processed = upload_nps_if_possible(supabase, report_path)
        finish_sync_run(supabase, sync_run_id, raw_processed + nps_processed, "success")
        return raw_processed, nps_processed
    except Exception as exc:
        finish_sync_run(supabase, sync_run_id, 0, "failed", str(exc))
        raise


def sync_from_crm() -> tuple[int, int]:
    settings = get_settings()
    supabase = create_supabase_client(settings)
    crm_client = CRMClient(settings)
    sync_run_id = start_sync_run(supabase, "crm_download")
    raw_processed = 0
    nps_processed = 0

    try:
        downloaded_reports = crm_client.download_reports()

        for downloaded_report in downloaded_reports:
            raw_rows = parse_raw_report(downloaded_report.config.key, downloaded_report.path)
            raw_processed += upload_report_rows(supabase, raw_rows)
            nps_processed += upload_nps_if_possible(supabase, downloaded_report.path)

        finish_sync_run(supabase, sync_run_id, raw_processed + nps_processed, "success")
        return raw_processed, nps_processed
    except Exception as exc:
        finish_sync_run(supabase, sync_run_id, raw_processed + nps_processed, "failed", str(exc))
        raise


def sync_google_sheets() -> tuple[int, int]:
    settings = get_settings()
    supabase = create_supabase_client(settings)
    google_sheets_client = GoogleSheetsClient(settings)
    sync_run_id = start_sync_run(supabase, "google_sheets")
    raw_processed = 0
    nps_processed = 0

    try:
        downloaded_reports = google_sheets_client.download_reports()

        for downloaded_report in downloaded_reports:
            raw_rows = parse_raw_report(downloaded_report.config.key, downloaded_report.path)
            raw_processed += upload_report_rows(supabase, raw_rows)
            nps_processed += upload_nps_if_possible(supabase, downloaded_report.path)

        finish_sync_run(supabase, sync_run_id, raw_processed + nps_processed, "success")
        return raw_processed, nps_processed
    except Exception as exc:
        finish_sync_run(supabase, sync_run_id, raw_processed + nps_processed, "failed", str(exc))
        raise


def sync_all_sources() -> tuple[int, int]:
    crm_raw, crm_nps = sync_from_crm()
    sheets_raw, sheets_nps = sync_google_sheets()
    return crm_raw + sheets_raw, crm_nps + sheets_nps


def run_once(args: argparse.Namespace) -> None:
    if not is_inside_time_window(args):
        print("Fora do horario permitido para sincronizacao.")
        return

    if args.csv:
        _, nps_processed = sync_nps_file(args.csv)
        print(f"Sincronizacao NPS concluida com {nps_processed} registros.")
        return

    if args.report_file:
        if not args.report_key:
            raise SystemExit("Informe --report-key junto com --report-file.")

        raw_processed, nps_processed = sync_report_file(args.report_key, args.report_file)
        print(
            "Sincronizacao de relatorio concluida com "
            f"{raw_processed} linhas brutas e {nps_processed} respostas NPS."
        )
        return

    if args.sync_all:
        raw_processed, nps_processed = sync_all_sources()
        print(
            "Sincronizacao completa concluida com "
            f"{raw_processed} linhas brutas e {nps_processed} respostas NPS."
        )
        return

    if args.download_from_crm:
        raw_processed, nps_processed = sync_from_crm()
        print(
            "Sincronizacao CRM concluida com "
            f"{raw_processed} linhas brutas e {nps_processed} respostas NPS."
        )
        return

    if args.sync_google_sheets:
        raw_processed, nps_processed = sync_google_sheets()
        print(
            "Sincronizacao Google Sheets concluida com "
            f"{raw_processed} linhas brutas e {nps_processed} respostas NPS."
        )
        return

    raise SystemExit("Informe --csv, --report-file, --download-from-crm, --sync-google-sheets ou --sync-all.")


def main() -> None:
    args = parse_args()

    if args.loop:
        if args.run_now:
            run_once(args)

        schedule.every(args.interval_minutes).minutes.do(run_once, args)
        print(f"Robo ativo. Intervalo: {args.interval_minutes} minutos.")

        while True:
            schedule.run_pending()
            time.sleep(30)

    run_once(args)


if __name__ == "__main__":
    main()
