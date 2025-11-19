// Medical Storage Management System - Enhanced JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('alert');
    if (alertDiv) {
        alertDiv.className = `alert alert-${type} show`;
        alertDiv.innerHTML = `<strong>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</strong> ${message}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.textContent = '';
            }, 400);
        }, 5000);
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function checkExpiryStatus(expDate) {
    if (!expDate) return { status: 'unknown', class: '' };
    const today = new Date();
    const expiry = new Date(expDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { status: 'expired', class: 'expired', days: diffDays };
    } else if (diffDays <= 30) {
        return { status: 'expiring', class: 'expiring-soon', days: diffDays };
    }
    return { status: 'valid', class: '', days: diffDays };
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
}

// API Functions with better error handling
async function fetchMedicines() {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch medicines');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching medicines:', error);
        showAlert('Error loading medicines: ' + error.message, 'error');
        return [];
    }
}

async function fetchMedicine(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch medicine');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching medicine:', error);
        showAlert('Error loading medicine: ' + error.message, 'error');
        return null;
    }
}

async function searchMedicines(query) {
    try {
        if (!query || query.trim() === '') {
            return [];
        }
        const response = await fetch(`${API_BASE_URL}/medicines/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Search failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching medicines:', error);
        showAlert('Error searching medicines: ' + error.message, 'error');
        return [];
    }
}

async function addMedicine(medicineData) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to add medicine');
        return data;
    } catch (error) {
        console.error('Error adding medicine:', error);
        throw error;
    }
}

async function updateMedicine(id, medicineData) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update medicine');
        return data;
    } catch (error) {
        console.error('Error updating medicine:', error);
        throw error;
    }
}

async function deleteMedicine(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete medicine');
        return data;
    } catch (error) {
        console.error('Error deleting medicine:', error);
        throw error;
    }
}

async function fetchSuppliers() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch suppliers');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return [];
    }
}

// Supplier Dropdown Population
async function populateSupplierDropdown(selectElement, selectedId = null) {
    try {
        const suppliers = await fetchSuppliers();
        selectElement.innerHTML = '<option value="">Select Supplier</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.supplier_id;
            option.textContent = `${supplier.supplier_name} (${supplier.contact_no})`;
            if (selectedId && supplier.supplier_id == selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating supplier dropdown:', error);
        selectElement.innerHTML = '<option value="">Error loading suppliers</option>';
    }
}

// Enhanced Medicine Table Rendering with animations
// isExpired: true for expired medicines table, false for good medicines table
function renderMedicineTable(medicines, containerId, isExpired = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (medicines.length === 0) {
        const emptyMessage = isExpired 
            ? '<div class="empty-state"><p>✅ Great! No expired medicines</p><p style="font-size: 0.9em; margin-top: 10px; color: #94a3b8;">All medicines are valid</p></div>'
            : '<div class="empty-state"><p>📦 No good medicines found</p><p style="font-size: 0.9em; margin-top: 10px; color: #94a3b8;">All medicines may have expired</p></div>';
        container.innerHTML = emptyMessage;
        return;
    }
    
    let tableHTML = `
        <div class="table-container ${isExpired ? 'expired-table' : 'good-table'}">
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">ID</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Mfg Date</th>
                        <th>Expiry Date</th>
                        <th style="text-align: center;">Quantity</th>
                        <th style="text-align: right;">Price</th>
                        <th>Supplier</th>
                        <th style="text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    medicines.forEach((medicine, index) => {
        const expiryStatus = checkExpiryStatus(medicine.exp_date);
        const rowClass = expiryStatus.class ? expiryStatus.class : '';
        const badgeHTML = expiryStatus.status === 'expired' 
            ? '<span class="badge badge-danger">Expired</span>' 
            : expiryStatus.status === 'expiring' 
            ? `<span class="badge badge-warning">${expiryStatus.days} days</span>` 
            : '';
        
        // Ensure all fields have values
        const medicineId = medicine.medicine_id || 'N/A';
        const name = medicine.name || 'N/A';
        const company = medicine.company || 'N/A';
        const mfgDate = medicine.mfg_date || '';
        const expDate = medicine.exp_date || '';
        const quantity = medicine.quantity !== undefined ? medicine.quantity : 'N/A';
        const price = medicine.price !== undefined ? medicine.price : 0;
        const supplierName = medicine.supplier_name || 'N/A';
        
        tableHTML += `
            <tr class="${rowClass}" style="animation: fadeInUp 0.5s ease-out ${index * 0.05}s both;">
                <td><strong>#${medicineId}</strong></td>
                <td><strong>${escapeHtml(String(name))}</strong></td>
                <td>${escapeHtml(String(company))}</td>
                <td>${formatDate(mfgDate)}</td>
                <td>
                    ${formatDate(expDate)} 
                    ${badgeHTML}
                </td>
                <td><strong>${quantity}</strong></td>
                <td><strong>${formatCurrency(parseFloat(price))}</strong></td>
                <td>${escapeHtml(String(supplierName))}</td>
                <td>
                    <div class="action-buttons" style="margin: 0; justify-content: center;">
                        <button class="btn btn-warning" onclick="editMedicine(${medicineId})" style="padding: 8px 14px; font-size: 13px;">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger" onclick="confirmDelete(${medicineId})" style="padding: 8px 14px; font-size: 13px;">
                            🗑️ Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

// Enhanced Delete Confirmation with modal-style
function confirmDelete(id) {
    const medicineName = prompt('Are you sure you want to delete this medicine?\n\nType "DELETE" to confirm:');
    if (medicineName === 'DELETE') {
        // Show loading in both tables
        showLoading('expired-medicines-table');
        showLoading('good-medicines-table');
        deleteMedicine(id)
            .then(() => {
                showAlert('Medicine deleted successfully!', 'success');
                setTimeout(() => {
                    if (typeof loadMedicines === 'function') {
                        loadMedicines();
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'error');
            });
    } else if (medicineName !== null) {
        showAlert('Deletion cancelled. Please type "DELETE" exactly to confirm.', 'info');
    }
}

// Edit Medicine (redirect to update page)
function editMedicine(id) {
    window.location.href = `update_medicine.html?id=${id}`;
}

// Enhanced Form Validation
function validateMedicineForm(form) {
    const name = form.querySelector('[name="name"]').value.trim();
    const company = form.querySelector('[name="company"]').value.trim();
    const mfgDate = form.querySelector('[name="mfg_date"]').value;
    const expDate = form.querySelector('[name="exp_date"]').value;
    const quantity = form.querySelector('[name="quantity"]').value;
    const price = form.querySelector('[name="price"]').value;
    const supplierId = form.querySelector('[name="supplier_id"]').value;
    
    // Clear previous error styles
    form.querySelectorAll('input, select').forEach(el => {
        el.style.borderColor = '';
    });
    
    let isValid = true;
    let firstError = null;
    
    if (!name) {
        showFieldError(form.querySelector('[name="name"]'), 'Medicine name is required');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="name"]');
    }
    
    if (!company) {
        showFieldError(form.querySelector('[name="company"]'), 'Company name is required');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="company"]');
    }
    
    if (!mfgDate) {
        showFieldError(form.querySelector('[name="mfg_date"]'), 'Manufacture date is required');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="mfg_date"]');
    }
    
    if (!expDate) {
        showFieldError(form.querySelector('[name="exp_date"]'), 'Expiry date is required');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="exp_date"]');
    }
    
    if (!quantity || parseInt(quantity) < 0) {
        showFieldError(form.querySelector('[name="quantity"]'), 'Valid quantity is required (>= 0)');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="quantity"]');
    }
    
    if (!price || parseFloat(price) < 0) {
        showFieldError(form.querySelector('[name="price"]'), 'Valid price is required (>= 0)');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="price"]');
    }
    
    if (!supplierId) {
        showFieldError(form.querySelector('[name="supplier_id"]'), 'Supplier selection is required');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="supplier_id"]');
    }
    
    if (mfgDate && expDate && new Date(expDate) <= new Date(mfgDate)) {
        showFieldError(form.querySelector('[name="exp_date"]'), 'Expiry date must be after manufacture date');
        isValid = false;
        if (!firstError) firstError = form.querySelector('[name="exp_date"]');
    }
    
    if (!isValid) {
        showAlert('Please fill in all fields correctly', 'error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    if (field) {
        field.style.borderColor = 'var(--danger-color)';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Remove error style on input
        field.addEventListener('input', function removeError() {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.removeEventListener('input', removeError);
        });
    }
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
