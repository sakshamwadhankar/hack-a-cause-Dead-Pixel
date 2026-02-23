import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

const API_URL = 'http://localhost:8000'

function VillageMap({ villages, tankers, assignments, onRefresh, showToast }) {
  const getMarkerColor = (stressLevel) => {
    switch (stressLevel) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'moderate': return '#eab308'
      case 'safe': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getMarkerRadius = (stressLevel) => {
    switch (stressLevel) {
      case 'critical': return 14
      case 'high': return 12
      case 'moderate': return 10
      case 'safe': return 8
      default: return 10
    }
  }

  const hasActiveAssignment = (villageId) => {
    return assignments.some(a => a.village?.id === villageId)
  }

  const dispatchTanker = async (villageId) => {
    try {
      const response = await axios.post(`${API_URL}/tankers/allocate`)
      showToast(`${response.data.assignments_created} tanker(s) dispatched successfully!`, 'success')
      onRefresh()
    } catch (error) {
      console.error('Error dispatching tanker:', error)
      showToast('Failed to dispatch tanker', 'error')
    }
  }

  const getWSIColor = (wsi) => {
    if (wsi >= 70) return 'bg-red-500'
    if (wsi >= 50) return 'bg-orange-500'
    if (wsi >= 30) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStressBadgeColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'safe': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={[18.0, 76.5]} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {villages.map(village => (
          <CircleMarker
            key={village.id}
            center={[village.latitude, village.longitude]}
            radius={getMarkerRadius(village.stress_level)}
            pathOptions={{
              color: getMarkerColor(village.stress_level),
              fillColor: getMarkerColor(village.stress_level),
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup maxWidth={320} className="custom-popup">
              <div className="p-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{village.name}</h3>
                    <p className="text-sm text-gray-600">{village.district} District</p>
                  </div>
                  {hasActiveAssignment(village.id) && (
                    <span className="text-2xl">🚛</span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">WSI Score</span>
                    <span className="text-sm font-bold">{village.water_stress_index.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getWSIColor(village.water_stress_index)}`}
                      style={{ width: `${Math.min(village.water_stress_index, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStressBadgeColor(village.stress_level)}`}>
                    {village.stress_level.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Population</p>
                    <p className="font-semibold">{village.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Days w/o Water</p>
                    <p className="font-semibold text-red-600">{village.days_without_water}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rainfall</p>
                    <p className="font-semibold">{village.rainfall_current}/{village.rainfall_normal}mm</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Groundwater</p>
                    <p className="font-semibold">{village.groundwater_current.toFixed(1)}m</p>
                  </div>
                </div>

                <button
                  onClick={() => dispatchTanker(village.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center"
                >
                  <span className="mr-2">🚛</span>
                  Dispatch Tanker
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border-2 border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Stress Level</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Safe</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VillageMap
