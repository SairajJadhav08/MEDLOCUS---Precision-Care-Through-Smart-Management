-- Medical Storage Management System - Database Schema
-- Database: medvault_db
-- Normalized to 3NF

-- Create database
CREATE DATABASE IF NOT EXISTS medvault_db;
USE medvault_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS suppliers;

-- Table: suppliers
-- Purpose: Store supplier information
-- Normalization: 3NF - No transitive dependencies
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_supplier_name (supplier_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: medicines
-- Purpose: Store medicine inventory information
-- Normalization: 3NF - All non-key attributes depend only on primary key
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data insertion
INSERT INTO suppliers (supplier_name, contact_no) VALUES
('MedSupply Co.', '123-456-7890'),
('Pharma Distributors', '234-567-8901'),
('HealthCare Solutions', '345-678-9012'),
('Global Pharmaceuticals', '456-789-0123'),
('MedTech Industries', '567-890-1234');

INSERT INTO medicines (name, company, mfg_date, exp_date, quantity, price, supplier_id) VALUES
('Paracetamol 500mg', 'PharmaCorp', '2024-01-15', '2026-01-15', 500, 25.50, 1),
('Amoxicillin 250mg', 'MediCare Labs', '2024-02-20', '2025-08-20', 300, 45.75, 2),
('Ibuprofen 400mg', 'HealthPlus', '2024-03-10', '2026-03-10', 250, 30.00, 1),
('Aspirin 100mg', 'Global Meds', '2024-01-05', '2025-12-05', 400, 15.25, 3),
('Cetirizine 10mg', 'PharmaCorp', '2024-04-12', '2025-10-12', 350, 20.50, 4),
('Omeprazole 20mg', 'MediCare Labs', '2024-02-28', '2026-02-28', 200, 55.00, 2),
('Atorvastatin 10mg', 'HealthPlus', '2024-03-15', '2026-09-15', 150, 80.75, 5),
('Metformin 500mg', 'Global Meds', '2024-01-20', '2025-07-20', 450, 35.25, 3);

