// Authentication Page Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth page
    initAuthPage();
});

/**
 * Initialize auth page
 */
function initAuthPage() {
    // Add any page initialization here
}

/**
 * Toggle password visibility
 */
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleBtn = event.target.closest('.toggle-password');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
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

/**
 * Show password strength indicator
 */
function showPasswordStrength(password) {
    const strength = validatePasswordStrength(password);
    
    // Create strength meter if it doesn't exist
    let strengthMeter = document.querySelector('.password-strength-meter');
    if (!strengthMeter) {
        const passwordInput = document.getElementById('password');
        strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength-meter';
        passwordInput.parentElement.appendChild(strengthMeter);
    }

    // Update strength meter
    const strengthPercentage = (strength.strength / 5) * 100;
    strengthMeter.style.width = strengthPercentage + '%';
    
    // Add color based on strength
    if (strength.isValid && strength.hasSpecialChar) {
        strengthMeter.style.backgroundColor = '#4caf50'; // Strong
    } else if (strength.strength >= 3) {
        strengthMeter.style.backgroundColor = '#ff9800'; // Medium
    } else {
        strengthMeter.style.backgroundColor = '#f44336'; // Weak
    }
}

/**
 * Handle login form submission
 */
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate email
    if (!validateEmail(email)) {
        notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        return;
    }

    // Validate password
    if (password.length < 6) {
        notifications.error('Password must be at least 6 characters', 'error', 'Invalid Password');
        return;
    }

    // TODO: Implement actual login API call
    notifications.success('Logging you in...', 'success', 'Please Wait');
}

/**
 * Handle signup form submission
 */
function handleSignupSubmit(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate full name
    if (fullName.trim().length < 3) {
        notifications.error('Please enter a valid name', 'error', 'Invalid Name');
        return;
    }

    // Validate email
    if (!validateEmail(email)) {
        notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        return;
    }

    // Validate phone
    if (phone.trim().length < 10) {
        notifications.error('Please enter a valid phone number', 'error', 'Invalid Phone');
        return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        notifications.error('Passwords do not match!', 'error', 'Validation Error');
        return;
    }

    // Validate password strength
    const strength = validatePasswordStrength(password);
    if (!strength.isValid) {
        notifications.error(
            'Password must contain uppercase, lowercase, numbers, and be at least 8 characters',
            'error',
            'Weak Password'
        );
        return;
    }

    // Validate terms agreement
    if (!agreeTerms) {
        notifications.error('Please agree to the Terms and Conditions', 'error', 'Accept Terms');
        return;
    }

    // TODO: Implement actual signup API call
    notifications.success('Account created successfully!', 'success', 'Welcome to Farm2Home');
}

// Export functions
window.authFunctions = {
    togglePassword,
    validateEmail,
    validatePasswordStrength,
    showPasswordStrength,
    handleLoginSubmit,
    handleSignupSubmit
};
