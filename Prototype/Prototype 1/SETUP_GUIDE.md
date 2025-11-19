# Quick Setup Guide - Medical Storage Management System

## Prerequisites Check ✅
- ✅ Python dependencies installed
- ⚠️ MySQL database needs to be set up

## Step 1: Database Setup

### Option A: Using MySQL Command Line (if MySQL is installed)
1. Open MySQL command line or MySQL Workbench
2. Run the schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or manually:
   ```sql
   source database/schema.sql;
   ```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script (Run all queries)

### Option C: Manual Setup
1. Open MySQL command line or Workbench
2. Create database:
   ```sql
   CREATE DATABASE medvault_db;
   USE medvault_db;
   ```
3. Copy and paste the contents of `database/schema.sql` and execute

## Step 2: Configure Database Connection

Edit `backend/config.py` or create a `.env` file in the `backend` folder:

**Option 1: Edit config.py directly**
```python
DB_CONFIG = {
    'host': 'localhost',
    'database': 'medvault_db',
    'user': 'root',
    'password': 'your_mysql_password',  # Change this
    'charset': 'utf8mb4',
    'autocommit': False
}
```

**Option 2: Create backend/.env file**
```
DB_HOST=localhost
DB_NAME=medvault_db
DB_USER=root
DB_PASSWORD=your_mysql_password
FLASK_DEBUG=True
FLASK_PORT=5000
FLASK_HOST=0.0.0.0
```

## Step 3: Start Flask Server

From the project root:
```bash
cd backend
python app.py
```

Or from project root:
```bash
python backend/app.py
```

Server will start on: http://localhost:5000

## Step 4: Open Frontend

1. **Option 1: Direct file opening**
   - Open `frontend/index.html` in your browser
   - Note: Some browsers may block CORS requests

2. **Option 2: Using Python HTTP Server** (Recommended)
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Then open: http://localhost:8000

3. **Option 3: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `frontend/index.html` → "Open with Live Server"

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `backend/config.py`
- Ensure `medvault_db` database exists
- Test connection: `mysql -u root -p medvault_db`

### CORS Errors
- Make sure Flask server is running on port 5000
- Check `API_BASE_URL` in `frontend/js/app.js` matches backend URL

### Port Already in Use
- Change port in `backend/config.py` or `.env` file
- Update `API_BASE_URL` in frontend JavaScript accordingly

