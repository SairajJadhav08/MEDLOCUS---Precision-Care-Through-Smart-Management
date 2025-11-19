// Medical Storage Management System - JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

let suppliers = [];
let deleteMedicineId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSuppliers();
    loadMedicines();
    
    // Form submissions
    document.getElementById('add-medicine-form').addEventListener('submit', handleAddMedicine);
    document.getElementById('update-medicine-form').addEventListener('submit', handleUpdateMedicine);
    
    // Search input enter key
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    });
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const sectionMap = {
        'view': 'view-section',
        'add': 'add-section',
        'update': 'update-section',
        'search': 'search-section',
        'expiring': 'expiring-section'
    };
    
    const sectionId = sectionMap[sectionName];
    if (sectionId) {
        document.getElementById(sectionId).classList.add('active');
    }
    
    // Update nav button
    event?.target?.classList.add('active');
    
    // Load data if needed
    if (sectionName === 'view') {
        loadMedicines();
    } else if (sectionName === 'expiring') {
        loadExpiringMedicines();
    }
}

// Load Suppliers
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        if (response.ok) {
            suppliers = await response.json();
            populateSupplierSelects();
        } else {
            console.error('Failed to load suppliers');
        }
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

function populateSupplierSelects() {
    const addSelect = document.getElementById('add-supplier');
    const updateSelect = document.getElementById('update-supplier');
    
    [addSelect, updateSelect].forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Select Supplier</option>';
            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.supplier_id;
                option.textContent = `${supplier.supplier_name} (${supplier.contact_no})`;
                select.appendChild(option);
            });
        }
    });
}

// Load Medicines
async function loadMedicines() {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`);
        const tbody = document.getElementById('medicines-tbody');
        
        if (response.ok) {
            const medicines = await response.json();
            displayMedicines(medicines, tbody);
        } else {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">Error loading medicines</td></tr>';
        }
    } catch (error) {
        console.error('Error loading medicines:', error);
        document.getElementById('medicines-tbody').innerHTML = 
            '<tr><td colspan="9" class="no-data">Error connecting to server</td></tr>';
    }
}

function displayMedicines(medicines, tbody) {
    if (medicines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No medicines found</td></tr>';
        return;
    }
    
    tbody.innerHTML = medicines.map(medicine => {
        const expDate = new Date(medicine.exp_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        
        let expiryClass = 'expiry-ok';
        if (daysUntilExpiry < 0) {
            expiryClass = 'expiry-warning';
        } else if (daysUntilExpiry <= 30) {
            expiryClass = 'expiry-soon';
        }
        
        return `
            <tr>
                <td>${medicine.medicine_id}</td>
                <td>${escapeHtml(medicine.name)}</td>
                <td>${escapeHtml(medicine.company)}</td>
                <td>${formatDate(medicine.mfg_date)}</td>
                <td class="${expiryClass}">${formatDate(medicine.exp_date)}</td>
                <td>${medicine.quantity}</td>
                <td>₹${parseFloat(medicine.price).toFixed(2)}</td>
                <td>${escapeHtml(medicine.supplier_name)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editMedicine(${medicine.medicine_id})">Edit</button>
                        <button class="btn btn-danger" onclick="openDeleteModal(${medicine.medicine_id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function refreshMedicines() {
    loadMedicines();
}

// Add Medicine
async function handleAddMedicine(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const medicineData = {
        name: formData.get('name'),
        company: formData.get('company'),
        mfg_date: formData.get('mfg_date'),
        exp_date: formData.get('exp_date'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        supplier_id: parseInt(formData.get('supplier_id'))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        });
        
        const result = await response.json();
        const messageDiv = document.getElementById('add-message');
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message || 'Medicine added successfully!';
            e.target.reset();
            setTimeout(() => {
                messageDiv.className = 'message';
                showSection('view');
                loadMedicines();
            }, 2000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to add medicine';
        }
    } catch (error) {
        const messageDiv = document.getElementById('add-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error connecting to server';
    }
}

// Edit Medicine
async function editMedicine(medicineId) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`);
        if (response.ok) {
            const medicine = await response.json();
            populateUpdateForm(medicine);
            showSection('update');
            
            // Update nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        } else {
            alert('Failed to load medicine details');
        }
    } catch (error) {
        console.error('Error loading medicine:', error);
        alert('Error connecting to server');
    }
}

function populateUpdateForm(medicine) {
    document.getElementById('update-id').value = medicine.medicine_id;
    document.getElementById('update-name').value = medicine.name;
    document.getElementById('update-company').value = medicine.company;
    document.getElementById('update-mfg-date').value = medicine.mfg_date;
    document.getElementById('update-exp-date').value = medicine.exp_date;
    document.getElementById('update-quantity').value = medicine.quantity;
    document.getElementById('update-price').value = medicine.price;
    document.getElementById('update-supplier').value = medicine.supplier_id;
}

// Update Medicine
async function handleUpdateMedicine(e) {
    e.preventDefault();
    const medicineId = document.getElementById('update-id').value;
    const formData = new FormData(e.target);
    const medicineData = {
        name: formData.get('name'),
        company: formData.get('company'),
        mfg_date: formData.get('mfg_date'),
        exp_date: formData.get('exp_date'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        supplier_id: parseInt(formData.get('supplier_id'))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        });
        
        const result = await response.json();
        const messageDiv = document.getElementById('update-message');
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message || 'Medicine updated successfully!';
            setTimeout(() => {
                messageDiv.className = 'message';
                showSection('view');
                loadMedicines();
            }, 2000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to update medicine';
        }
    } catch (error) {
        const messageDiv = document.getElementById('update-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error connecting to server';
    }
}

// Search Medicines
async function searchMedicines() {
    const searchTerm = document.getElementById('search-input').value.trim();
    const tbody = document.getElementById('search-results-tbody');
    
    if (!searchTerm) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">Please enter a search term</td></tr>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const medicines = await response.json();
            displayMedicines(medicines, tbody);
        } else {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">Error searching medicines</td></tr>';
        }
    } catch (error) {
        console.error('Error searching medicines:', error);
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">Error connecting to server</td></tr>';
    }
}

// Load Expiring Medicines
async function loadExpiringMedicines() {
    const days = document.getElementById('expiry-days')?.value || 30;
    const tbody = document.getElementById('expiring-tbody');
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/expiring?days=${days}`);
        if (response.ok) {
            const medicines = await response.json();
            if (medicines.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="no-data">No medicines expiring within ' + days + ' days</td></tr>';
                return;
            }
            
            tbody.innerHTML = medicines.map(medicine => {
                const daysUntilExpiry = medicine.days_until_expiry;
                let expiryClass = 'expiry-ok';
                if (daysUntilExpiry < 0) {
                    expiryClass = 'expiry-warning';
                } else if (daysUntilExpiry <= 30) {
                    expiryClass = 'expiry-soon';
                }
                
                return `
                    <tr>
                        <td>${medicine.medicine_id}</td>
                        <td>${escapeHtml(medicine.name)}</td>
                        <td>${escapeHtml(medicine.company)}</td>
                        <td class="${expiryClass}">${formatDate(medicine.exp_date)}</td>
                        <td class="${expiryClass}">${daysUntilExpiry} days</td>
                        <td>${medicine.quantity}</td>
                        <td>${escapeHtml(medicine.supplier_name)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-warning" onclick="editMedicine(${medicine.medicine_id})">Edit</button>
                                <button class="btn btn-danger" onclick="openDeleteModal(${medicine.medicine_id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">Error loading expiring medicines</td></tr>';
        }
    } catch (error) {
        console.error('Error loading expiring medicines:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">Error connecting to server</td></tr>';
    }
}

// Delete Medicine
function openDeleteModal(medicineId) {
    deleteMedicineId = medicineId;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    deleteMedicineId = null;
    document.getElementById('delete-modal').classList.remove('active');
}

async function confirmDelete() {
    if (!deleteMedicineId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${deleteMedicineId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message || 'Medicine deleted successfully!');
            closeDeleteModal();
            loadMedicines();
            
            // Reload search results if in search section
            if (document.getElementById('search-section').classList.contains('active')) {
                searchMedicines();
            }
            
            // Reload expiring if in expiring section
            if (document.getElementById('expiring-section').classList.contains('active')) {
                loadExpiringMedicines();
            }
        } else {
            alert(result.error || 'Failed to delete medicine');
        }
    } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Error connecting to server');
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('delete-modal');
    if (event.target === modal) {
        closeDeleteModal();
    }
}

