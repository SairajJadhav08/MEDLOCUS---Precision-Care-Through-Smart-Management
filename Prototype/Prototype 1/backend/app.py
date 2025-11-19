"""
Medical Storage Management System - Flask Backend
REST API endpoints for CRUD operations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import os
from config import DB_CONFIG, FLASK_CONFIG

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def get_db_connection():
    """Establish database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


def serialize_date(date_obj):
    """Convert date objects to string format"""
    if date_obj is None:
        return None
    if isinstance(date_obj, datetime):
        return date_obj.strftime('%Y-%m-%d')
    if isinstance(date_obj, str):
        return date_obj
    return str(date_obj)


def serialize_datetime(datetime_obj):
    """Convert datetime objects to string format"""
    if datetime_obj is None:
        return None
    if isinstance(datetime_obj, datetime):
        return datetime_obj.strftime('%Y-%m-%d %H:%M:%S')
    return str(datetime_obj)


# ==================== SUPPLIER ENDPOINTS ====================

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    """Get all suppliers"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM suppliers ORDER BY supplier_name")
        suppliers = cursor.fetchall()
        
        # Serialize datetime objects
        for supplier in suppliers:
            supplier['created_at'] = serialize_datetime(supplier.get('created_at'))
            supplier['updated_at'] = serialize_datetime(supplier.get('updated_at'))
        
        return jsonify(suppliers), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/suppliers', methods=['POST'])
def add_supplier():
    """Add a new supplier"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        # Validate required fields
        if 'supplier_name' not in data or 'contact_no' not in data:
            return jsonify({'error': 'Missing required fields: supplier_name, contact_no'}), 400
        
        cursor = connection.cursor()
        query = "INSERT INTO suppliers (supplier_name, contact_no) VALUES (%s, %s)"
        values = (data['supplier_name'], data['contact_no'])
        cursor.execute(query, values)
        connection.commit()
        return jsonify({'message': 'Supplier added successfully', 'id': cursor.lastrowid}), 201
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


# ==================== MEDICINE ENDPOINTS ====================

@app.route('/api/medicines', methods=['GET'])
def get_medicines():
    """Get all medicines with supplier information"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT m.*, s.supplier_name, s.contact_no
            FROM medicines m
            JOIN suppliers s ON m.supplier_id = s.supplier_id
            ORDER BY m.name
        """
        cursor.execute(query)
        medicines = cursor.fetchall()
        
        # Serialize date and datetime objects
        for medicine in medicines:
            medicine['mfg_date'] = serialize_date(medicine.get('mfg_date'))
            medicine['exp_date'] = serialize_date(medicine.get('exp_date'))
            medicine['created_at'] = serialize_datetime(medicine.get('created_at'))
            medicine['updated_at'] = serialize_datetime(medicine.get('updated_at'))
        
        return jsonify(medicines), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines/<int:medicine_id>', methods=['GET'])
def get_medicine(medicine_id):
    """Get a specific medicine by ID"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT m.*, s.supplier_name, s.contact_no
            FROM medicines m
            JOIN suppliers s ON m.supplier_id = s.supplier_id
            WHERE m.medicine_id = %s
        """
        cursor.execute(query, (medicine_id,))
        medicine = cursor.fetchone()
        
        if medicine:
            medicine['mfg_date'] = serialize_date(medicine.get('mfg_date'))
            medicine['exp_date'] = serialize_date(medicine.get('exp_date'))
            medicine['created_at'] = serialize_datetime(medicine.get('created_at'))
            medicine['updated_at'] = serialize_datetime(medicine.get('updated_at'))
            return jsonify(medicine), 200
        else:
            return jsonify({'error': 'Medicine not found'}), 404
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines/search', methods=['GET'])
def search_medicines():
    """Search medicines by name, company, or supplier"""
    search_term = request.args.get('q', '')
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT m.*, s.supplier_name, s.contact_no
            FROM medicines m
            JOIN suppliers s ON m.supplier_id = s.supplier_id
            WHERE m.name LIKE %s OR m.company LIKE %s OR s.supplier_name LIKE %s
            ORDER BY m.name
        """
        search_pattern = f'%{search_term}%'
        cursor.execute(query, (search_pattern, search_pattern, search_pattern))
        medicines = cursor.fetchall()
        
        # Serialize date objects
        for medicine in medicines:
            medicine['mfg_date'] = serialize_date(medicine.get('mfg_date'))
            medicine['exp_date'] = serialize_date(medicine.get('exp_date'))
            medicine['created_at'] = serialize_datetime(medicine.get('created_at'))
            medicine['updated_at'] = serialize_datetime(medicine.get('updated_at'))
        
        return jsonify(medicines), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines/expiring', methods=['GET'])
def get_expiring_medicines():
    """Get medicines expiring within specified days (default 30 days)"""
    days = request.args.get('days', 30, type=int)
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT m.*, s.supplier_name, s.contact_no,
                   DATEDIFF(m.exp_date, CURDATE()) as days_until_expiry
            FROM medicines m
            JOIN suppliers s ON m.supplier_id = s.supplier_id
            WHERE m.exp_date <= DATE_ADD(CURDATE(), INTERVAL %s DAY)
            AND m.exp_date >= CURDATE()
            ORDER BY m.exp_date
        """
        cursor.execute(query, (days,))
        medicines = cursor.fetchall()
        
        for medicine in medicines:
            medicine['mfg_date'] = serialize_date(medicine.get('mfg_date'))
            medicine['exp_date'] = serialize_date(medicine.get('exp_date'))
            medicine['created_at'] = serialize_datetime(medicine.get('created_at'))
            medicine['updated_at'] = serialize_datetime(medicine.get('updated_at'))
        
        return jsonify(medicines), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines', methods=['POST'])
def add_medicine():
    """Add a new medicine"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        # Validate required fields
        required_fields = ['name', 'company', 'mfg_date', 'exp_date', 'quantity', 'price', 'supplier_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate numeric fields
        try:
            quantity = int(data['quantity'])
            price = float(data['price'])
            supplier_id = int(data['supplier_id'])
            
            if quantity < 0:
                return jsonify({'error': 'Quantity must be non-negative'}), 400
            if price < 0:
                return jsonify({'error': 'Price must be non-negative'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid numeric value'}), 400
        
        cursor = connection.cursor()
        query = """
            INSERT INTO medicines (name, company, mfg_date, exp_date, quantity, price, supplier_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['name'],
            data['company'],
            data['mfg_date'],
            data['exp_date'],
            quantity,
            price,
            supplier_id
        )
        cursor.execute(query, values)
        connection.commit()
        return jsonify({'message': 'Medicine added successfully', 'id': cursor.lastrowid}), 201
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines/<int:medicine_id>', methods=['PUT'])
def update_medicine(medicine_id):
    """Update an existing medicine"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        # Validate required fields
        required_fields = ['name', 'company', 'mfg_date', 'exp_date', 'quantity', 'price', 'supplier_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate numeric fields
        try:
            quantity = int(data['quantity'])
            price = float(data['price'])
            supplier_id = int(data['supplier_id'])
            
            if quantity < 0:
                return jsonify({'error': 'Quantity must be non-negative'}), 400
            if price < 0:
                return jsonify({'error': 'Price must be non-negative'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid numeric value'}), 400
        
        cursor = connection.cursor()
        query = """
            UPDATE medicines
            SET name = %s, company = %s, mfg_date = %s, exp_date = %s,
                quantity = %s, price = %s, supplier_id = %s
            WHERE medicine_id = %s
        """
        values = (
            data['name'],
            data['company'],
            data['mfg_date'],
            data['exp_date'],
            quantity,
            price,
            supplier_id,
            medicine_id
        )
        cursor.execute(query, values)
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Medicine not found'}), 404
        
        return jsonify({'message': 'Medicine updated successfully'}), 200
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/medicines/<int:medicine_id>', methods=['DELETE'])
def delete_medicine(medicine_id):
    """Delete a medicine"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        query = "DELETE FROM medicines WHERE medicine_id = %s"
        cursor.execute(query, (medicine_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Medicine not found'}), 404
        
        return jsonify({'message': 'Medicine deleted successfully'}), 200
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Medical Storage Management System API is running'}), 200


if __name__ == '__main__':
    app.run(debug=FLASK_CONFIG['DEBUG'], port=FLASK_CONFIG['PORT'], host=FLASK_CONFIG['HOST'])

