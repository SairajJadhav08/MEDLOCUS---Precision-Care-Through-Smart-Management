# 🚀 How to Run PharmaRx Project

## Current Status

✅ **Python dependencies installed**  
✅ **MySQL service is running** (MySQL80)  
❌ **Database needs setup** - Requires MySQL password

## Quick Start (Choose ONE method)

### Method 1: Run Setup with Password (RECOMMENDED)

Open PowerShell in the project directory and run:

```powershell
py setup_database.py YOUR_MYSQL_PASSWORD
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### Method 2: Create .env File

1. Create a file named `.env` in the `backend` folder
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
4. Run: `py setup_database.py`

### Method 3: Use MySQL Workbench

1. Open **MySQL Workbench**
2. Connect to your MySQL server
3. Click **File** → **Open SQL Script**
4. Navigate to: `database/schema.sql`
5. Click **Execute** button (⚡ lightning bolt)

## After Database Setup

1. **Start Flask Server**:
   ```powershell
   cd backend
   py app.py
   ```
   Server will run on: http://localhost:5000

2. **Open Frontend**:
   - Open `frontend/index.html` in your browser
   - Or use Python HTTP server:
     ```powershell
     cd frontend
     py -m http.server 8000
     ```
     Then open: http://localhost:8000

## Verify It's Working

- Test API: http://localhost:5000/api/health
- Test Medicines: http://localhost:5000/api/medicines
- Frontend should load medicines automatically

## Troubleshooting

- **Database connection error**: Check MySQL password in `.env` or config
- **Port already in use**: Change port in `backend/config.py`
- **CORS errors**: Make sure Flask server is running on port 5000

