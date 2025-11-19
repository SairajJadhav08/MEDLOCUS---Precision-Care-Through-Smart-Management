"""
Test database connection and check if database exists
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()
load_dotenv(dotenv_path='backend/.env')

# Try different password sources
password = os.environ.get('DB_PASSWORD') or os.getenv('DB_PASSWORD') or ''

if len(sys.argv) > 1:
    password = sys.argv[1]

DB_CONFIG = {
    'host': os.environ.get('DB_HOST') or os.getenv('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER') or os.getenv('DB_USER', 'root'),
    'password': password,
    'charset': 'utf8mb4'
}

print("Testing MySQL connection...")
print(f"Host: {DB_CONFIG['host']}")
print(f"User: {DB_CONFIG['user']}")
print(f"Password: {'*' * len(password) if password else '(empty)'}")
print()

try:
    # Try to connect without database first
    connection = mysql.connector.connect(
        host=DB_CONFIG['host'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password']
    )
    cursor = connection.cursor()
    
    # Check if database exists
    cursor.execute("SHOW DATABASES LIKE 'medvault_db'")
    db_exists = cursor.fetchone()
    
    if db_exists:
        print("✓ Database 'medvault_db' exists!")
        cursor.execute("USE medvault_db")
        
        # Check tables
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if tables:
            print(f"✓ Found {len(tables)} table(s): {[t[0] for t in tables]}")
            
            # Check if we have data
            cursor.execute("SELECT COUNT(*) FROM suppliers")
            supplier_count = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM medicines")
            medicine_count = cursor.fetchone()[0]
            
            print(f"✓ Suppliers: {supplier_count} records")
            print(f"✓ Medicines: {medicine_count} records")
            
            if supplier_count > 0 and medicine_count > 0:
                print("\n" + "="*60)
                print("SUCCESS! Database is set up and has data!")
                print("="*60)
                print("\nYour Flask server should now work!")
                print("Refresh your browser and you should see medicines loaded.")
            else:
                print("\nDatabase exists but has no data.")
                print("Run: python setup_database.py [password] to add sample data")
        else:
            print("✗ Database exists but has no tables")
            print("Run: python setup_database.py [password] to create tables")
    else:
        print("✗ Database 'medvault_db' does not exist")
        print("Run: python setup_database.py [password] to create it")
    
    cursor.close()
    connection.close()
    
except Error as e:
    print(f"✗ Connection error: {e}")
    print("\nTroubleshooting:")
    if "Access denied" in str(e):
        print("- MySQL password is incorrect or missing")
        print("- Try: python test_connection.py YOUR_PASSWORD")
    elif "Can't connect" in str(e):
        print("- MySQL server is not running")
        print("- Start MySQL service or XAMPP")
    else:
        print("- Check MySQL server status")
        print("- Verify connection settings")

