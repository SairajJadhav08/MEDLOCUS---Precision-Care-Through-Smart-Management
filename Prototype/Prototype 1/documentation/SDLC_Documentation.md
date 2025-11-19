# Software Development Life Cycle (SDLC) Documentation
## Medical Storage Management System

---

## Document Control
- **Project Name**: Medical Storage Management System
- **Version**: 1.0
- **Date**: 2024
- **Document Type**: Complete SDLC Documentation

---

## Table of Contents
1. [Title Page](#1-title-page)
2. [Abstract](#2-abstract)
3. [Introduction](#3-introduction)
4. [Software Requirements Specification (SRS)](#4-software-requirements-specification-srs)
5. [System Design](#5-system-design)
6. [ER Diagram](#6-er-diagram)
7. [Relational Model](#7-relational-model)
8. [System Architecture](#8-system-architecture)
9. [Implementation](#9-implementation)
10. [GUI Design](#10-gui-design)
11. [Source Code Structure](#11-source-code-structure)
12. [Testing Documentation](#12-testing-documentation)
13. [Conclusion](#13-conclusion)

---

## 1. Title Page

### Medical Storage Management System
**A Full-Stack Web Application for Pharmacy Inventory Management**

**Developed By**: Development Team  
**Date**: 2024  
**Technology Stack**: Python Flask, MySQL, HTML/CSS/JavaScript

---

## 2. Abstract

The Medical Storage Management System is a comprehensive web-based application designed to help pharmacies manage medicine stock digitally. The system provides a user-friendly interface for managing medicine inventory, tracking supplier information, monitoring expiry dates, and performing essential inventory operations. 

The application follows a three-tier architecture with a MySQL database backend, Python Flask REST API middleware, and HTML/CSS/JavaScript frontend. The database is normalized to Third Normal Form (3NF) to ensure data integrity and eliminate redundancy. The system implements full CRUD (Create, Read, Update, Delete) operations through RESTful API endpoints and provides a responsive, modern user interface.

Key features include medicine registration, inventory viewing, search functionality, expiry date tracking, supplier management, and comprehensive data validation. The system is designed to be scalable, maintainable, and follows software engineering best practices.

---

## 3. Introduction

### 3.1 Background
Traditional pharmacy inventory management often relies on manual record-keeping, which is prone to errors, time-consuming, and lacks real-time tracking capabilities. The Medical Storage Management System addresses these challenges by providing a digital solution for efficient inventory management.

### 3.2 Problem Statement
Pharmacies need an efficient way to:
- Track medicine inventory in real-time
- Monitor expiry dates to prevent waste
- Manage supplier information
- Search and filter medicines quickly
- Maintain accurate inventory records
- Generate reports and analytics

### 3.3 Objectives
- Develop a web-based medicine inventory management system
- Implement full CRUD operations for medicines
- Provide search and filter capabilities
- Track and alert about expiring medicines
- Ensure data integrity through normalization
- Create a user-friendly, responsive interface

### 3.4 Scope
The system covers:
- Medicine inventory management
- Supplier information management
- Expiry date tracking
- Search and filter operations
- Database operations with proper normalization

### 3.5 Limitations
- Single-user system (no multi-user authentication initially)
- No barcode scanning
- No advanced reporting features (in basic version)
- No mobile app (web-based only)

---

## 4. Software Requirements Specification (SRS)

*See SRS.md for complete requirements specification*

### Key Requirements Summary:
- **Functional Requirements**:
  - Medicine CRUD operations
  - Supplier management
  - Search functionality
  - Expiry tracking
- **Non-Functional Requirements**:
  - Performance: < 3 seconds page load
  - Security: Input validation, SQL injection prevention
  - Usability: Responsive design, intuitive UI
  - Reliability: 95% uptime, transaction support

---

## 5. System Design

### 5.1 Architecture Overview
The system follows a three-tier architecture:

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  HTML + CSS + JavaScript (Frontend)     │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│         APPLICATION LAYER               │
│       Python Flask (Backend)            │
│      RESTful API Endpoints              │
└──────────────┬──────────────────────────┘
               │ SQL Queries
┌──────────────▼──────────────────────────┐
│          DATA LAYER                     │
│        MySQL Database                   │
│    Normalized Tables (3NF)              │
└─────────────────────────────────────────┘
```

### 5.2 Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python 3.x, Flask 3.0+
- **Database**: MySQL 5.7+
- **APIs**: RESTful JSON APIs

### 5.3 Design Patterns
- MVC (Model-View-Controller) pattern
- RESTful API design
- Separation of concerns
- Modular code structure

---

## 6. ER Diagram

*See ER_Diagram.txt for complete ER diagram*

### Entity Summary:
1. **SUPPLIERS**
   - Primary Key: supplier_id
   - Attributes: supplier_name, contact_no
   
2. **MEDICINES**
   - Primary Key: medicine_id
   - Attributes: name, company, mfg_date, exp_date, quantity, price
   - Foreign Key: supplier_id → suppliers.supplier_id

### Relationship:
- One-to-Many: One supplier can supply many medicines
- Foreign Key Constraint: ON DELETE RESTRICT

---

## 7. Relational Model

### 7.1 Database Schema

#### Table: suppliers
```
suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_supplier_name (supplier_name)
)
```

#### Table: medicines
```
medicines (
    medicine_id INT PRIMARY KEY AUTO_INCREMENT,
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
)
```

### 7.2 Normalization (3NF)

#### First Normal Form (1NF)
- All attributes contain atomic values
- No repeating groups

#### Second Normal Form (2NF)
- 1NF satisfied
- All non-key attributes fully depend on primary key
- No partial dependencies

#### Third Normal Form (3NF)
- 2NF satisfied
- No transitive dependencies
- All attributes depend only on primary key

### 7.3 Data Integrity
- Primary key constraints ensure uniqueness
- Foreign key constraints maintain referential integrity
- Check constraints validate quantity and price >= 0
- NOT NULL constraints ensure required fields
- Indexes optimize query performance

---

## 8. System Architecture

### 8.1 Component Diagram

```
┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │ HTTP Requests
       │ JSON Data
       ▼
┌─────────────────────────┐
│   Flask Application     │
│  ┌───────────────────┐  │
│  │  Route Handlers   │  │
│  │  - /api/medicines │  │
│  │  - /api/suppliers │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  Business Logic   │  │
│  │  - Validation     │  │
│  │  - Data Processing│  │
│  └───────────────────┘  │
└──────┬──────────────────┘
       │ SQL Queries
       ▼
┌──────────────┐
│   MySQL DB   │
│  - suppliers │
│  - medicines │
└──────────────┘
```

### 8.2 Data Flow
1. User interacts with frontend (HTML forms/pages)
2. JavaScript makes API calls to Flask backend
3. Flask processes requests and validates data
4. Flask executes SQL queries on MySQL database
5. Database returns results
6. Flask formats JSON response
7. Frontend receives and displays data

---

## 9. Implementation

### 9.1 Backend Implementation
- **Framework**: Flask
- **Database Connection**: mysql-connector-python
- **API Endpoints**: RESTful JSON APIs
- **Error Handling**: Try-catch blocks with proper error responses
- **Validation**: Input validation on server-side

### 9.2 Frontend Implementation
- **HTML**: Semantic HTML5 structure
- **CSS**: Modern, responsive styling with CSS3
- **JavaScript**: ES6+ with async/await for API calls
- **DOM Manipulation**: Dynamic content updates
- **Form Handling**: Client-side validation

### 9.3 Database Implementation
- **Schema**: Normalized to 3NF
- **Tables**: suppliers, medicines
- **Constraints**: Primary keys, foreign keys, check constraints
- **Indexes**: On frequently queried columns

---

## 10. GUI Design

### 10.1 Design Principles
- **User-Friendly**: Intuitive navigation and clear labels
- **Responsive**: Works on desktop, tablet, and mobile
- **Modern**: Clean, professional appearance
- **Accessible**: Proper contrast, readable fonts

### 10.2 Pages/Views

#### 10.2.1 Dashboard (index.html)
- Overview statistics
- Quick action buttons
- Expiring medicines alert
- Navigation menu

#### 10.2.2 Add Medicine (add_medicine.html)
- Form with all medicine fields
- Supplier dropdown
- Date pickers for mfg/exp dates
- Validation feedback
- Submit/Cancel buttons

#### 10.2.3 View Medicines (view_medicines.html)
- Table displaying all medicines
- Color-coded expiry status
- Edit and Delete buttons for each record
- Refresh button

#### 10.2.4 Search Medicine (search_medicine.html)
- Search input field
- Real-time search results
- Results displayed in table format
- Clear search functionality

#### 10.2.5 Update Medicine (update_medicine.html)
- Pre-populated form with existing data
- All fields editable
- Validation on update
- Save/Cancel buttons

### 10.3 Color Scheme
- Primary: Blue (#3498db)
- Success: Green (#27ae60)
- Danger: Red (#e74c3c)
- Warning: Orange (#f39c12)
- Background: Gradient purple theme

### 10.4 UI Components
- Navigation bar
- Cards for content sections
- Forms with labels and inputs
- Tables for data display
- Buttons with hover effects
- Alert messages
- Badges for status indicators

---

## 11. Source Code Structure

### 11.1 Directory Structure
```
DBMS mini project/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Database configuration
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # Dashboard page
│   ├── add_medicine.html   # Add medicine form
│   ├── update_medicine.html # Update medicine form
│   ├── view_medicines.html # View all medicines
│   ├── search_medicine.html # Search page
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   └── js/
│       └── app.js          # JavaScript functions
├── database/
│   ├── schema.sql          # Database schema
│   └── sample_data.sql     # Sample data
└── documentation/
    ├── SDLC_Documentation.md
    ├── SRS.md
    └── ER_Diagram.txt
```

### 11.2 Key Files

#### Backend Files
- **app.py**: Contains all Flask routes and API endpoints
- **config.py**: Database configuration and settings

#### Frontend Files
- **app.js**: JavaScript functions for API calls and DOM manipulation
- **style.css**: Complete styling for all pages

#### Database Files
- **schema.sql**: Complete database schema with constraints

---

## 12. Testing Documentation

### 12.1 Testing Strategy
- Unit Testing: Individual components
- Integration Testing: Component interactions
- System Testing: End-to-end workflows
- User Acceptance Testing: Real-world scenarios

### 12.2 Test Cases

#### Test Case 1: Add Medicine
- **Test ID**: TC001
- **Description**: Verify adding a new medicine
- **Steps**:
  1. Navigate to Add Medicine page
  2. Fill all required fields
  3. Select supplier
  4. Click Submit
- **Expected Result**: Medicine added successfully, success message displayed
- **Status**: ✅ Pass

#### Test Case 2: View All Medicines
- **Test ID**: TC002
- **Description**: Verify viewing all medicines
- **Steps**:
  1. Navigate to View Medicines page
  2. Verify all medicines are displayed
- **Expected Result**: All medicines shown in table format
- **Status**: ✅ Pass

#### Test Case 3: Search Medicine
- **Test ID**: TC003
- **Description**: Verify search functionality
- **Steps**:
  1. Navigate to Search page
  2. Enter search term
  3. Click Search
- **Expected Result**: Matching medicines displayed
- **Status**: ✅ Pass

#### Test Case 4: Update Medicine
- **Test ID**: TC004
- **Description**: Verify updating medicine
- **Steps**:
  1. Click Edit on a medicine
  2. Modify fields
  3. Click Update
- **Expected Result**: Medicine updated, changes reflected
- **Status**: ✅ Pass

#### Test Case 5: Delete Medicine
- **Test ID**: TC005
- **Description**: Verify deleting medicine
- **Steps**:
  1. Click Delete on a medicine
  2. Confirm deletion
- **Expected Result**: Medicine removed from system
- **Status**: ✅ Pass

#### Test Case 6: Validation - Empty Fields
- **Test ID**: TC006
- **Description**: Verify form validation
- **Steps**:
  1. Try to submit form with empty fields
- **Expected Result**: Validation error displayed
- **Status**: ✅ Pass

#### Test Case 7: Validation - Invalid Dates
- **Test ID**: TC007
- **Description**: Verify date validation
- **Steps**:
  1. Enter expiry date before manufacture date
- **Expected Result**: Error message displayed
- **Status**: ✅ Pass

#### Test Case 8: Expiry Alert
- **Test ID**: TC008
- **Description**: Verify expiry tracking
- **Steps**:
  1. View medicines with expiring dates
- **Expected Result**: Expiring medicines highlighted
- **Status**: ✅ Pass

### 12.3 API Testing

#### GET /api/medicines
- **Expected**: 200 OK, JSON array of medicines
- **Status**: ✅ Pass

#### POST /api/medicines
- **Expected**: 201 Created, success message
- **Status**: ✅ Pass

#### PUT /api/medicines/<id>
- **Expected**: 200 OK, success message
- **Status**: ✅ Pass

#### DELETE /api/medicines/<id>
- **Expected**: 200 OK, success message
- **Status**: ✅ Pass

#### GET /api/medicines/search?q=<query>
- **Expected**: 200 OK, filtered results
- **Status**: ✅ Pass

### 12.4 Database Testing
- Foreign key constraints working correctly
- Check constraints preventing negative values
- Primary key auto-increment functioning
- Indexes improving query performance

---

## 13. Conclusion

### 13.1 Project Summary
The Medical Storage Management System has been successfully developed as a full-stack web application. The system provides comprehensive medicine inventory management capabilities with a user-friendly interface, robust backend, and normalized database design.

### 13.2 Achievements
- ✅ Full CRUD operations implemented
- ✅ RESTful API design
- ✅ Normalized database (3NF)
- ✅ Responsive, modern UI
- ✅ Search functionality
- ✅ Expiry tracking
- ✅ Input validation
- ✅ Error handling

### 13.3 Future Enhancements
- User authentication and authorization
- Export to CSV/Excel
- Advanced reporting
- Email notifications
- Barcode scanning
- Multi-location support
- Mobile app development

### 13.4 Lessons Learned
- Proper database normalization is crucial for data integrity
- RESTful API design improves maintainability
- Client and server-side validation both important
- Responsive design essential for modern applications
- Clear documentation aids development and maintenance

### 13.5 Final Notes
The system meets all specified requirements and provides a solid foundation for future enhancements. The modular architecture and clean code structure make it easy to maintain and extend.

---

## Appendices

### Appendix A: Installation Guide
See README.md for detailed setup instructions

### Appendix B: API Documentation
All API endpoints documented in SRS.md

### Appendix C: Database Schema
Complete schema available in database/schema.sql

---

**End of SDLC Documentation**

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete

