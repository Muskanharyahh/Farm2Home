# 🌾 Farm2Home - Fresh Organic Produce Delivery

[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![Stripe](https://img.shields.io/badge/Stripe-11.1.0-blueviolet.svg)](https://stripe.com/)

E-commerce platform connecting farmers with consumers for fresh, organic produce delivery.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.x
- PostgreSQL
- Virtual environment

### Installation

1. **Clone the repository**
```bash
cd Farm2Home
```

2. **Create and activate virtual environment**
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

Create `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/farm2home
SECRET_KEY=your-secret-key
DEBUG=True

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser** (optional)
```bash
python manage.py createsuperuser
```

7. **Run the server**
```bash
python manage.py runserver
```

8. **Access the application**
- **Frontend:** http://localhost:8000/
- **Admin Panel:** http://localhost:8000/admin/

---

## ✨ Features

- 🛒 **Product Catalog** - 56+ products with seasonal filtering
- 🔐 **Authentication** - Secure login/signup system
- 💳 **Payments** - Stripe integration + Cash on Delivery
- 📧 **Email Notifications** - Automated order confirmations
- 📍 **Address Management** - Save multiple delivery addresses
- 📦 **Order Tracking** - Complete order history
- 🎨 **Responsive Design** - Mobile-friendly UI

---

## 🧪 Testing

### Quick Test
```bash
# Add products to cart at http://localhost:8000/catalog/
# Proceed to checkout
# Test card: 4242 4242 4242 4242
# Expiry: 12/25, CVV: 123
```

### Run Test Scripts
```bash
python test_auth_apis.py
python test_address_api.py
python test_order_creation.py
```

---

## 📚 Documentation

Complete documentation available in [`DOCUMENTATION.md`](./DOCUMENTATION.md)

Topics covered:
- Order Creation System
- Email Notifications
- Stripe Payment Integration
- Authentication System
- Saved Addresses
- Database Structure
- API Endpoints
- Testing Guide
- Troubleshooting

---

## 🛠️ Tech Stack

- **Backend:** Django 5.2.7, Django REST Framework
- **Database:** PostgreSQL
- **Payments:** Stripe 11.1.0
- **Email:** Gmail SMTP
- **Frontend:** Vanilla JavaScript, HTML5, CSS3

---

## 📂 Project Structure

```
Farm2Home/
├── main/                  # Main Django app
├── Farm2Home/             # Project settings
├── templates/             # HTML templates
├── static/                # CSS, JS, images
├── .env                   # Environment variables
├── manage.py              # Django management
├── requirements.txt       # Dependencies
├── DOCUMENTATION.md       # Complete documentation
└── README.md             # This file
```

---

## 🔑 Key Files

- **`main/models.py`** - Database models
- **`main/views.py`** - API endpoints
- **`main/serializers.py`** - Data validation
- **`main/utils.py`** - Email functions
- **`static/js/payment.js`** - Stripe integration
- **`templates/emails/order_confirmation.html`** - Email template

---

## 🌐 URLs

- **Landing:** `/landing/`
- **Catalog:** `/catalog/`
- **Checkout:** `/checkout/`
- **Account:** `/account/`
- **Admin:** `/admin/`

---

## 💡 Common Commands

```bash
# Run server
python manage.py runserver

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic
```

---

## 🐛 Troubleshooting

### Issue: Email not received
**Solution:** Check spam folder or use console backend (current default)

### Issue: Stripe not working
**Solution:** Verify `.env` has correct Stripe keys starting with `pk_test_` and `sk_test_`

### Issue: Order not creating
**Solution:** Check Django logs in terminal, verify customer_id in browser localStorage

For more troubleshooting, see [`DOCUMENTATION.md`](./DOCUMENTATION.md)

---

## 📝 License

This project is for educational purposes.

---

## 👥 Authors

Farm2Home Development Team

---

## 🙏 Acknowledgments

- Django Framework
- Stripe Payment Platform
- PostgreSQL Database

---

**Status:** ✅ Production Ready (Test Mode)  
**Last Updated:** November 17, 2025
