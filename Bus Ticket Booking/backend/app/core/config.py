from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql://routexen_user:routexen_pass@db:5432/routexen_db"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "super-secret-jwt-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/0"
    ADMIN_EMAIL: str = "admin@routexen.com"
    ADMIN_EMAIL: str = "routexen@routexen.com"
    ADMIN_PASSWORD: str = "admin123"
    # SMTP settings for sending real emails. Leave defaults to disable SMTP (use console simulation).
    SMTP_ENABLED: bool = False
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "no-reply@routexen.com"
    SMTP_USE_TLS: bool = True


settings = Settings()
