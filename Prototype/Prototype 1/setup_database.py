"""
Database Setup Script for Medical Storage Management System
This script will create the database and tables automatically.
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Also try loading from backend/.env
load_dotenv(dotenv_path='backend/.env')

# Database configuration from environment variables
# Check both os.environ (system vars) and dotenv (.env file)
DB_CONFIG = {
    'host': os.environ.get('DB_HOST') or os.getenv('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER') or os.getenv('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD') or os.getenv('DB_PASSWORD', ''),
    'charset': 'utf8mb4'
}

def setup_database():
    """Create database and tables"""
    connection = None
    
    try:
        # Connect to MySQL server (without database)
        print("Connecting to MySQL server...")
        print(f"Host: {DB_CONFIG['host']}")
        print(f"User: {DB_CONFIG['user']}")
        print("Password: " + ("*" * len(DB_CONFIG['password']) if DB_CONFIG['password'] else "(empty)"))
        print()
        
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        # Create database
        print("Creating database 'medvault_db'...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS medvault_db")
        cursor.execute("USE medvault_db")
        print("[OK] Database created/selected successfully")
        
        # Drop existing tables
        print("Dropping existing tables (if any)...")
        cursor.execute("DROP TABLE IF EXISTS medicines")
        cursor.execute("DROP TABLE IF EXISTS suppliers")
        
        # Create suppliers table
        print("Creating suppliers table...")
        cursor.execute("""
            CREATE TABLE suppliers (
                supplier_id INT AUTO_INCREMENT PRIMARY KEY,
                supplier_name VARCHAR(100) NOT NULL,
                contact_no VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_supplier_name (supplier_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        print("[OK] Suppliers table created")
        
        # Create medicines table
        print("Creating medicines table...")
        cursor.execute("""
            CREATE TABLE medicines (
                medicine_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                company VARCHAR(100) NOT NULL,
                mfg_date DATE NOT NULL,
                exp_date DATE NOT NULL,
                quantity INT NOT NULL CHECK (quantity >= 0),
                price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
                supplier_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
                INDEX idx_name (name),
                INDEX idx_company (company),
                INDEX idx_exp_date (exp_date),
                INDEX idx_supplier (supplier_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        print("[OK] Medicines table created")
        
        # Insert sample suppliers
        print("Inserting sample suppliers...")
        suppliers = [
            ('MedSupply Co.', '123-456-7890'),
            ('Pharma Distributors', '234-567-8901'),
            ('HealthCare Solutions', '345-678-9012'),
            ('Global Pharmaceuticals', '456-789-0123'),
            ('MedTech Industries', '567-890-1234')
        ]
        cursor.executemany(
            "INSERT INTO suppliers (supplier_name, contact_no) VALUES (%s, %s)",
            suppliers
        )
        print(f"[OK] Inserted {len(suppliers)} suppliers")
        
        # Insert sample medicines
        print("Inserting sample medicines...")
        medicines = [
            ('Paracetamol 500mg', 'PharmaCorp', '2024-01-15', '2026-01-15', 500, 25.50, 1),
            ('Amoxicillin 250mg', 'MediCare Labs', '2024-02-20', '2025-08-20', 300, 45.75, 2),
            ('Ibuprofen 400mg', 'HealthPlus', '2024-03-10', '2026-03-10', 250, 30.00, 1),
            ('Aspirin 100mg', 'Global Meds', '2024-01-05', '2025-12-05', 400, 15.25, 3),
            ('Cetirizine 10mg', 'PharmaCorp', '2024-04-12', '2025-10-12', 350, 20.50, 4),
            ('Omeprazole 20mg', 'MediCare Labs', '2024-02-28', '2026-02-28', 200, 55.00, 2),
            ('Atorvastatin 10mg', 'HealthPlus', '2024-03-15', '2026-09-15', 150, 80.75, 5),
            ('Metformin 500mg', 'Global Meds', '2024-01-20', '2025-07-20', 450, 35.25, 3)
        ]
        cursor.executemany(
            """INSERT INTO medicines (name, company, mfg_date, exp_date, quantity, price, supplier_id) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            medicines
        )
        print(f"[OK] Inserted {len(medicines)} medicines")
        
        # Commit changes
        connection.commit()
        print("\n" + "="*60)
        print("SUCCESS! Database setup completed successfully!")
        print("="*60)
        print("\nDatabase: medvault_db")
        print("Tables: suppliers, medicines")
        print("Sample data: 5 suppliers, 8 medicines")
        print("\nYou can now use the application.")
        print("Flask server should be running on http://localhost:5000")
        print("\nNext steps:")
        print("1. Refresh your browser (frontend/index.html)")
        print("2. You should see medicines loaded automatically")
        print("3. Test all CRUD operations!")
        
    except Error as e:
        print(f"\nERROR: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check environment variables or update DB_CONFIG in this script")
        print("3. Verify MySQL user has CREATE DATABASE permission")
        print("4. Try running MySQL Workbench and executing database/schema.sql manually")
        
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("\nMySQL connection closed.")

if __name__ == "__main__":
    print("="*60)
    print("Medical Storage Management System - Database Setup")
    print("="*60)
    print()
    
    # Check if password is in environment variables
    import sys
    password = None
    
    # Try to get from environment
    password = os.environ.get('DB_PASSWORD') or os.getenv('DB_PASSWORD')
    
    # If still no password, try command line argument
    if not password and len(sys.argv) > 1:
        password = sys.argv[1]
        DB_CONFIG['password'] = password
    elif not password:
        # If still no password, prompt user
        try:
            print("MySQL password not found in environment variables.")
            password_input = input("Enter MySQL root password (or press Enter if no password): ").strip()
            if password_input:
                DB_CONFIG['password'] = password_input
        except (EOFError, KeyboardInterrupt):
            print("\nSkipping password prompt. Using empty password.")
    
    if password:
        DB_CONFIG['password'] = password
    
    print(f"Using MySQL configuration:")
    print(f"  Host: {DB_CONFIG['host']}")
    print(f"  User: {DB_CONFIG['user']}")
    print(f"  Password: {'*' * len(DB_CONFIG['password']) if DB_CONFIG['password'] else '(empty)'}")
    print()
    
    setup_database()
