# 🚀 START HERE - Run Your Project

## Current Status
✅ Flask server is running on http://localhost:5000  
❌ Database needs MySQL password to connect

## Quick Fix - Choose ONE Option:

### Option 1: Run Setup with Password (FASTEST) ⭐

```powershell
cd "C:\Users\Asus\OneDrive\Desktop\DBMS mini project"
python setup_database.py YOUR_MYSQL_PASSWORD
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### Option 2: Create .env File

1. Create file: `backend/.env`
2. Add this content:
```
DB_HOST=localhost
DB_NAME=medvault_db
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD_HERE
FLASK_DEBUG=True
FLASK_PORT=5000
FLASK_HOST=0.0.0.0
```
3. Replace `YOUR_PASSWORD_HERE` with your MySQL password
4. Run: `python setup_database.py`

### Option 3: Use MySQL Workbench (EASIEST) ⭐⭐⭐

1. Open **MySQL Workbench**
2. Connect to MySQL server
3. Click **File** → **Open SQL Script**
4. Navigate to: `database/schema.sql`
5. Click **Execute** button (⚡ lightning bolt)
6. **Done!** Refresh your browser

## After Database Setup

1. **Refresh your browser** (where frontend is open)
2. You should see medicines loaded automatically
3. Test all features:
   - ✅ Add medicine
   - ✅ View medicines
   - ✅ Search medicines
   - ✅ Update medicine
   - ✅ Delete medicine

## Verify It's Working

Test API endpoint:
- Open: http://localhost:5000/api/medicines
- Should show JSON array of medicines (not error)

## Need Help?

- Flask server is already running ✅
- Just need database setup
- Use MySQL Workbench for easiest setup

---

**Quick Command:**
```powershell
python setup_database.py YOUR_MYSQL_PASSWORD
```

