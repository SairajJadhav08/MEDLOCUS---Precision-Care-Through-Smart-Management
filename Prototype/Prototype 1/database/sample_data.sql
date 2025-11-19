-- Medical Storage Management System - Sample Data
-- Additional sample data for testing

USE medvault_db;

-- Additional suppliers
INSERT INTO suppliers (supplier_name, contact_no) VALUES
('City Medical Supplies', '678-901-2345'),
('Rural Health Distributors', '789-012-3456'),
('Emergency Meds Ltd.', '890-123-4567');

-- Additional medicines with various expiry dates for testing
INSERT INTO medicines (name, company, mfg_date, exp_date, quantity, price, supplier_id) VALUES
('Metronidazole 400mg', 'PharmaCorp', '2023-12-01', '2025-06-01', 180, 42.50, 1),
('Ciprofloxacin 500mg', 'MediCare Labs', '2024-05-01', '2025-11-01', 220, 60.00, 2),
('Azithromycin 250mg', 'HealthPlus', '2024-06-10', '2026-06-10', 300, 75.25, 5),
('Losartan 50mg', 'Global Meds', '2024-04-15', '2026-04-15', 175, 65.50, 3),
('Pantoprazole 40mg', 'PharmaCorp', '2024-07-01', '2026-07-01', 200, 48.75, 4),
('Amlodipine 5mg', 'City Medical Supplies', '2024-05-20', '2026-05-20', 280, 55.00, 6),
('Levothyroxine 50mcg', 'Rural Health Distributors', '2024-06-05', '2025-12-05', 150, 85.00, 7),
('Clopidogrel 75mg', 'Emergency Meds Ltd.', '2024-08-01', '2026-08-01', 160, 95.50, 8);

