# JalRakshak

Drought Warning & Smart Tanker Management System - A full-stack web application for monitoring drought conditions and managing water tanker distribution to villages.

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Python 3.8+

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Leaflet (Maps)
- Recharts
- Axios
- Lucide React (Icons)

## Features

- Real-time drought monitoring dashboard
- Interactive village map with risk indicators
- Water tanker tracking and management
- Sarpanch interface for requesting tankers
- Driver interface for delivery management
- Alert system for critical water shortages

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Seed the database:
```bash
python seed_data.py
```

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Usage

1. Start the backend server first
2. Start the frontend development server
3. Access the application at http://localhost:5173
4. Navigate between:
   - Dashboard: Overview of all villages and tankers
   - Sarpanch: Request tankers and manage village needs
   - Driver: View assignments and complete deliveries

## API Endpoints

- `GET /villages/` - Get all villages
- `GET /tankers/` - Get all tankers
- `GET /alerts/` - Get active alerts
- `POST /tankers/requests` - Create tanker request
- `POST /tankers/assign` - Assign tanker to request
- `PUT /tankers/{id}/complete` - Mark delivery complete
- `GET /stats` - Get system statistics

## License

MIT
