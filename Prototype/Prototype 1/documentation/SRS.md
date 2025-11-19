# Software Requirements Specification (SRS)
## Medical Storage Management System

---

### Document Information
- **Project Name**: Medical Storage Management System
- **Version**: 1.0
- **Date**: 2024
- **Author**: Development Team

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for the Medical Storage Management System, a web-based application designed to help pharmacies manage medicine inventory digitally with efficient database operations and user-friendly interface.

### 1.2 Scope
The system provides comprehensive medicine inventory management including:
- Medicine registration and tracking
- Supplier information management
- Inventory search and filtering
- Expiry date monitoring
- Full CRUD (Create, Read, Update, Delete) operations

### 1.3 Definitions and Acronyms
- **CRUD**: Create, Read, Update, Delete
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **3NF**: Third Normal Form (database normalization)
- **UI**: User Interface
- **SDLC**: Software Development Life Cycle

---

## 2. Overall Description

### 2.1 Product Perspective
The system is a standalone web application consisting of:
- **Frontend**: HTML, CSS, JavaScript (client-side)
- **Backend**: Python Flask (server-side)
- **Database**: MySQL (data storage)

### 2.2 Product Functions
1. Medicine Management
   - Add new medicine records
   - View all medicines
   - Update existing medicine information
   - Delete medicine records
   - Search medicines by name, company, or supplier

2. Supplier Management
   - View all suppliers
   - Add new suppliers (optional)

3. Inventory Tracking
   - Monitor stock quantities
   - Track expiry dates
   - Alert for expiring medicines

4. Data Validation
   - Input validation
   - Date validation
   - Numeric field validation

### 2.3 User Classes
- **Primary Users**: Pharmacy staff, inventory managers
- **User Characteristics**: Basic computer literacy, familiarity with web browsers

### 2.4 Operating Environment
- **Server**: Python 3.x, Flask framework
- **Database**: MySQL 5.7 or higher
- **Client**: Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Operating System**: Cross-platform (Windows, Linux, macOS)

---

## 3. System Features

### 3.1 Feature 1: Medicine Management

#### 3.1.1 Add Medicine
**Description**: Users can add new medicine records to the system.

**Priority**: High

**Functional Requirements**:
- FR1.1: System shall allow users to enter medicine details:
  - Medicine name (required, text)
  - Company name (required, text)
  - Manufacture date (required, date)
  - Expiry date (required, date)
  - Quantity (required, integer, >= 0)
  - Price (required, decimal, >= 0)
  - Supplier (required, selection from dropdown)
- FR1.2: System shall validate that expiry date is after manufacture date
- FR1.3: System shall validate all required fields are filled
- FR1.4: System shall store medicine data in database
- FR1.5: System shall display success/error messages after submission

**Non-Functional Requirements**:
- NFR1.1: Form submission should complete within 2 seconds
- NFR1.2: Input validation should occur on both client and server side

#### 3.1.2 View Medicines
**Description**: Users can view all medicines in the system.

**Priority**: High

**Functional Requirements**:
- FR2.1: System shall display all medicines in a table format
- FR2.2: System shall show medicine details:
  - Medicine ID
  - Name
  - Company
  - Manufacture Date
  - Expiry Date
  - Quantity
  - Price
  - Supplier Name
- FR2.3: System shall highlight expired medicines
- FR2.4: System shall highlight medicines expiring soon (within 30 days)
- FR2.5: System shall provide edit and delete options for each medicine

**Non-Functional Requirements**:
- NFR2.1: Page should load within 3 seconds for up to 1000 records
- NFR2.2: Table should be responsive and scrollable on mobile devices

#### 3.1.3 Update Medicine
**Description**: Users can modify existing medicine records.

**Priority**: High

**Functional Requirements**:
- FR3.1: System shall load existing medicine data into update form
- FR3.2: System shall allow modification of all medicine fields
- FR3.3: System shall validate updated data
- FR3.4: System shall save changes to database
- FR3.5: System shall display success message after update

**Non-Functional Requirements**:
- NFR3.1: Form should pre-populate within 1 second

#### 3.1.4 Delete Medicine
**Description**: Users can remove medicine records from the system.

**Priority**: High

**Functional Requirements**:
- FR4.1: System shall prompt user for confirmation before deletion
- FR4.2: System shall remove medicine from database
- FR4.3: System shall handle foreign key constraints appropriately
- FR4.4: System shall display success message after deletion
- FR4.5: System shall update view after deletion

**Non-Functional Requirements**:
- NFR4.1: Deletion should complete within 1 second

#### 3.1.5 Search Medicine
**Description**: Users can search for medicines by various criteria.

**Priority**: Medium

**Functional Requirements**:
- FR5.1: System shall allow search by medicine name
- FR5.2: System shall allow search by company name
- FR5.3: System shall allow search by supplier name
- FR5.4: System shall display matching results in real-time
- FR5.5: System shall show "no results" message when no matches found

**Non-Functional Requirements**:
- NFR5.1: Search results should appear within 1 second
- NFR5.2: Search should support partial matches

### 3.2 Feature 2: Supplier Management

#### 3.2.1 View Suppliers
**Description**: System displays all suppliers for selection in forms.

**Priority**: Medium

**Functional Requirements**:
- FR6.1: System shall display all suppliers in dropdown menus
- FR6.2: System shall show supplier name and contact number
- FR6.3: System shall sort suppliers alphabetically

### 3.3 Feature 3: Expiry Tracking

**Description**: System monitors and alerts about expiring medicines.

**Priority**: Medium

**Functional Requirements**:
- FR7.1: System shall identify medicines expiring within 30 days
- FR7.2: System shall display expiry warnings on dashboard
- FR7.3: System shall highlight expired medicines in red
- FR7.4: System shall highlight soon-to-expire medicines in yellow/orange

---

## 4. External Interface Requirements

### 4.1 User Interface
- Clean, modern, responsive design
- Navigation menu for easy access to all features
- Form validation with clear error messages
- Success/error notifications
- Color-coded expiry status indicators

### 4.2 Hardware Interface
- Standard web server hardware requirements
- Minimum 2GB RAM
- 10GB storage space for database

### 4.3 Software Interface
- **Database**: MySQL 5.7+
- **Backend**: Python 3.7+, Flask 3.0+
- **Frontend**: HTML5, CSS3, ES6+ JavaScript
- **Browser**: Modern browsers with JavaScript enabled

### 4.4 Communication Interface
- RESTful API endpoints
- JSON data format
- HTTP/HTTPS protocol

---

## 5. System Constraints

### 5.1 Technical Constraints
- MySQL database must be accessible
- Flask server must run on designated port
- Browser must support modern JavaScript features
- CORS must be enabled for API access

### 5.2 Regulatory Constraints
- Medical data must be handled securely
- Data privacy considerations for sensitive information

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: < 3 seconds
- API response time: < 1 second
- Support for up to 10,000 medicine records

### 6.2 Security
- Input validation to prevent SQL injection
- XSS (Cross-Site Scripting) prevention
- CORS configuration for API security

### 6.3 Usability
- Intuitive user interface
- Clear error messages
- Responsive design for mobile devices
- Keyboard navigation support

### 6.4 Reliability
- System should be available 95% of the time
- Data backup and recovery mechanisms
- Transaction support for data integrity

### 6.5 Maintainability
- Well-documented code
- Modular architecture
- Following coding standards

---

## 7. Database Requirements

### 7.1 Database Schema
- **Database Name**: medvault_db
- **Tables**: suppliers, medicines
- **Normalization**: 3NF (Third Normal Form)

### 7.2 Data Integrity
- Primary key constraints
- Foreign key constraints
- Check constraints for quantity and price
- NOT NULL constraints for required fields

### 7.3 Indexes
- Indexes on frequently searched columns
- Foreign key indexes for join operations

---

## 8. Testing Requirements

### 8.1 Unit Testing
- Test individual API endpoints
- Test database operations
- Test validation functions

### 8.2 Integration Testing
- Test frontend-backend integration
- Test database connectivity
- Test API responses

### 8.3 System Testing
- Test complete user workflows
- Test error handling
- Test edge cases

---

## 9. Future Enhancements (Optional Features)

- User authentication and authorization
- Export inventory to CSV/Excel
- Advanced reporting and analytics
- Email notifications for expiry alerts
- Barcode scanning support
- Multi-location inventory management

---

## 10. Glossary

- **Medicine**: Pharmaceutical product stored in inventory
- **Supplier**: Vendor providing medicines
- **Expiry Date**: Date after which medicine should not be used
- **Manufacture Date**: Date when medicine was produced
- **CRUD**: Create, Read, Update, Delete operations
- **API**: Application Programming Interface for data exchange

---

## Appendix A: API Endpoints

### Medicine Endpoints
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/<id>` - Get medicine by ID
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/<id>` - Update medicine
- `DELETE /api/medicines/<id>` - Delete medicine
- `GET /api/medicines/search?q=<query>` - Search medicines
- `GET /api/medicines/expiring?days=<days>` - Get expiring medicines

### Supplier Endpoints
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Add new supplier

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | | | |
| Client | | | |

---

**End of SRS Document**
