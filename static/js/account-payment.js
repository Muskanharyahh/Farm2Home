// Account Payment Methods Management
// This file handles saving/managing payment methods in the account section

// Global variables
let paymentMethods = []; // Store payment methods from API
let editingPaymentId = null; // Track which payment method is being edited

// Get CSRF token from cookie
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get customer ID from localStorage
function getCustomerId() {
    return localStorage.getItem('customer_id');
}

// Get modal and define functions at global scope
const modal = document.getElementById('paymentModal');

function openModal() {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModalFunc() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addPaymentBtnHeader = document.querySelector('.add-payment-btn-header');
    const addNewPaymentCard = document.querySelector('.add-new-payment-card');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const paymentForm = document.getElementById('paymentForm');

    // Load user profile data and payment methods on page load
    loadUserProfile();
    loadPaymentMethods();

    // Open modal when clicking add payment button in header
    if (addPaymentBtnHeader) {
        addPaymentBtnHeader.addEventListener('click', function() {
            editingPaymentId = null; // Clear editing state
            resetPaymentForm();
            document.getElementById('modalTitle').textContent = 'ADD PAYMENT METHOD';
            document.querySelector('.btn-save').textContent = 'ADD PAYMENT METHOD';
            openModal();
        });
    }

    // Open modal when clicking add new payment card
    if (addNewPaymentCard) {
        addNewPaymentCard.addEventListener('click', function() {
            editingPaymentId = null; // Clear editing state
            resetPaymentForm();
            document.getElementById('modalTitle').textContent = 'ADD PAYMENT METHOD';
            document.querySelector('.btn-save').textContent = 'ADD PAYMENT METHOD';
            openModal();
        });
    }

    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeModalFunc();
        });
    }

    // Close modal when clicking cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeModalFunc();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
    }

    // Handle form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const customerId = getCustomerId();
            if (!customerId) {
                notifications.error('Please log in to manage payment methods.');
                return;
            }
            
            // Get form data
            const cardHolderName = document.getElementById('cardHolder').value.trim();
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const paymentType = document.getElementById('paymentType').value.toUpperCase() || 'DEBIT';
            const bankName = document.getElementById('bankName').value || '';

            // Validate required fields
            if (!cardHolderName || !cardNumber || !expiryDate) {
                notifications.error('Please fill in all required fields.');
                return;
            }

            // Validate card holder name (letters and spaces only)
            if (!/^[a-zA-Z\s]+$/.test(cardHolderName)) {
                notifications.error('Card holder name should contain only letters.');
                return;
            }

            // Validate card number (16 digits)
            if (!/^\d{16}$/.test(cardNumber)) {
                notifications.error('Card number must be 16 digits.');
                return;
            }

            // Validate expiry date format
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                notifications.error('Expiry date must be in MM/YY format.');
                return;
            }

            // Validate expiry date (not in the past)
            const [month, year] = expiryDate.split('/').map(num => parseInt(num));
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits (25 for 2025)
            const currentMonth = currentDate.getMonth() + 1; // 1-12

            console.log('Expiry validation:', {
                inputMonth: month,
                inputYear: year,
                currentMonth: currentMonth,
                currentYear: currentYear
            });

            if (month < 1 || month > 12) {
                notifications.error('Invalid month. Must be between 01 and 12.');
                return;
            }

            // Check if card is expired
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                notifications.error('Card has expired. Please enter a valid expiry date.', 'Expired Card');
                return;
            }

            // Validate CVV if provided (3 or 4 digits)
            if (cvv && !/^\d{3,4}$/.test(cvv)) {
                notifications.error('CVV must be 3 or 4 digits.');
                return;
            }

            const formData = {
                customer_id: customerId,
                payment_type: paymentType,
                card_holder_name: cardHolderName,
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                bank_name: bankName
            };

            try {
                // Add payment method via API
                const response = await fetch('/api/payment-methods/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    notifications.success('Payment method added successfully!');
                    
                    // Close modal and reset form
                    closeModalFunc();
                    paymentForm.reset();
                    
                    // Reload payment methods
                    loadPaymentMethods();
                } else {
                    notifications.error(data.message || 'Failed to add payment method.');
                }
            } catch (error) {
                console.error('Error adding payment method:', error);
                notifications.error('Failed to add payment method. Please try again.');
            }
        });
    }

    // Format card number input - numbers only
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = e.target.value.replace(/\D/g, '');
            // Limit to 16 digits
            value = value.slice(0, 16);
            // Format with spaces every 4 digits
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
        
        // Prevent non-numeric input
        cardNumberInput.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        });
    }

    // Format expiry date input - numbers only
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = e.target.value.replace(/\D/g, '');
            // Format as MM/YY
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
        
        // Prevent non-numeric input (except /)
        expiryDateInput.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        });
    }

    // CVV input - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove all non-digits and limit to 4 digits
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
        
        // Prevent non-numeric input
        cvvInput.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        });
    }

    // Card holder name - letters and spaces only
    const cardHolderInput = document.getElementById('cardHolder');
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function(e) {
            // Remove numbers and special characters
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
        
        // Prevent numeric and special character input
        cardHolderInput.addEventListener('keypress', function(e) {
            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        });
    }

    // Close payment modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });

    // Delete confirmation modal handlers
    const deleteModal = document.getElementById('deleteConfirmModal');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeletePayment);
    }

    // Close delete modal when clicking outside
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }

    // Close delete modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteModal();
        }
    });
});

// ==================== PAYMENT METHODS API FUNCTIONS ====================

// Load user profile data
async function loadUserProfile() {
    const customerId = getCustomerId();
    
    if (!customerId) {
        console.error('No customer ID found');
        return;
    }
    
    try {
        // Get customer name and email from localStorage if available
        const customerName = localStorage.getItem('customer_name');
        const customerEmail = localStorage.getItem('customer_email');
        
        if (customerName) {
            document.getElementById('userName').textContent = customerName.toUpperCase();
        }
        
        if (customerEmail) {
            document.getElementById('userEmail').textContent = customerEmail.toUpperCase();
        }
        
        // Load total orders count
        const response = await fetch(`/api/orders/?customer_id=${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            const totalOrders = data.count || data.data?.length || 0;
            document.getElementById('totalOrders').textContent = `${totalOrders} Order${totalOrders !== 1 ? 's' : ''}`;
        } else {
            console.error('Failed to load orders:', data);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Load payment methods from API
async function loadPaymentMethods() {
    const customerId = getCustomerId();
    
    if (!customerId) {
        console.error('No customer ID found');
        notifications.error('Please log in to view payment methods.');
        return;
    }
    
    try {
        const response = await fetch(`/api/payment-methods/?customer_id=${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            paymentMethods = data.data;
            console.log('Payment methods loaded:', paymentMethods);
            renderPaymentMethods();
        } else {
            console.error('Failed to load payment methods:', data);
            // Still render the add new card
            paymentMethods = [];
            renderPaymentMethods();
        }
    } catch (error) {
        console.error('Error loading payment methods:', error);
        // Still render the add new card
        paymentMethods = [];
        renderPaymentMethods();
    }
}

// Render payment methods dynamically
function renderPaymentMethods() {
    const grid = document.querySelector('.payment-grid');
    if (!grid) return;
    
    // Clear existing cards (except the hardcoded ones in HTML, we'll remove them first)
    grid.innerHTML = '';
    
    // Render each payment method from database
    paymentMethods.forEach(method => {
        const card = createPaymentCard(method);
        grid.appendChild(card);
    });
    
    // Always add the "Add New" card at the end
    grid.appendChild(createAddNewCard());
}

// Create payment card element
function createPaymentCard(method) {
    const card = document.createElement('div');
    card.className = `payment-card ${method.is_default ? 'default-payment' : ''}`;
    card.dataset.paymentId = method.payment_id;
    
    const bankLabel = method.bank_name ? 
        `${method.bank_name.toUpperCase()} ${method.payment_type_display.toUpperCase()}` : 
        method.payment_type_display.toUpperCase();
    
    card.innerHTML = `
        <div class="payment-card-header">
            <div class="card-icon-section">
                <div class="card-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                ${method.is_default ? `
                <div class="default-badge-payment">
                    <i class="fas fa-star"></i>
                    DEFAULT
                </div>
                ` : ''}
            </div>
        </div>
        <div class="payment-card-body">
            <div class="card-info-row">
                <span class="card-label">CARD NUMBER</span>
                <span class="card-number">•••• •••• •••• ${method.card_last_4}</span>
            </div>
            <div class="card-info-row">
                <span class="card-label">CARD HOLDER</span>
                <span class="card-holder">${method.card_holder_name.toUpperCase()}</span>
            </div>
            <div class="card-info-row">
                <span class="card-label">EXPIRES</span>
                <span class="card-expiry">${method.expiry_date}</span>
            </div>
            <div class="card-bank">${bankLabel}</div>
        </div>
        <div class="payment-card-footer">
            ${!method.is_default ? `
            <button class="set-default-payment-btn" onclick="setDefaultPayment(${method.payment_id})">
                <i class="far fa-star"></i>
                SET AS DEFAULT
            </button>
            <div class="footer-actions">
            ` : ''}
                <button class="icon-btn-payment delete-btn-payment" onclick="deletePayment(${method.payment_id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            ${!method.is_default ? '</div>' : ''}
        </div>
    `;
    
    return card;
}

// Create "Add New" card
function createAddNewCard() {
    const card = document.createElement('div');
    card.className = 'payment-card add-new-payment-card';
    card.onclick = function() {
        editingPaymentId = null;
        resetPaymentForm();
        document.getElementById('modalTitle').textContent = 'ADD PAYMENT METHOD';
        document.querySelector('.btn-save').textContent = 'ADD PAYMENT METHOD';
        openModal();
    };
    
    card.innerHTML = `
        <div class="add-new-payment-content">
            <div class="add-payment-icon">
                <i class="fas fa-plus"></i>
            </div>
            <h3>ADD PAYMENT METHOD</h3>
            <p>ADD A NEW CARD OR PAYMENT OPTION</p>
        </div>
    `;
    
    return card;
}

// Set payment method as default
async function setDefaultPayment(paymentId) {
    const customerId = getCustomerId();
    
    if (!customerId) {
        notifications.error('Please log in to manage payment methods.');
        return;
    }
    
    try {
        const response = await fetch(`/api/payment-methods/${paymentId}/set-default/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                customer_id: customerId
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            notifications.success('Default payment method updated!');
            loadPaymentMethods(); // Reload to update UI
        } else {
            notifications.error(data.message || 'Failed to set default payment method.');
        }
    } catch (error) {
        console.error('Error setting default payment:', error);
        notifications.error('Failed to update default payment method.');
    }
}

// Delete payment method with confirmation modal
let pendingDeletePaymentId = null;

function deletePayment(paymentId) {
    pendingDeletePaymentId = paymentId;
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.classList.remove('active');
        document.body.style.overflow = '';
        pendingDeletePaymentId = null;
    }
}

async function confirmDeletePayment() {
    if (!pendingDeletePaymentId) return;
    
    const customerId = getCustomerId();
    
    if (!customerId) {
        notifications.error('Please log in to manage payment methods.');
        closeDeleteModal();
        return;
    }
    
    try {
        const response = await fetch(`/api/payment-methods/${pendingDeletePaymentId}/delete/?customer_id=${customerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            notifications.success('Payment method deleted successfully!');
            closeDeleteModal();
            loadPaymentMethods(); // Reload to update UI
        } else {
            notifications.error(data.message || 'Failed to delete payment method.');
            closeDeleteModal();
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        notifications.error('Failed to delete payment method.');
        closeDeleteModal();
    }
}

// Reset payment form
function resetPaymentForm() {
    const form = document.getElementById('paymentForm');
    if (form) {
        form.reset();
    }
}

// Make functions globally accessible
window.setDefaultPayment = setDefaultPayment;
window.deletePayment = deletePayment;
