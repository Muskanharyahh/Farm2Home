"""
Quick script to check saved addresses in database
"""
import django
import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer, Address

print(f"\n{'='*60}")
print(f"CHECKING SAVED ADDRESSES")
print(f"{'='*60}\n")

customers = Customer.objects.all()
print(f"Total Customers: {customers.count()}\n")

if customers.count() == 0:
    print("⚠️  No customers found in database!")
    print("Please create a customer first.")
else:
    for customer in customers:
        addresses = Address.objects.filter(customer=customer)
        print(f"Customer: {customer.name} (ID: {customer.customer_id})")
        print(f"Email: {customer.email}")
        print(f"Saved Addresses: {addresses.count()}")
        
        if addresses.count() > 0:
            for addr in addresses:
                print(f"  - {addr.label}: {addr.address_line}, {addr.city} {addr.postal_code}")
                print(f"    Phone: {addr.phone}")
                print(f"    Default: {addr.is_default}")
        else:
            print("  ⚠️  No saved addresses for this customer")
        print("-" * 60)

print("\n💡 TIP: You can add addresses through:")
print("   1. Account page -> Addresses section")
print("   2. Django Admin")
print("   3. After placing an order (address gets saved)\n")
