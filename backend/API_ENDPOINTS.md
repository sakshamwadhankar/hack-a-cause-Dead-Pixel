# JalRakshak API Endpoints

## Villages API

### GET /villages/
Get all villages with calculated WSI
- Returns: List of all 15 villages with water stress index

### GET /villages/{id}
Get single village details
- Returns: Village with current WSI and stress level

### GET /villages/critical
Get only critical and high-risk villages
- Returns: Filtered list sorted by WSI descending

### GET /villages/stats
Get comprehensive village statistics
- Returns: total_villages, critical_count, high_count, moderate_count, safe_count, avg_wsi, most_stressed_village

### PUT /villages/{id}/update-water
Update days without water for a village
- Body: `{"days_without_water": int}`
- Returns: Updated WSI and stress level

## Tankers API

### GET /tankers/
Get all tankers with current status
- Returns: List of all tankers

### GET /tankers/{id}
Get single tanker details with assignments
- Returns: Tanker details

### POST /tankers/allocate
Trigger smart auto-allocation
- Returns: assignments_created, villages_covered, tankers_dispatched

### POST /tankers/{id}/deliver
Mark delivery complete
- Body: `{"village_id": int, "liters_delivered": int, "notes": string}`
- Updates: Assignment status, village last_tanker_date, resets days_without_water

### GET /tankers/{id}/route
Get optimized delivery route for driver
- Returns: Ordered list of villages with distance, ETA, priority

### GET /tankers/assignments/all
Get all assignments with village and tanker details

### GET /tankers/assignments/active
Get only pending and in-transit assignments

## Alerts API

### GET /alerts/
Get all active alerts sorted by severity
- Returns: Active alerts ordered by severity and creation time

### POST /alerts/generate
Auto-generate alerts for critical villages
- Returns: alerts_created count and list of new alerts

### PUT /alerts/{id}/resolve
Mark alert as resolved
- Returns: Success message

## Stats API

### GET /stats
Get system-wide statistics
- Returns: total_villages, high_risk_villages, total_tankers, available_tankers, pending_requests
