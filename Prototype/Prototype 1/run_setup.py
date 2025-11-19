"""
Quick database setup - pass MySQL password as argument
Usage: python run_setup.py <mysql_password>
Or: python run_setup.py (will prompt or try without password)
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set password if provided
if len(sys.argv) > 1:
    os.environ['DB_PASSWORD'] = sys.argv[1]
    print(f"Using password from command line argument")
elif os.environ.get('DB_PASSWORD'):
    print(f"Using password from environment variable DB_PASSWORD")
else:
    print("No password provided. Trying without password...")
    print("(If it fails, run: python run_setup.py YOUR_PASSWORD)")

# Run setup
exec(open('setup_database.py').read())

