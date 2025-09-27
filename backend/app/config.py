from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "Seara 2026 API"
    debug: bool = False
    database_url: str = Field(default="sqlite:///" + str(Path(__file__).resolve().parent.parent / "seara.db"))
    jwt_secret_key: str = Field(default="change-me", env="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 12
    admin_email: Optional[str] = Field(default=None, env="SEARA_ADMIN_EMAIL")
    admin_password: Optional[str] = Field(default=None, env="SEARA_ADMIN_PASSWORD")
    cors_origins: list[str] = Field(default_factory=lambda: ["*"])

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
