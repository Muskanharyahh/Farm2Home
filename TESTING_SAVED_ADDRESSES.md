## 🎯 Testing Saved Addresses Feature

### Prerequisites:
1. ✅ You have saved addresses in database (Customer ID 6 "Muskan" has 1 address)
2. ✅ You need to be logged in as that customer

### How to Test:

#### **Option 1: Test with Customer who has saved address (Muskan - ID 6)**

1. **Login as Muskan:**
   - Email: `unknown342189@gmail.com`
   - Go to checkout page
   - You should see "USE SAVED ADDRESS" dropdown at the top
   - The dropdown will show: "Home - abc street, Karachi 12345 ⭐"
   - The ⭐ indicates it's the default address

2. **Auto-fill happens:**
   - Default address automatically fills the form
   - OR you can manually select from dropdown
   - Form fields will populate with:
     - Street Address: abc street
     - City: Karachi
     - ZIP Code: 12345
     - Phone: +923156898441

3. **You can still edit:**
   - After auto-fill, modify any field as needed
   - Or select "-- Select a saved address --" to clear and enter new address

---

#### **Option 2: Add Saved Addresses for Your Account**

If you want to use YOUR current account (muskan4606406@cloud.neduet.edu.pk - ID 22):

**Method A: Through Account Page**
1. Go to Account -> Addresses
2. Click "Add New Address"
3. Fill in address details
4. Save
5. Go back to checkout - dropdown will now appear!

**Method B: Through Django Admin**
1. Go to http://127.0.0.1:8000/admin/
2. Login as superuser
3. Go to Main -> Addresses
4. Click "Add Address"
5. Select Customer: Eman (ID 22)
6. Fill: Label (HOME/WORK/OTHER), Address line, City, Postal code, Phone
7. Check "Is default" if you want it auto-selected
8. Save

**Method C: Quick Python Script**
```python
python manage.py shell

from main.models import Customer, Address

# Get your customer
customer = Customer.objects.get(customer_id=22)  # Your ID

# Create a new address
Address.objects.create(
    customer=customer,
    label='HOME',
    address_line='123 Main Street',
    city='Karachi',
    postal_code='75500',
    phone='+923001234567',
    is_default=True
)

print("✅ Address added!")
exit()
```

---

### What You Should See:

**When logged in WITH saved addresses:**
```
SHIPPING INFORMATION

🔖 USE SAVED ADDRESS
📍 [Dropdown showing: Home - abc street, Karachi 12345 ⭐]
   Or enter a new address below

FULL NAME
👤 [Auto-filled]

EMAIL ADDRESS
✉️ [Auto-filled]

... (rest of form auto-filled)
```

**When logged in WITHOUT saved addresses:**
```
SHIPPING INFORMATION

FULL NAME
👤 [Empty - enter manually]

EMAIL ADDRESS
✉️ [Empty - enter manually]

... (dropdown hidden, enter manually)
```

---

### Current Database Status:
- **Customer with addresses:** Muskan (ID: 6) - 1 address
- **Your account:** Eman (ID: 22) - 0 addresses ⚠️

**To see it work immediately:** Login as Muskan (unknown342189@gmail.com)
**To use with your account:** Add an address using one of the methods above

---

### Features:
✅ Dropdown only shows if customer has saved addresses  
✅ Default address auto-selected on page load  
✅ ⭐ icon marks default address  
✅ Smooth animation when fields are filled  
✅ Success notification when address loaded  
✅ Can clear and enter manually  
✅ Can edit auto-filled values  
