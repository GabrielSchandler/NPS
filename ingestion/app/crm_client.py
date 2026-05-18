from __future__ import annotations

import shutil
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

from app.config import Settings
from app.report_config import CRM_REPORTS, DownloadedReport, ReportConfig


class CRMClient:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.download_dir = settings.crm_download_dir

    def _url(self, path: str) -> str:
        if path.startswith(("http://", "https://")):
            return path

        return urljoin(f"{self.settings.crm_base_url.rstrip('/')}/", path.lstrip("/"))

    def _clear_download_dir(self) -> None:
        self.download_dir.mkdir(parents=True, exist_ok=True)
        for item in self.download_dir.iterdir():
            if item.is_file():
                item.unlink(missing_ok=True)

    def _create_driver(self) -> webdriver.Chrome:
        options = Options()
        options.add_experimental_option(
            "prefs",
            {
                "download.default_directory": str(self.download_dir),
                "download.prompt_for_download": False,
                "download.directory_upgrade": True,
                "safebrowsing.enabled": True
            }
        )

        return webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

    def _wait_for_download(self, timeout: int = 180) -> Path:
        end_at = time.time() + timeout

        while time.time() < end_at:
            files = [
                path
                for path in self.download_dir.iterdir()
                if path.is_file() and path.suffix.lower() in {".csv", ".xlsx", ".xls"}
            ]
            partials = [path for path in self.download_dir.iterdir() if path.suffix.lower() == ".crdownload"]

            if files and not partials:
                return max(files, key=lambda path: path.stat().st_mtime)

            time.sleep(1)

        raise TimeoutError("Download nao concluido no tempo esperado.")

    def _login(self, driver: webdriver.Chrome, wait: WebDriverWait) -> None:
        if not self.settings.crm_base_url or not self.settings.crm_username or not self.settings.crm_password:
            raise ValueError("Configure CRM_BASE_URL, CRM_USERNAME e CRM_PASSWORD antes de baixar do CRM.")

        driver.get(self._url(self.settings.crm_login_path))
        wait.until(EC.presence_of_element_located((By.ID, "l_login"))).send_keys(self.settings.crm_username)
        driver.find_element(By.ID, "l_senha").send_keys(self.settings.crm_password)
        driver.execute_script("enviarDados();")
        wait.until(EC.url_contains("index.php"))

    def _click_export(self, wait: WebDriverWait) -> None:
        wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//img[contains(@src,'csv') or contains(@src,'excel')]/ancestor::span")
            )
        ).click()

    def _prepare_report(self, driver: webdriver.Chrome, wait: WebDriverWait, report: ReportConfig) -> None:
        driver.get(self._url(report.path))

        if report.group_by_user:
            wait.until(EC.presence_of_element_located((By.ID, "agrupador")))
            driver.execute_script(
                """
                var select = document.getElementById('agrupador');
                select.value = 'usuario';
                select.dispatchEvent(new Event('change'));
                """
            )
            time.sleep(1)

        if report.click_search:
            wait.until(EC.element_to_be_clickable((By.ID, "btn_pesquisar"))).click()

    def download_reports(self, reports: tuple[ReportConfig, ...] = CRM_REPORTS) -> list[DownloadedReport]:
        self.download_dir.mkdir(parents=True, exist_ok=True)
        run_dir = self.download_dir / "runs" / datetime.now().strftime("%Y%m%d_%H%M%S")
        run_dir.mkdir(parents=True, exist_ok=True)

        driver = self._create_driver()
        wait = WebDriverWait(driver, self.settings.crm_timeout)
        downloaded: list[DownloadedReport] = []

        try:
            self._login(driver, wait)

            for report in reports:
                self._clear_download_dir()
                self._prepare_report(driver, wait, report)
                self._click_export(wait)
                downloaded_file = self._wait_for_download()
                target = run_dir / f"{report.key}{downloaded_file.suffix.lower()}"
                shutil.move(str(downloaded_file), target)
                downloaded.append(DownloadedReport(config=report, path=target))

            return downloaded
        finally:
            driver.quit()
