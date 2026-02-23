import { useState, useEffect } from 'react'
import axios from 'axios'
import { AlertTriangle, Droplets, Send } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function SarpanchView() {
  const [villages, setVillages] = useState([])
  const [tankers, setTankers] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedVillage, setSelectedVillage] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [villagesRes, tankersRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/villages/`),
        axios.get(`${API_URL}/tankers/`),
        axios.get(`${API_URL}/tankers/requests`)
      ])
      
      setVillages(villagesRes.data)
      setTankers(tankersRes.data)
      setRequests(requestsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const requestTanker = async (villageId, priority) => {
    try {
      await axios.post(`${API_URL}/tankers/requests`, {
        village_id: villageId,
        priority: priority
      })
      alert('Tanker request submitted successfully!')
      fetchData()
    } catch (error) {
      console.error('Error requesting tanker:', error)
      alert('Failed to submit request')
    }
  }

  const assignTanker = async (tankerId, requestId) => {
    try {
      await axios.post(`${API_URL}/tankers/assign`, {
        tanker_id: tankerId,
        request_id: requestId
      })
      alert('Tanker assigned successfully!')
      fetchData()
    } catch (error) {
      console.error('Error assigning tanker:', error)
      alert('Failed to assign tanker')
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sarpanch Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Villages Status</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {villages.map(village => (
              <div
                key={village.id}
                className={`border-2 rounded-lg p-4 ${getRiskColor(village.drought_risk)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{village.name}</h4>
                    <p className="text-sm">Population: {village.population}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    village.drought_risk === 'high' ? 'bg-red-200 text-red-800' :
                    village.drought_risk === 'medium' ? 'bg-orange-200 text-orange-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {village.drought_risk.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Water Level</p>
                    <p className="font-semibold">{village.water_level}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Rainfall</p>
                    <p className="font-semibold">{village.last_rainfall} days</p>
                  </div>
                </div>

                <button
                  onClick={() => requestTanker(village.id, village.drought_risk)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm font-semibold"
                >
                  <Send size={16} className="mr-2" />
                  Request Water Tanker
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {requests.filter(r => r.status === 'pending').map(request => {
                const village = villages.find(v => v.id === request.village_id)
                return (
                  <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{village?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Priority: <span className="font-semibold">{request.priority}</span>
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                        PENDING
                      </span>
                    </div>
                    
                    <select
                      onChange={(e) => e.target.value && assignTanker(parseInt(e.target.value), request.id)}
                      className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm"
                      defaultValue=""
                    >
                      <option value="">Assign Tanker...</option>
                      {tankers.filter(t => t.status === 'available').map(tanker => (
                        <option key={tanker.id} value={tanker.id}>
                          {tanker.vehicle_number} - {tanker.driver_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
              {requests.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending requests</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Available Tankers</h3>
            <div className="space-y-2">
              {tankers.map(tanker => (
                <div
                  key={tanker.id}
                  className={`border-2 rounded-lg p-3 ${
                    tanker.status === 'available' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{tanker.vehicle_number}</p>
                      <p className="text-sm text-gray-600">{tanker.driver_name}</p>
                      <p className="text-xs text-gray-500">Capacity: {tanker.capacity}L</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tanker.status === 'available' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {tanker.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SarpanchView
