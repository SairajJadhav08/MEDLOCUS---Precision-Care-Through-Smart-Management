# Entity Relationship Diagram & Relational Model
## Medical Storage Management System

---

## 1. ER Diagram

### Textual Representation

```
┌─────────────────────┐
│      SUPPLIERS      │
├─────────────────────┤
│ supplier_id (PK)    │
│ supplier_name       │
│ contact_no          │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
           │
┌──────────▼──────────┐
│      MEDICINES      │
├─────────────────────┤
│ medicine_id (PK)    │
│ name                │
│ company             │
│ mfg_date            │
│ exp_date            │
│ quantity            │
│ price               │
│ supplier_id (FK)    │───────┐
│ created_at          │       │
│ updated_at          │       │
└─────────────────────┘       │
                              │
                              │ References
                              │
┌──────────────────────────────┘
│
│ Relationship: One-to-Many
│ One Supplier can supply Many Medicines
│ One Medicine belongs to One Supplier
```

### Relationship Details

**Suppliers (1) ───< Supplies >─── (N) Medicines**

- **Cardinality**: One-to-Many
- **Participation**: 
  - Suppliers: Partial (supplier can exist without medicines)
  - Medicines: Total (medicine must have a supplier)
- **Relationship Attributes**: None

---

## 2. Entity Descriptions

### 2.1 SUPPLIERS Entity

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| supplier_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for supplier |
| supplier_name | VARCHAR(255) | NOT NULL | Name of the supplier company |
| contact_no | VARCHAR(20) | NOT NULL | Contact number of supplier |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Business Rules**:
- Each supplier must have a unique combination of name and contact number
- Supplier ID is system-generated

### 2.2 MEDICINES Entity

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| medicine_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for medicine |
| name | VARCHAR(255) | NOT NULL | Name of the medicine |
| company | VARCHAR(255) | NOT NULL | Manufacturing company |
| mfg_date | DATE | NOT NULL | Manufacture date |
| exp_date | DATE | NOT NULL | Expiry date |
| quantity | INT | NOT NULL, CHECK (>= 0) | Available quantity in stock |
| price | DECIMAL(10,2) | NOT NULL, CHECK (>= 0) | Price per unit |
| supplier_id | INT | NOT NULL, FOREIGN KEY | Reference to supplier |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Business Rules**:
- Expiry date must be after manufacture date (enforced at application level)
- Quantity cannot be negative
- Price cannot be negative
- Each medicine must belong to a valid supplier

---

## 3. Relational Model

### 3.1 Normalization

#### First Normal Form (1NF)
✅ **Achieved**: All attributes contain atomic values, no repeating groups

#### Second Normal Form (2NF)
✅ **Achieved**: All non-key attributes are fully functionally dependent on the primary key

#### Third Normal Form (3NF)
✅ **Achieved**: No transitive dependencies. All non-key attributes depend only on the primary key.

**Analysis**:
- Suppliers table: All attributes depend only on supplier_id (3NF compliant)
- Medicines table: All attributes depend only on medicine_id (3NF compliant)
- Supplier information is stored separately, eliminating redundancy

### 3.2 Relational Schema

```
SUPPLIERS (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (supplier_name, contact_no)
)

MEDICINES (
    medicine_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    supplier_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIERS(supplier_id) ON DELETE RESTRICT,
    INDEX idx_exp_date (exp_date),
    INDEX idx_name (name),
    INDEX idx_supplier (supplier_id)
)
```

### 3.3 Keys

#### Primary Keys
- **SUPPLIERS**: supplier_id
- **MEDICINES**: medicine_id

#### Foreign Keys
- **MEDICINES.supplier_id** → SUPPLIERS.supplier_id

#### Indexes
- Index on `exp_date` for efficient expiry queries
- Index on `name` for faster search operations
- Index on `supplier_id` for faster joins

---

## 4. Data Dictionary

### 4.1 SUPPLIERS Table

| Column Name | Domain | Description | Example |
|-------------|--------|-------------|---------|
| supplier_id | INT | Auto-incrementing unique ID | 1, 2, 3 |
| supplier_name | VARCHAR(255) | Full name of supplier | "MedSupply Co." |
| contact_no | VARCHAR(20) | Phone number | "9876543210" |
| created_at | TIMESTAMP | When record was created | "2024-01-15 10:30:00" |

### 4.2 MEDICINES Table

| Column Name | Domain | Description | Example |
|-------------|--------|-------------|---------|
| medicine_id | INT | Auto-incrementing unique ID | 1, 2, 3 |
| name | VARCHAR(255) | Full medicine name | "Paracetamol 500mg" |
| company | VARCHAR(255) | Manufacturing company | "ABC Pharma" |
| mfg_date | DATE | Manufacture date | "2024-01-15" |
| exp_date | DATE | Expiry date | "2026-01-15" |
| quantity | INT | Stock quantity | 500 |
| price | DECIMAL(10,2) | Price per unit | 25.50 |
| supplier_id | INT | Foreign key to suppliers | 1 |
| created_at | TIMESTAMP | Record creation time | "2024-01-15 10:30:00" |
| updated_at | TIMESTAMP | Last update time | "2024-01-20 15:45:00" |

---

## 5. Integrity Constraints

### 5.1 Entity Integrity
- Primary keys cannot be NULL
- Primary keys must be unique

### 5.2 Referential Integrity
- Foreign key `supplier_id` must reference an existing `supplier_id` in SUPPLIERS table
- ON DELETE RESTRICT: Prevents deletion of supplier if medicines reference it

### 5.3 Domain Integrity
- `quantity` >= 0 (CHECK constraint)
- `price` >= 0 (CHECK constraint)
- Date fields must be valid dates
- NOT NULL constraints on required fields

### 5.4 User-Defined Integrity
- Unique constraint on (supplier_name, contact_no) combination
- Application-level: exp_date > mfg_date

---

## 6. Sample Data

### SUPPLIERS Sample Data

| supplier_id | supplier_name | contact_no | created_at |
|-------------|---------------|------------|------------|
| 1 | MedSupply Co. | 9876543210 | 2024-01-01 10:00:00 |
| 2 | PharmaDistributors | 9876543211 | 2024-01-01 10:00:00 |
| 3 | HealthCare Supplies | 9876543212 | 2024-01-01 10:00:00 |

### MEDICINES Sample Data

| medicine_id | name | company | mfg_date | exp_date | quantity | price | supplier_id |
|-------------|------|---------|----------|----------|----------|-------|-------------|
| 1 | Paracetamol 500mg | ABC Pharma | 2024-01-15 | 2026-01-15 | 500 | 25.50 | 1 |
| 2 | Amoxicillin 250mg | XYZ Medicines | 2024-02-10 | 2026-02-10 | 300 | 150.00 | 2 |
| 3 | Ibuprofen 400mg | HealthPlus | 2024-03-01 | 2026-03-01 | 200 | 45.75 | 1 |

---

## 7. ER Diagram Visual Representation (ASCII)

```
                    SUPPLIERS
          ┌─────────────────────────────┐
          │ supplier_id (PK)            │
          │ supplier_name               │
          │ contact_no                  │
          │ created_at                  │
          └──────────────┬──────────────┘
                         │
                         │ 1
                         │
                         │ Supplies
                         │ (One-to-Many)
                         │
                         │ N
                         │
          ┌──────────────▼──────────────┐
          │        MEDICINES            │
          │ medicine_id (PK)            │
          │ name                        │
          │ company                     │
          │ mfg_date                    │
          │ exp_date                    │
          │ quantity                    │
          │ price                       │
          │ supplier_id (FK) ───────────┘
          │ created_at                  │
          │ updated_at                  │
          └─────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: 2024

