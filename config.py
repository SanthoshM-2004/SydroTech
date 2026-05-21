# config.py

import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# DATABASE CONFIG
# =========================
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# =========================
# FLASK SECRET
# =========================
SECRET_KEY = os.getenv("SECRET_KEY")

# =========================
# ADMIN LOGIN
# =========================
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

# =========================
# EMAIL SETTINGS
# =========================
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
ALERT_TO = os.getenv("ALERT_TO")