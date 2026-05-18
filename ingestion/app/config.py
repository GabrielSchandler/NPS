from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field


PROJECT_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    supabase_url: str = Field(alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")
    crm_base_url: str = Field(default="", alias="CRM_BASE_URL")
    crm_username: str = Field(default="", alias="CRM_USERNAME")
    crm_password: str = Field(default="", alias="CRM_PASSWORD")
    crm_login_path: str = Field(default="/login.php", alias="CRM_LOGIN_PATH")
    crm_download_dir: Path = Field(default=Path("downloads_crm"), alias="CRM_DOWNLOAD_DIR")
    crm_timeout: int = Field(default=60, alias="CRM_TIMEOUT")
    crm_timezone: str = Field(default="America/Sao_Paulo", alias="CRM_TIMEZONE")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    load_dotenv(PROJECT_ROOT / ".env")
    load_dotenv(Path.cwd() / ".env", override=True)
    return Settings.model_validate(os.environ)
