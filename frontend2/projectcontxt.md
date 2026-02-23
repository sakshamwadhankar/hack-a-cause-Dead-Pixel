# JalRakshak – Complete Project Description 💧

---

## What Is JalRakshak?

JalRakshak is an **AI-powered Drought Warning and Smart Water Tanker Management System** built for India. The name means "Water Protector" in Hindi. It solves one of India's most recurring crises – every summer, thousands of villages in Maharashtra and across India face severe water shortage, and the government's response is always **reactive, manual, and corrupt.**

JalRakshak shifts this from **crisis management to prevention.**

---

## The Problem It Solves

Right now in every drought-affected district of India, this is the reality:

- Village Sarpanch calls Taluka office on phone begging for water
- Taluka officer writes complaint on paper
- District Collector gets 200+ calls daily in summer
- Tanker goes to villages with political connections, not actual need
- No data, no accountability, no early warning
- Crores of government money wasted on inefficient tanker routes

**JalRakshak replaces this entire broken system with one intelligent platform.**

---

## Who Uses It

**3 types of users, each with their own interface:**

**1. District Collector / Government Official**
The main decision maker who sits in the office and monitors the entire district from a single dashboard. They see which villages are in crisis, approve tanker dispatch with one click, and have full accountability records.

**2. Tanker Driver**
The person on the ground delivering water. Gets a simple mobile-friendly interface showing The Impact's delivery stops, optimized route, and a button to mark each delivery complete.

**3. Village Sarpanch / Resident**
The water receiver. Gets the simplest interface – can check when their tanker is coming, raise an emergency water request, and receive SMS-style notifications.

---

## How It Works – Step by Step

```
Step 1: Real Data Fetched
Open-Meteo API fetches live rainfall data
for every village's exact coordinates.
Soil moisture data used as groundwater proxy.

Step 2: WSI Algorithm Runs
Water Stress Index calculated for each village:
- Rainfall Deficit (40% weight)
- Groundwater Drop (40% weight)  
- Days Without Water (20% weight)
Result: Score 0-100 per village

Step 3: Map Updates
Villages appear color-coded on live map:
🔴 Critical (WSI 70+)
🟠 High (WSI 50-70)
🟡 Moderate (WSI 30-50)
🟢 Safe (WSI 0-30)

Step 4: Alerts Generated
System auto-generates alerts for critical
villages without Collector needing to check.

Step 5: One-Click Tanker Dispatch
Collector clicks "Auto-Allocate Tankers"
Smart algorithm matches tanker to village:
- Haversine formula calculates real distance
- Priority = WSI(60%) + Population(20%) 
           + Distance(20%)
Right tanker goes to right village instantly.

Step 6: Driver Gets Route
Driver opens app, sees optimized delivery
stops in priority order with ETA for each.

Step 7: Delivery Confirmed
Driver taps "Delivered" → dashboard updates
instantly → Sarpanch gets SMS notification
→ Collector has accountability record.
```

---

## Technical Architecture

### Backend (Python FastAPI)
The brain of the application. Runs on port 8000.

**Files:**
- `main.py` – FastAPI app, CORS, auto-seeding
- `models.py` – Database models (Village, Tanker, TankerAssignment, Alert)
- `database.py` – SQLite connection via SQLAlchemy
- `wsi_calculator.py` – Water Stress Index algorithm
- `allocation_engine.py` – Smart tanker dispatch with Haversine distance
- `api_fetcher.py` – Live data from Open-Meteo API
- `real_data_fetcher.py` – Real IMD/CGWB/Census data
- `seed_data.py` – Seeds 30 villages on first run
- `routes/villages.py` – All village APIs
- `routes/tankers.py` – All tanker APIs
- `routes/alerts.py` – Alert management APIs

**Database:** SQLite (no setup required)

**20+ API Endpoints including:**
- `GET /villages` – All villages with live WSI
- `GET /villages/stats` – District summary
- `GET /villages/critical` – Crisis villages only
- `POST /tankers/allocate` – Smart auto-dispatch
- `POST /tankers/{id}/deliver` – Confirm delivery
- `GET /tankers/{id}/route` – Optimized driver route
- `POST /alerts/generate` – Auto-create alerts
- `POST /villages/refresh-all` – Fetch live API data
- `GET /districts/all` – All India districts
- `POST /districts/load` – Load any Indian district

### Frontend (React + Vite)
The face of the application. Runs on port 5173.

**4 Complete Pages:**

**Dashboard (Main – Collector view)**
- Live navbar with clock
- 4 stat cards: Total Villages, Critical Count, Active Tankers, Avg WSI
- Interactive Leaflet map centered on selected region
- Color-coded village markers with detailed popups
- Alert panel with resolve functionality
- Quick Actions panel with auto-allocate button
- Live tanker status list
- Auto-refreshes every 30 seconds

**Analytics Page**
- Summary banner: Most stressed village, Most affected district, Population at risk
- Sortable searchable village table (8 columns)
- Bar chart: WSI scores for all villages (Recharts)
- Pie chart: Villages by stress level
- Tanker operations table with full history

**Driver View (Mobile optimized)**
- Tanker selector dropdown
- Delivery summary with progress bar
- Ordered route stops with ETA and distance
- Mark Delivered button with liters input
- Completed deliveries history

**Sarpanch View (Village portal)**
- Village selector dropdown
- Village status card with circular WSI indicator
- Tanker status (assigned or not)
- Emergency water request form
- SMS simulation panel
- Village assignment history table

**Navigation:** 4-tab bottom navigation bar
(Dashboard | Analytics | Driver | Sarpanch)

---

## Real Data Used

This is what separates JalRakshak from other hackathon projects:

**Rainfall Data**
- Source: Open-Meteo API (live, no key needed)
- Fetches last 90 days precipitation for exact village coordinates
- Normal rainfall from 2019 historical baseline
- Updates live when "Refresh Data" button clicked

**Groundwater Data**
- Source: Open-Meteo soil moisture API
- Soil moisture at 28-100cm depth converted to groundwater proxy
- District-level verification from CGWB annual report 2024

**Population Data**
- Source: Census of India 2011 + 2024 projections
- Real population figures for all 30 villages

**Drought Status**
- Days without water based on Maharashtra Water Resources Dept 2024 drought report
- Osmanabad worst affected: 15 days
- Nagpur least affected: 0-5 days

---

## Coverage

**Currently loaded with real data:**
- 15 Marathwada villages across Latur, Osmanabad, Beed, Nanded, Parbhani districts
- 15 Nagpur district villages

**Can instantly load data for:**
- Every state in India
- Every major district
- Any coordinates in the world (Open-Meteo covers globally)

---

## The WSI Algorithm (Core Innovation)

```
Rainfall Deficit Score = 
  (Normal Rainfall - Current Rainfall) 
  / Normal Rainfall × 100

Groundwater Drop Score = 
  (Current Depth - Last Year Depth)
  / Last Year Depth × 100

Days Score = 
  Days Without Water × 6.67 (capped at 100)

Final WSI = 
  (Rainfall Score × 0.40) +
  (Groundwater Score × 0.40) +
  (Days Score × 0.20)
```

**Result:** A single number 0-100 that tells you exactly how bad the water crisis is in any village.

---

## Smart Tanker Allocation Algorithm

```
Priority Score =
  WSI Score × 0.60 +
  Population Factor × 0.20 +
  Distance Factor × 0.20

Distance = Haversine Formula 
           (real earth-curve distance)

ETA = Distance / 40 km/h average tanker speed
```

Most critical village + largest population + nearest tanker = highest priority. **No human bias. No corruption possible.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.8+, FastAPI |
| Database | SQLite + SQLAlchemy |
| Data Processing | Pandas, NumPy |
| Distance Calc | Haversine (custom) |
| Live Data | Open-Meteo API (httpx) |
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Maps | Leaflet.js + React-Leaflet |
| Charts | Recharts |
| Icons | Lucide-React |
| HTTP Client | Axios |
| Version Control | Git + GitHub |

---

## Impact Numbers

- **30 villages** monitored with real data
- **2 regions** fully loaded (Marathwada + Nagpur)
- **All India** districts loadable on demand
- **500,000+ people** covered in current dataset
- **8 tankers** with smart allocation (5 Marathwada + 3 Nagpur)
- **20+ API endpoints** fully working
- **4 user interfaces** for different stakeholders
- **Real-time data** from Open-Meteo API
- **0 hardcoded** rainfall/groundwater values

---

## How To Run

```
Double-click start.bat
→ Backend starts on localhost:8000
→ Frontend starts on localhost:5173
→ Open browser to localhost:5173
```

---

## What Makes It Different From Other Teams

1. **Real live API data** – Not fake numbers, actual Open-Meteo rainfall
2. **All India coverage** – Not just one state
3. **3 separate user interfaces** – Built for real users, not just judges
4. **Smart algorithm** – WSI + Haversine + Priority scoring
5. **Full accountability chain** – Every tanker trip recorded
6. **One-click dispatch** – Actually solves the corruption problem
7. **Works offline-first** – SQLite needs no internet for core functions

---

## Team

**Team Dead Pixel**
Hackathon: Hack A Cause – Jalmanthan
Problem Statement: PS2 – Integrated Drought Warning & Smart Tanker Management System
University: Ramdeobaba University

---

Ye hai tumhara poora project. Koi bhi question judge pooche – rainfall algorithm, data source, user flow, tech stack – sab ka answer yahan hai. **All the best! 🏆**