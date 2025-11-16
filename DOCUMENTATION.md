# 📚 Farm2Home - Complete Documentation

**Last Updated:** November 17, 2025  
**Project:** Fresh Organic Produce E-commerce Platform  
**Tech Stack:** Django 5.2.7, PostgreSQL, Stripe 11.1.0, Gmail SMTP  
**Status:** ✅ Production Ready (Test Mode)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Order Creation System](#order-creation-system)
3. [Email Notifications](#email-notifications)
4. [Stripe Payment Integration](#stripe-payment-integration)
5. [Authentication System](#authentication-system)
6. [Saved Addresses](#saved-addresses)
7. [Database Structure](#database-structure)
8. [API Endpoints](#api-endpoints)
9. [Testing Guide](#testing-guide)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

Farm2Home is an e-commerce platform connecting farmers with consumers for fresh, organic produce delivery. 

### Key Features
- **Product Catalog:** 56 products (vegetables, fruits, herbs) with seasonal filtering
- **Authentication:** Secure login/signup with modal UI
- **Shopping Cart:** Add to cart, modify quantities
- **Order System:** Complete checkout-to-delivery flow
- **Email Notifications:** Automated order confirmations
- **Stripe Payments:** Secure card processing + Cash on Delivery
- **Address Management:** Save multiple delivery addresses

---

## Order Creation System

### Overview
Complete checkout flow with database integration, inventory management, and cart clearing.

### Payment Flow
```
Add to Cart → Checkout → Fill Shipping → Payment → Order Created → Cart Cleared → Confirmation Email → Confirmation Page
```

### API Endpoint
**POST** `/api/checkout/create-order/`

### What Happens When Order is Created
1. **Customer:** Created/updated in database
2. **Order:** New record with PENDING status
3. **OrderItems:** One record per product
4. **Inventory:** Stock reduced by quantities
5. **Cart:** All items deleted for customer
6. **Email:** Confirmation sent automatically

### Supported Payment Methods
- ✅ **Card Payment:** Stripe-processed (shows last 4 digits in order)
- ✅ **Cash on Delivery:** No card details required

---

## Email Notifications

### Overview
Automated order confirmation emails sent immediately after order placement with comprehensive details.

### Email Content Includes
✅ Order number and date  
✅ Itemized products with subtotals (qty × price)  
✅ Payment method (Card ending in XXXX / Cash on Delivery)  
✅ Complete shipping address with phone  
✅ Price breakdown (subtotal + delivery + total)  
✅ Delivery timeline (24-48 hours)  
✅ Professional HTML design with Farm2Home branding  

### Configuration

**Development (Console - Current):**
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```
Emails print to terminal - perfect for testing.

**Production (Gmail SMTP):**
Add to `.env`:
```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
```

Get App Password: https://myaccount.google.com/apppasswords

### Troubleshooting Emails
- **Not in inbox?** Check spam/promotions folder
- **Gmail issues?** Generate new App Password with 2FA enabled
- **Want instant preview?** Use console backend (current setting)

---

## Stripe Payment Integration

### Setup

**1. Install Stripe:**
```bash
pip install stripe==11.1.0
```

**2. Get Test Keys:**
- Sign up: https://dashboard.stripe.com/register
- Go to: Developers → API keys
- Copy both keys (pk_test_... and sk_test_...)

**3. Add to `.env`:**
```
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

**4. Restart server**

### Test Cards
| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient Funds |

Use with any future expiry (12/25) and any CVV (123).

### Features
- ✅ Real-time validation
- ✅ Card brand detection (Visa, Mastercard, etc.)
- ✅ Secure card input (never touches your server)
- ✅ Loading states and error handling
- ✅ PCI-DSS compliant by default

---

## Authentication System

### Implementation
- **Modal-based:** No page redirects, opens on same page
- **Password Security:** PBKDF2-SHA256 hashing
- **Session Management:** customer_id in localStorage
- **Validation:** Email format, password length (min 6 chars)

### API Endpoints
- **POST** `/api/auth/login/` - User login
- **POST** `/api/auth/signup/` - User registration

### User Flow
1. Click Login/Signup button
2. Modal appears with form
3. Submit credentials via AJAX
4. On success: Save to localStorage, reload page
5. On error: Display message in modal

---

## Saved Addresses

### Features
- ✅ Save multiple addresses (HOME, WORK, OTHER)
- ✅ Set default address (auto-selected at checkout)
- ✅ Dropdown at checkout for quick selection
- ✅ Auto-fill checkout form
- ✅ Full CRUD operations

### API Endpoints
- **GET** `/api/addresses/?customer_id=X` - List all
- **POST** `/api/addresses/` - Create new
- **PUT** `/api/addresses/{id}/` - Update
- **DELETE** `/api/addresses/{id}/` - Delete
- **POST** `/api/addresses/{id}/set-default/` - Set as default

### Database Model
```python
class Address:
    customer = ForeignKey(Customer)
    label = CharField(choices=['HOME', 'WORK', 'OTHER'])
    address_line = CharField(max_length=500)
    city = CharField(max_length=100)
    postal_code = CharField(max_length=20)
    phone = CharField(max_length=20)
    is_default = BooleanField(default=False)
```

---

## Database Structure

### Core Models

**Customer:** customer_id, name, email, phone, address, password (hashed)  
**Product:** product_id, name, category, price, season, discount, image, slug  
**Inventory:** inventory_id, product (OneToOne), stock_available  
**Order:** order_id, customer, order_date, status, total_amount, payment  
**OrderItem:** item_id, order, product, quantity, price  
**Cart:** cart_id, customer, product, quantity, added_at  
**Address:** address_id, customer, label, address_line, city, postal_code, phone, is_default  

### Order Status Choices
- PENDING (initial)
- CONFIRMED
- SHIPPED
- DELIVERED
- CANCELLED

---

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration

### Catalog
- `GET /api/catalog/products/` - Get products with filters

### Cart & Checkout
- `GET /api/checkout/cart/?customer_id=X` - Get cart items
- `POST /api/checkout/create-order/` - Create order
- `DELETE /api/cart/clear/?customer_id=X` - Clear cart

### Addresses
- `GET /api/addresses/?customer_id=X` - List addresses
- `POST /api/addresses/` - Create address
- `PUT /api/addresses/{id}/` - Update address
- `DELETE /api/addresses/{id}/` - Delete address
- `POST /api/addresses/{id}/set-default/` - Set default

### Stripe
- `POST /api/stripe/create-payment-intent/` - Create payment
- `POST /api/stripe/confirm-payment/` - Confirm payment

---

## Testing Guide

### Quick Test Flow

**1. Start Server:**
```bash
python manage.py runserver
```

**2. Add Products:**
- Visit http://localhost:8000/catalog/
- Click "Add to Cart" on 2-3 products

**3. Checkout:**
- Click cart icon → "Checkout"
- Fill shipping information

**4. Test Card Payment:**
- Card: 4242 4242 4242 4242
- Expiry: 12/25, CVV: 123
- Click "PURCHASE"

**5. Test Cash on Delivery:**
- Select "Cash on Delivery" tab
- Click "CONFIRM ORDER"

**6. Verify:**
- ✅ Success notification
- ✅ Email in terminal (console backend)
- ✅ Cart empty
- ✅ Order in Django admin
- ✅ Confirmation page displays

### Django Admin Checks
1. Go to http://localhost:8000/admin/
2. **Orders** → Verify order with correct total
3. **OrderItems** → Check items match cart
4. **Inventory** → Verify stock reduced
5. **Carts** → Should be empty

---

## Troubleshooting

### "403 Forbidden" on order creation
**Solution:** Backend has `@csrf_exempt`. Clear browser cache and retry.

### Email not received
**Solutions:**
1. Check spam/promotions folder
2. Verify `.env` has EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
3. Generate new Gmail App Password
4. Use console backend to see email in terminal

### Stripe card field not visible
**Solutions:**
1. Verify `.env` has STRIPE_PUBLIC_KEY starting with pk_test_
2. Check F12 console for errors
3. Hard refresh (Ctrl+Shift+R)
4. Verify internet connection for Stripe.js

### Cart not clearing
**Solutions:**
1. Verify customer_id in localStorage
2. Check Django logs for cart clearing confirmation
3. Manual clear: http://localhost:8000/api/cart/clear/?customer_id=X

### Order not creating
**Solutions:**
1. Check Django terminal for errors
2. Verify customer_id exists in localStorage
3. Check products have sufficient stock
4. Open F12 console for frontend errors

---

## Environment Variables

Required in `.env` file:
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5433/farm2home

# Email (Gmail SMTP)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# Django
SECRET_KEY=your-secret-key
DEBUG=True
```

---

## File Structure

```
Farm2Home/
├── main/
│   ├── models.py              # Database models
│   ├── views.py               # API endpoints & view logic
│   ├── serializers.py         # DRF serializers & validation
│   ├── urls.py                # URL routing
│   └── utils.py               # Email sending functions
├── templates/
│   ├── emails/
│   │   └── order_confirmation.html   # Order email template
│   ├── checkout/              # Checkout flow pages
│   ├── account/               # Account pages
│   └── landing/               # Landing page
├── static/
│   ├── js/
│   │   ├── payment.js         # Stripe & payment logic
│   │   ├── checkout.js        # Checkout flow
│   │   ├── auth.js            # Authentication
│   │   └── catalog.js         # Product catalog
│   └── css/                   # Stylesheets
├── Farm2Home/
│   ├── settings.py            # Django configuration
│   └── urls.py                # Main URL routing
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
└── manage.py                  # Django management
```

---

## Production Deployment Notes

### Before Going Live:
1. **Switch to real Stripe keys** (pk_live_ and sk_live_)
2. **Enable Gmail SMTP** (update settings.py)
3. **Set DEBUG=False**
4. **Configure ALLOWED_HOSTS**
5. **Enable HTTPS** (required for Stripe)
6. **Use PostgreSQL** (not SQLite)
7. **Set up logging** and monitoring
8. **Regular database backups**
9. **Add rate limiting** on login attempts
10. **Implement proper session management**

---

## Common Commands

```bash
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Run server
python manage.py runserver

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Test scripts
python test_auth_apis.py
python test_address_api.py
python test_order_creation.py
```

---

## Support & Maintenance

### Logs to Monitor
- **Django Terminal:** Order creation, email sending, API errors
- **Browser Console (F12):** JavaScript errors, API responses
- **Django Admin:** Order status, inventory levels, customer data

### Performance Monitoring
- Order creation success rate
- Email delivery success rate
- Stripe payment success/failure rates
- Inventory stock levels
- Page load times

---

## Version Information

- **Django:** 5.2.7
- **Python:** 3.x
- **Stripe:** 11.1.0
- **PostgreSQL:** Latest
- **Status:** ✅ Production Ready (Test Mode)
- **Last Updated:** November 17, 2025

---

**End of Documentation**

For support or questions, refer to Django logs, browser console, or check specific implementation files mentioned in this documentation.
