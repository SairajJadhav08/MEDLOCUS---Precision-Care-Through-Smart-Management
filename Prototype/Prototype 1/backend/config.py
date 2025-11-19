"""
Database configuration for Medical Storage Management System
"""
import os
from dotenv import load_dotenv

# Load .env file from current directory (backend folder)
load_dotenv()

# Also try loading from parent directory
load_dotenv(dotenv_path='.env')

# MySQL Database Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'medvault_db'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'charset': 'utf8mb4',
    'autocommit': False
}

# Flask Configuration
FLASK_CONFIG = {
    'DEBUG': os.getenv('FLASK_DEBUG', 'True') == 'True',
    'PORT': int(os.getenv('FLASK_PORT', 5000)),
    'HOST': os.getenv('FLASK_HOST', '0.0.0.0')
}

