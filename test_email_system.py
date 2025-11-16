"""
Test script for Farm2Home Email Notifications
Run this script to test if email sending is working properly

Usage:
    python test_email_system.py
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer, Order
from main.utils import send_welcome_email, send_order_confirmation_email, send_password_reset_email


def test_welcome_email():
    """Test welcome email functionality"""
    print("\n" + "="*60)
    print("Testing Welcome Email")
    print("="*60)
    
    try:
        # Get first customer from database
        customer = Customer.objects.first()
        
        if not customer:
            print("❌ No customers found in database. Please create a customer first.")
            return False
        
        print(f"📧 Sending welcome email to: {customer.name} ({customer.email})")
        
        # Send welcome email
        result = send_welcome_email(customer)
        
        if result:
            print("✅ Welcome email sent successfully!")
            print(f"   Check your terminal/console for the email content")
            return True
        else:
            print("❌ Failed to send welcome email")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_order_confirmation_email():
    """Test order confirmation email functionality"""
    print("\n" + "="*60)
    print("Testing Order Confirmation Email")
    print("="*60)
    
    try:
        # Get first order from database
        order = Order.objects.prefetch_related('order_items__product', 'customer').first()
        
        if not order:
            print("❌ No orders found in database. Please create an order first.")
            return False
        
        print(f"📧 Sending order confirmation for Order #{order.order_id}")
        print(f"   Customer: {order.customer.name} ({order.customer.email})")
        
        # Send order confirmation email
        result = send_order_confirmation_email(order)
        
        if result:
            print("✅ Order confirmation email sent successfully!")
            print(f"   Check your terminal/console for the email content")
            return True
        else:
            print("❌ Failed to send order confirmation email")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_password_reset_email():
    """Test password reset email functionality"""
    print("\n" + "="*60)
    print("Testing Password Reset Email")
    print("="*60)
    
    try:
        # Get first customer from database
        customer = Customer.objects.first()
        
        if not customer:
            print("❌ No customers found in database. Please create a customer first.")
            return False
        
        # Create a fake reset link for testing
        reset_link = f"http://localhost:8000/reset-password/?token=test-token-12345"
        
        print(f"📧 Sending password reset email to: {customer.name} ({customer.email})")
        print(f"   Reset Link: {reset_link}")
        
        # Send password reset email
        result = send_password_reset_email(customer, reset_link)
        
        if result:
            print("✅ Password reset email sent successfully!")
            print(f"   Check your terminal/console for the email content")
            return True
        else:
            print("❌ Failed to send password reset email")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def main():
    """Run all email tests"""
    print("\n" + "🌾 "*20)
    print("  FARM2HOME EMAIL NOTIFICATION TEST SUITE")
    print("🌾 "*20)
    
    print("\nℹ️  Current Email Backend: Console Backend")
    print("   Emails will be printed to this terminal window")
    print("   To use Gmail SMTP, update settings.py as per documentation")
    
    # Run all tests
    results = {
        'Welcome Email': test_welcome_email(),
        'Order Confirmation': test_order_confirmation_email(),
        'Password Reset': test_password_reset_email()
    }
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:.<40} {status}")
    
    passed = sum(results.values())
    total = len(results)
    
    print("\n" + "="*60)
    print(f"Results: {passed}/{total} tests passed")
    print("="*60 + "\n")
    
    if passed == total:
        print("🎉 All email tests passed successfully!")
        print("✅ Email notification system is working correctly")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    print("\n💡 Next Steps:")
    print("   1. Sign up a new user → Check for welcome email")
    print("   2. Place an order → Check for order confirmation email")
    print("   3. Use forgot password → Check for reset email")
    print("\n")


if __name__ == '__main__':
    main()
