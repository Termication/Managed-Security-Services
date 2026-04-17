import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATABASE_URI = "sqlite:///" + str(BASE_DIR / "instance" / "mss.db").replace("\\", "/")


def load_local_env():
    env_files = [BASE_DIR.parent / ".env", BASE_DIR / ".env"]

    for env_file in env_files:
        if not env_file.exists():
            continue

        for raw_line in env_file.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if key and key not in os.environ:
                os.environ[key] = value


def configure_app(app):
    load_local_env()

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI", DEFAULT_DATABASE_URI)
    jwt_secret = os.getenv("JWT_SECRET_KEY")
    if not jwt_secret:
        raise RuntimeError("JWT_SECRET_KEY is not set. Add it to your environment or local .env file.")

    app.config["JWT_SECRET_KEY"] = jwt_secret
