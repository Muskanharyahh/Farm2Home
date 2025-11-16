"""
Add a test saved address for the current logged-in user
"""
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer, Address

print("\n" + "="*60)
print("ADD SAVED ADDRESS FOR TESTING")
print("="*60 + "\n")

# Get the customer (change the email to match your logged-in account)
try:
    # Try to get the most recent customer (probably you)
    customer = Customer.objects.latest('customer_id')
    print(f"📧 Found customer: {customer.name} ({customer.email})")
    print(f"🆔 Customer ID: {customer.customer_id}\n")
    
    # Check if customer already has addresses
    existing = Address.objects.filter(customer=customer).count()
    print(f"📍 Existing addresses: {existing}\n")
    
    if existing > 0:
        print("⚠️  Customer already has saved addresses:")
        for addr in Address.objects.filter(customer=customer):
            print(f"   - {addr.label}: {addr.address_line}, {addr.city}")
        print("\nWould you like to add another? (This script will add a new one)")
    
    # Add a new test address
    Address.objects.create(
        customer=customer,
        label='HOME',
        address_line='123 Farm Road',
        city='Springfield',
        postal_code='12345',
        phone='(555) 123-4567',
        is_default=True
    )
    
    print("\n✅ SUCCESS! Added saved address:")
    print("   Label: HOME (Default)")
    print("   Address: 123 Farm Road")
    print("   City: Springfield")
    print("   ZIP: 12345")
    print("   Phone: (555) 123-4567")
    
    print("\n" + "="*60)
    print("NOW GO TO CHECKOUT PAGE AND YOU'LL SEE THE DROPDOWN!")
    print("="*60 + "\n")
    
except Customer.DoesNotExist:
    print("❌ No customers found. Please create an account first.")
except Exception as e:
    print(f"❌ Error: {str(e)}")
