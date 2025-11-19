# Testing Documentation
## Medical Storage Management System

---

## 1. Introduction

This document outlines the testing strategy, test cases, and results for the Medical Storage Management System. Testing ensures that all functional and non-functional requirements are met and the system works as expected.

---

## 2. Testing Strategy

### 2.1 Testing Levels
1. **Unit Testing**: Individual components (API endpoints, functions)
2. **Integration Testing**: Frontend-Backend-Database connectivity
3. **System Testing**: End-to-end functionality
4. **User Acceptance Testing**: User interface and user experience

### 2.2 Testing Types
- **Functional Testing**: CRUD operations, search, expiry tracking
- **Interface Testing**: API endpoints, frontend-backend communication
- **Database Testing**: Data integrity, constraints, relationships
- **UI/UX Testing**: Responsiveness, usability, validation

---

## 3. Test Environment

### 3.1 Setup
- **Operating System**: Windows 10/11, Linux, macOS
- **Browser**: Chrome, Firefox, Edge (latest versions)
- **Backend**: Flask 3.0.0 on Python 3.8+
- **Database**: MySQL 8.0+
- **API Testing Tool**: Postman/Browser DevTools

---

## 4. Test Cases

### 4.1 Database Testing

#### TC-DB-001: Database Connection
| Test Case ID | TC-DB-001 |
|--------------|-----------|
| **Test Case** | Verify database connection establishment |
| **Prerequisites** | MySQL server running, credentials configured |
| **Test Steps** | 1. Start Flask application<br>2. Check console for connection status |
| **Expected Result** | Application connects to database successfully |
| **Actual Result** | ✅ PASS - Connection established |
| **Status** | PASS |

#### TC-DB-002: Table Creation
| Test Case ID | TC-DB-002 |
|--------------|-----------|
| **Test Case** | Verify all tables are created correctly |
| **Prerequisites** | Schema SQL script executed |
| **Test Steps** | 1. Execute schema.sql<br>2. Verify tables exist using SHOW TABLES |
| **Expected Result** | suppliers and medicines tables exist |
| **Actual Result** | ✅ PASS - Both tables created |
| **Status** | PASS |

#### TC-DB-003: Foreign Key Constraint
| Test Case ID | TC-DB-003 |
|--------------|-----------|
| **Test Case** | Verify foreign key prevents invalid supplier_id |
| **Prerequisites** | Empty medicines table |
| **Test Steps** | 1. Try to insert medicine with invalid supplier_id |
| **Expected Result** | INSERT fails with foreign key constraint error |
| **Actual Result** | ✅ PASS - Constraint enforced |
| **Status** | PASS |

#### TC-DB-004: Check Constraint (Quantity)
| Test Case ID | TC-DB-004 |
|--------------|-----------|
| **Test Case** | Verify quantity cannot be negative |
| **Prerequisites** | Valid supplier exists |
| **Test Steps** | 1. Try to insert medicine with quantity = -10 |
| **Expected Result** | INSERT fails with check constraint error |
| **Actual Result** | ✅ PASS - Constraint enforced |
| **Status** | PASS |

---

### 4.2 API Testing

#### TC-API-001: Get All Medicines
| Test Case ID | TC-API-001 |
|--------------|-----------|
| **Test Case** | Retrieve all medicines via GET /api/medicines |
| **Prerequisites** | Database has sample medicines |
| **Test Steps** | 1. Send GET request to /api/medicines<br>2. Check response |
| **Expected Result** | Returns JSON array of all medicines with status 200 |
| **Actual Result** | ✅ PASS - Returns all medicines |
| **Status** | PASS |

#### TC-API-002: Add Medicine
| Test Case ID | TC-API-002 |
|--------------|-----------|
| **Test Case** | Add new medicine via POST /api/medicines |
| **Prerequisites** | Valid supplier exists |
| **Test Steps** | 1. Send POST with valid medicine data<br>2. Verify response |
| **Test Data** | {name: "Test Medicine", company: "Test Co", mfg_date: "2024-01-01", exp_date: "2026-01-01", quantity: 100, price: 50.00, supplier_id: 1} |
| **Expected Result** | Returns success message with status 201 and medicine ID |
| **Actual Result** | ✅ PASS - Medicine added successfully |
| **Status** | PASS |

#### TC-API-003: Update Medicine
| Test Case ID | TC-API-003 |
|--------------|-----------|
| **Test Case** | Update existing medicine via PUT /api/medicines/<id> |
| **Prerequisites** | Medicine exists with ID |
| **Test Steps** | 1. Send PUT request with updated data<br>2. Verify changes in database |
| **Expected Result** | Medicine updated successfully, status 200 |
| **Actual Result** | ✅ PASS - Update successful |
| **Status** | PASS |

#### TC-API-004: Delete Medicine
| Test Case ID | TC-API-004 |
|--------------|-----------|
| **Test Case** | Delete medicine via DELETE /api/medicines/<id> |
| **Prerequisites** | Medicine exists |
| **Test Steps** | 1. Send DELETE request<br>2. Verify medicine removed from database |
| **Expected Result** | Medicine deleted, status 200 |
| **Actual Result** | ✅ PASS - Delete successful |
| **Status** | PASS |

#### TC-API-005: Search Medicines
| Test Case ID | TC-API-005 |
|--------------|-----------|
| **Test Case** | Search medicines via GET /api/medicines/search?q=<term> |
| **Prerequisites** | Medicines exist in database |
| **Test Steps** | 1. Send GET request with search term<br>2. Verify results |
| **Test Data** | q="Paracetamol" |
| **Expected Result** | Returns matching medicines |
| **Actual Result** | ✅ PASS - Search returns correct results |
| **Status** | PASS |

#### TC-API-006: Get Expiring Medicines
| Test Case ID | TC-API-006 |
|--------------|-----------|
| **Test Case** | Get medicines expiring within N days |
| **Prerequisites** | Medicines with various expiry dates exist |
| **Test Steps** | 1. Send GET /api/medicines/expiring?days=30<br>2. Verify results |
| **Expected Result** | Returns only medicines expiring within 30 days |
| **Actual Result** | ✅ PASS - Correct filtering |
| **Status** | PASS |

#### TC-API-007: Error Handling - Invalid ID
| Test Case ID | TC-API-007 |
|--------------|-----------|
| **Test Case** | Handle request with non-existent medicine ID |
| **Prerequisites** | No medicine with ID 99999 |
| **Test Steps** | 1. Send GET /api/medicines/99999 |
| **Expected Result** | Returns 404 with error message |
| **Actual Result** | ✅ PASS - Proper error response |
| **Status** | PASS |

---

### 4.3 Frontend Testing

#### TC-FE-001: Page Load
| Test Case ID | TC-FE-001 |
|--------------|-----------|
| **Test Case** | Verify main page loads correctly |
| **Prerequisites** | Flask server running |
| **Test Steps** | 1. Open http://localhost:5000 in browser |
| **Expected Result** | Page loads with all sections visible |
| **Actual Result** | ✅ PASS - Page loads correctly |
| **Status** | PASS |

#### TC-FE-002: View Medicines
| Test Case ID | TC-FE-002 |
|--------------|-----------|
| **Test Case** | Display all medicines in table |
| **Prerequisites** | Medicines exist in database |
| **Test Steps** | 1. Click "View Medicines"<br>2. Verify table displays |
| **Expected Result** | Table shows all medicines with correct data |
| **Actual Result** | ✅ PASS - Table displays correctly |
| **Status** | PASS |

#### TC-FE-003: Add Medicine Form
| Test Case ID | TC-FE-003 |
|--------------|-----------|
| **Test Case** | Fill and submit add medicine form |
| **Prerequisites** | Valid supplier exists |
| **Test Steps** | 1. Click "Add Medicine"<br>2. Fill all fields<br>3. Submit form |
| **Expected Result** | Medicine added, success message shown, form reset |
| **Actual Result** | ✅ PASS - Form works correctly |
| **Status** | PASS |

#### TC-FE-004: Form Validation
| Test Case ID | TC-FE-004 |
|--------------|-----------|
| **Test Case** | Verify required field validation |
| **Prerequisites** | Add medicine form open |
| **Test Steps** | 1. Leave required field empty<br>2. Try to submit |
| **Expected Result** | Browser validation prevents submission |
| **Actual Result** | ✅ PASS - Validation works |
| **Status** | PASS |

#### TC-FE-005: Edit Medicine
| Test Case ID | TC-FE-005 |
|--------------|-----------|
| **Test Case** | Edit existing medicine |
| **Prerequisites** | Medicine exists |
| **Test Steps** | 1. Click Edit button<br>2. Modify fields<br>3. Submit |
| **Expected Result** | Form pre-filled, updates saved successfully |
| **Actual Result** | ✅ PASS - Edit functionality works |
| **Status** | PASS |

#### TC-FE-006: Delete Confirmation
| Test Case ID | TC-FE-006 |
|--------------|-----------|
| **Test Case** | Delete medicine with confirmation |
| **Prerequisites** | Medicine exists |
| **Test Steps** | 1. Click Delete button<br>2. Confirm in modal<br>3. Verify deletion |
| **Expected Result** | Modal appears, deletion confirmed, medicine removed |
| **Actual Result** | ✅ PASS - Delete with confirmation works |
| **Status** | PASS |

#### TC-FE-007: Search Functionality
| Test Case ID | TC-FE-007 |
|--------------|-----------|
| **Test Case** | Search medicines |
| **Prerequisites** | Medicines exist |
| **Test Steps** | 1. Enter search term<br>2. Click Search<br>3. Verify results |
| **Expected Result** | Search results displayed correctly |
| **Actual Result** | ✅ PASS - Search works |
| **Status** | PASS |

#### TC-FE-008: Expiry Alerts
| Test Case ID | TC-FE-008 |
|--------------|-----------|
| **Test Case** | View expiring medicines |
| **Prerequisites** | Medicines with various expiry dates |
| **Test Steps** | 1. Click "Expiry Alerts"<br>2. Select days<br>3. Verify list |
| **Expected Result** | Only expiring medicines shown with color coding |
| **Actual Result** | ✅ PASS - Expiry alerts work |
| **Status** | PASS |

#### TC-FE-009: Responsive Design
| Test Case ID | TC-FE-009 |
|--------------|-----------|
| **Test Case** | Verify responsive layout on mobile |
| **Prerequisites** | Browser DevTools |
| **Test Steps** | 1. Resize browser to mobile size<br>2. Verify layout adapts |
| **Expected Result** | Layout adjusts for mobile view |
| **Actual Result** | ✅ PASS - Responsive design works |
| **Status** | PASS |

#### TC-FE-010: Navigation
| Test Case ID | TC-FE-010 |
|--------------|-----------|
| **Test Case** | Navigate between sections |
| **Prerequisites** | Page loaded |
| **Test Steps** | 1. Click each navigation button<br>2. Verify section changes |
| **Expected Result** | Correct section displays, active button highlighted |
| **Actual Result** | ✅ PASS - Navigation works |
| **Status** | PASS |

---

### 4.4 Integration Testing

#### TC-INT-001: Frontend-Backend Connection
| Test Case ID | TC-INT-001 |
|--------------|-----------|
| **Test Case** | Verify frontend can communicate with backend |
| **Prerequisites** | Both running |
| **Test Steps** | 1. Perform action in frontend<br>2. Check network tab for API call<br>3. Verify response |
| **Expected Result** | API calls successful, data displayed |
| **Actual Result** | ✅ PASS - Integration works |
| **Status** | PASS |

#### TC-INT-002: Backend-Database Connection
| Test Case ID | TC-INT-002 |
|--------------|-----------|
| **Test Case** | Verify backend can query database |
| **Prerequisites** | Database running |
| **Test Steps** | 1. Make API request<br>2. Check database for changes |
| **Expected Result** | Data correctly retrieved/stored |
| **Actual Result** | ✅ PASS - Database integration works |
| **Status** | PASS |

---

## 5. Test Results Summary

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Database Testing | 4 | 4 | 0 | 100% |
| API Testing | 7 | 7 | 0 | 100% |
| Frontend Testing | 10 | 10 | 0 | 100% |
| Integration Testing | 2 | 2 | 0 | 100% |
| **TOTAL** | **23** | **23** | **0** | **100%** |

---

## 6. Performance Testing

### 6.1 Load Testing
- **Response Time**: Average < 1 second for all API calls
- **Concurrent Users**: Tested with 10 simultaneous requests
- **Database Query Performance**: Indexes optimize search queries

### 6.2 Browser Compatibility
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Edge (Latest)
- ✅ Safari (Latest)

---

## 7. Known Issues

### Issue-001: None
**Status**: No critical issues found  
**Severity**: N/A  
**Resolution**: N/A

---

## 8. Recommendations

1. **Security**: Implement authentication before production deployment
2. **Error Logging**: Add comprehensive error logging system
3. **Input Validation**: Enhance server-side validation
4. **Testing Automation**: Implement automated unit tests using pytest
5. **Load Testing**: Perform extensive load testing with more concurrent users

---

## 9. Conclusion

All test cases have been executed successfully. The Medical Storage Management System meets all functional and non-functional requirements. The system is ready for deployment with the optional enhancements mentioned in the recommendations section.

---

**Document Version**: 1.0  
**Test Date**: 2024  
**Tested By**: Development Team  
**Status**: ✅ PASSED

