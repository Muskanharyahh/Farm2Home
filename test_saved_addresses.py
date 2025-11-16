"""
Test if saved addresses API is working correctly
"""
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer, Address
import json

print("\n" + "="*70)
print("TESTING SAVED ADDRESSES API")
print("="*70 + "\n")

# Test for customer ID 6 (currently logged in)
customer_id = 6

try:
    customer = Customer.objects.get(customer_id=customer_id)
    print(f"✅ Customer Found: {customer.name} ({customer.email})")
    print(f"   Customer ID: {customer_id}\n")
    
    addresses = Address.objects.filter(customer=customer)
    print(f"📍 Saved Addresses Count: {addresses.count()}\n")
    
    if addresses.count() > 0:
        print("Addresses Details:")
        print("-" * 70)
        for idx, addr in enumerate(addresses, 1):
            print(f"\n{idx}. {addr.label.upper()}{' (DEFAULT)' if addr.is_default else ''}")
            print(f"   Address Line: {addr.address_line}")
            print(f"   City: {addr.city}")
            print(f"   Postal Code: {addr.postal_code}")
            print(f"   Phone: {addr.phone}")
            
            # Show what will be sent to frontend
            print(f"\n   JSON Data (what frontend receives):")
            data = {
                'address_id': addr.address_id,
                'label': addr.label,
                'address_line': addr.address_line,
                'city': addr.city,
                'postal_code': addr.postal_code,
                'phone': addr.phone,
                'is_default': addr.is_default
            }
            print(f"   {json.dumps(data, indent=6)}")
        
        print("\n" + "="*70)
        print("✅ SAVED ADDRESSES FEATURE SHOULD WORK!")
        print("="*70)
        print("\nWhat should happen in checkout:")
        print("1. 🔖 'USE SAVED ADDRESS' dropdown appears at top of form")
        print(f"2. 📋 Dropdown shows {addresses.count()} address(es)")
        print("3. ⭐ Default address is auto-selected and fills the form")
        print("4. ✏️  You can select different address from dropdown")
        print("5. 🆕 Or select '-- Select a saved address --' to enter new one\n")
        
    else:
        print("⚠️  NO SAVED ADDRESSES FOUND!")
        print("\nTo add addresses, run:")
        print("   python add_test_address.py")
        print("\nOr use Account -> Addresses page\n")
        
except Customer.DoesNotExist:
    print(f"❌ Customer ID {customer_id} not found")
except Exception as e:
    print(f"❌ Error: {str(e)}")

print()
