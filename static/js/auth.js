/**
 * Auth Page Functions
 * Handles login, signup, and password validation
 */

function initAuthPage() {
    // Initialize auth page elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
}

function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    const button = event.target.closest('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePasswordStrength(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8;
    
    return {
        isValid: hasUpperCase && hasLowerCase && hasNumbers && isLengthValid,
        strength: [hasUpperCase, hasLowerCase, hasNumbers, isLengthValid, hasSpecialChar].filter(Boolean).length,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        isLengthValid
    };
}

function showPasswordStrength(password) {
    const result = validatePasswordStrength(password);
    let meter = document.querySelector('.password-strength-meter');
    
    if (!meter) {
        meter = document.createElement('div');
        meter.className = 'password-strength-meter';
        document.getElementById('password').parentElement.appendChild(meter);
    }
    
    const percentage = (result.strength / 5) * 100;
    meter.style.width = percentage + '%';
    
    if (result.isValid && result.hasSpecialChar) {
        meter.style.backgroundColor = '#4caf50'; // Green
    } else if (result.strength >= 3) {
        meter.style.backgroundColor = '#ff9800'; // Orange
    } else {
        meter.style.backgroundColor = '#f44336'; // Red
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault(); // Always prevent default - we'll handle with API
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate email
    if (!validateEmail(email)) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        } else {
            alert('Please enter a valid email address');
        }
        return false;
    }
    
    // Validate password
    if (password.length < 6) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Password must be at least 6 characters', 'error', 'Invalid Password');
        } else {
            alert('Password must be at least 6 characters');
        }
        return false;
    }
    
    // Call login API
    try {
        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        
        // Check if response was successful AND result.success is true
        if (response.ok && result.success) {
            // Store customer data in localStorage
            localStorage.setItem('customer_id', result.customer_id);
            localStorage.setItem('customer_name', result.name);
            localStorage.setItem('customer_email', result.email);
            
            // Show success message
            if (typeof notifications !== 'undefined') {
                notifications.success('Login successful! Redirecting...', 'success', 'Welcome');
            }
            
            // Redirect to account page
            setTimeout(() => {
                window.location.href = '/account/';
            }, 1000);
        } else {
            // Show error message (invalid credentials, account not found, etc.)
            if (typeof notifications !== 'undefined') {
                notifications.error(result.error || 'Login failed', 'error', 'Login Error');
            } else {
                alert(result.error || 'Login failed');
            }
            
            // Do NOT redirect or store data on error
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('Login failed. Please try again.', 'error', 'Connection Error');
        } else {
            alert('Login failed. Please try again.');
        }
        return false;
    }
    
    return false;
}

async function handleSignupSubmit(e) {
    e.preventDefault(); // Always prevent default - we'll handle with API
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate full name
    if (fullName.trim().length < 3) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid name', 'error', 'Invalid Name');
        } else {
            alert('Please enter a valid name');
        }
        return false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        } else {
            alert('Please enter a valid email address');
        }
        return false;
    }
    
    // Validate phone
    if (phone.trim().length < 10) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid phone number', 'error', 'Invalid Phone');
        } else {
            alert('Please enter a valid phone number');
        }
        return false;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Passwords do not match!', 'error', 'Validation Error');
        } else {
            alert('Passwords do not match!');
        }
        return false;
    }
    
    // Validate password strength (relaxed for signup to match backend minimum of 6)
    if (password.length < 6) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Password must be at least 6 characters long', 'error', 'Weak Password');
        } else {
            alert('Password must be at least 6 characters long');
        }
        return false;
    }
    
    // Check if terms are agreed
    if (!agreeTerms) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please agree to the Terms and Conditions', 'error', 'Accept Terms');
        } else {
            alert('Please agree to the Terms and Conditions');
        }
        return false;
    }
    
    // Call signup API
    try {
        const response = await fetch('/api/auth/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: fullName,
                email: email,
                phone: phone,
                password: password
            })
        });
        
        const result = await response.json();
        
        // Check if response was successful AND result.success is true
        if (response.ok && result.success) {
            // Store customer data in localStorage
            localStorage.setItem('customer_id', result.customer_id);
            localStorage.setItem('customer_name', result.name);
            localStorage.setItem('customer_email', result.email);
            
            // Show success message
            if (typeof notifications !== 'undefined') {
                notifications.success('Account created successfully! Redirecting...', 'success', 'Welcome');
            }
            
            // Redirect to account page
            setTimeout(() => {
                window.location.href = '/account/';
            }, 1000);
        } else {
            // Show error message (email already exists, phone exists, etc.)
            if (typeof notifications !== 'undefined') {
                notifications.error(result.error || 'Signup failed', 'error', 'Signup Error');
            } else {
                alert(result.error || 'Signup failed');
            }
            
            // Do NOT redirect or store data on error
            return false;
        }
    } catch (error) {
        console.error('Signup error:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('Signup failed. Please try again.', 'error', 'Connection Error');
        } else {
            alert('Signup failed. Please try again.');
        }
        return false;
    }
    
    return false;
}

/**
 * Handle Forgot Password Form Submission
 * Sends password reset email to the user
 */
async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');
    
    // Validate email
    if (!validateEmail(email)) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        } else {
            showAlert('Please enter a valid email address', 'error');
        }
        return false;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    if (buttonText) buttonText.style.display = 'none';
    if (buttonSpinner) buttonSpinner.style.display = 'inline';
    
    try {
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Send request to API
        const response = await fetch('/api/auth/request-password-reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success message
            if (typeof notifications !== 'undefined') {
                notifications.success(data.message, 'success', 'Email Sent');
            } else {
                showAlert(data.message, 'success');
            }
            // Clear form
            document.getElementById('forgotPasswordForm').reset();
        } else {
            // Show error message
            if (typeof notifications !== 'undefined') {
                notifications.error(data.error || 'Failed to send reset link. Please try again.', 'error', 'Error');
            } else {
                showAlert(data.error || 'Failed to send reset link. Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('An error occurred. Please try again later.', 'error', 'Connection Error');
        } else {
            showAlert('An error occurred. Please try again later.', 'error');
        }
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        if (buttonText) buttonText.style.display = 'inline';
        if (buttonSpinner) buttonSpinner.style.display = 'none';
    }
    
    return false;
}

/**
 * Handle Reset Password Form Submission
 * Resets password using the token from URL
 */
async function handleResetPasswordSubmit(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = document.getElementById('resetToken').value;
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');
    
    // Validate passwords
    if (newPassword.length < 6) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Password must be at least 6 characters long', 'error', 'Invalid Password');
        } else {
            showAlert('Password must be at least 6 characters long', 'error');
        }
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Passwords do not match', 'error', 'Validation Error');
        } else {
            showAlert('Passwords do not match', 'error');
        }
        return false;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    if (buttonText) buttonText.style.display = 'none';
    if (buttonSpinner) buttonSpinner.style.display = 'inline';
    
    try {
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Send request to API
        const response = await fetch('/api/auth/reset-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                token: token,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success message
            if (typeof notifications !== 'undefined') {
                notifications.success(data.message, 'success', 'Success');
            } else {
                showAlert(data.message, 'success');
            }
            // Clear form
            document.getElementById('resetPasswordForm').reset();
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login/';
            }, 2000);
        } else {
            // Show error message
            if (typeof notifications !== 'undefined') {
                notifications.error(data.error || 'Failed to reset password. Please try again.', 'error', 'Error');
            } else {
                showAlert(data.error || 'Failed to reset password. Please try again.', 'error');
            }
            // Re-enable submit button
            submitButton.disabled = false;
            if (buttonText) buttonText.style.display = 'inline';
            if (buttonSpinner) buttonSpinner.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('An error occurred. Please try again later.', 'error', 'Connection Error');
        } else {
            showAlert('An error occurred. Please try again later.', 'error');
        }
        // Re-enable submit button
        submitButton.disabled = false;
        if (buttonText) buttonText.style.display = 'inline';
        if (buttonSpinner) buttonSpinner.style.display = 'none';
    }
    
    return false;
}

/**
 * Initialize Reset Password Page
 * Validates token and sets up form
 */
function initResetPasswordPage() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    
    if (resetPasswordForm) {
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Invalid reset link. Please request a new password reset.', 'error', 'Invalid Link');
            } else {
                showAlert('Invalid reset link. Please request a new password reset.', 'error');
            }
            document.getElementById('submitButton').disabled = true;
            return;
        }
        
        // Set token in hidden field
        document.getElementById('resetToken').value = token;
        
        // Add form submit handler
        resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);
    }
}

/**
 * Initialize Forgot Password Page
 */
function initForgotPasswordPage() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
    }
}

/**
 * Helper function to show alerts (fallback when notifications not available)
 */
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Auto-remove alert after 5 seconds for errors
    if (type === 'error') {
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAuthPage();
    initForgotPasswordPage();
    initResetPasswordPage();
});

// Export functions for global access
window.authFunctions = {
    togglePasswordVisibility,
    validateEmail,
    validatePasswordStrength,
    showPasswordStrength,
    handleLoginSubmit,
    handleSignupSubmit,
    handleForgotPasswordSubmit,
    handleResetPasswordSubmit,
    initResetPasswordPage,
    initForgotPasswordPage
};
