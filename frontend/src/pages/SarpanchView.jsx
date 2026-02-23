import { useState, useEffect } from 'react'
import axios from 'axios'
import { Home, Droplets, Cloud, Users, AlertCircle, Truck, CheckCircle, Phone } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function SarpanchView() {
  const [villages, setVillages] = useState([])
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [allAssignments, setAllAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysWithoutWater, setDaysWithoutWater] = useState('')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedVillage) {
      fetchAssignments()
    }
  }, [selectedVillage])

  const fetchData = async () => {
    try {
      const [villagesRes, assignmentsRes, allAssignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/villages/`),
        axios.get(`${API_URL}/tankers/assignments/active`),
        axios.get(`${API_URL}/tankers/assignments/all`)
      ])
      
      setVillages(villagesRes.data)
      setAssignments(assignmentsRes.data)
      setAllAssignments(allAssignmentsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const fetchAssignments = async () => {
    try {
      const [activeRes, allRes] = await Promise.all([
        axios.get(`${API_URL}/tankers/assignments/active`),
        axios.get(`${API_URL}/tankers/assignments/all`)
      ])
      setAssignments(activeRes.data)
      setAllAssignments(allRes.data)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const requestEmergencyWater = async () => {
    try {
      await axios.post(`${API_URL}/tankers/allocate`)
      alert('🆘 Emergency request submitted! Authorities have been notified.')
      fetchAssignments()
    } catch (error) {
      console.error('Error requesting water:', error)
      alert('Failed to submit request')
    }
  }

  const submitWaterRequest = async (e) => {
    e.preventDefault()
    if (!selectedVillage || !daysWithoutWater) return

    try {
      await axios.put(`${API_URL}/villages/${selectedVillage.id}/update-water`, {
        days_without_water: parseInt(daysWithoutWater)
      })
      alert('✅ Request submitted to District Collector!')
      setDaysWithoutWater('')
      setDescription('')
      setContactNumber('')
      
      const response = await axios.get(`${API_URL}/villages/`)
      setVillages(response.data)
      const updated = response.data.find(v => v.id === selectedVillage.id)
      setSelectedVillage(updated)
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request')
    }
  }

  const getWSIColor = (wsi) => {
    if (wsi >= 70) return 'text-red-600'
    if (wsi >= 50) return 'text-orange-600'
    if (wsi >= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getWSILabel = (wsi) => {
    if (wsi >= 70) return 'Critical'
    if (wsi >= 50) return 'High Risk'
    if (wsi >= 30) return 'Moderate'
    return 'Safe'
  }

  const getStressBadge = (level) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      safe: 'bg-green-100 text-green-800 border-green-300'
    }
    return colors[level] || colors.safe
  }

  const activeAssignment = selectedVillage 
    ? assignments.find(a => a.village?.id === selectedVillage.id)
    : null

  const villageHistory = selectedVillage
    ? allAssignments.filter(a => a.village?.id === selectedVillage.id).slice(0, 5)
    : []

  const generateSMS = () => {
    if (!selectedVillage || !activeAssignment) return []
    
    const messages = []
    if (activeAssignment) {
      messages.push({
        time: new Date(activeAssignment.assigned_at).toLocaleTimeString(),
        text: `JalRakshak: Tanker ${activeAssignment.tanker?.vehicle_number} assigned to ${selectedVillage.name}. Expected arrival in ${activeAssignment.estimated_arrival_minutes} mins. -District Water Authority`
      })
    }
    return messages
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Home size={48} className="mx-auto text-green-600 animate-pulse mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Home size={32} />
            <h1 className="text-2xl font-bold">🏘️ Village Portal</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Your Village
          </label>
          <select
            value={selectedVillage?.id || ''}
            onChange={(e) => {
              const village = villages.find(v => v.id === parseInt(e.target.value))
              setSelectedVillage(village)
            }}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg"
          >
            <option value="">Choose your village...</option>
            {villages.map(village => (
              <option key={village.id} value={village.id}>
                {village.name}, {village.district}
              </option>
            ))}
          </select>
        </div>

        {selectedVillage && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedVillage.name}</h2>
              <p className="text-lg text-gray-600 mb-4">{selectedVillage.district} District</p>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={selectedVillage.water_stress_index >= 70 ? '#ef4444' : 
                             selectedVillage.water_stress_index >= 50 ? '#f97316' :
                             selectedVillage.water_stress_index >= 30 ? '#eab308' : '#22c55e'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(selectedVillage.water_stress_index / 100) * 440} 440`}
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-bold ${getWSIColor(selectedVillage.water_stress_index)}`}>
                      {selectedVillage.water_stress_index.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">WSI Score</div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold border-2 ${getStressBadge(selectedVillage.stress_level)}`}>
                  {selectedVillage.stress_level.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <Droplets className="mx-auto text-red-500 mb-1" size={24} />
                  <p className="text-2xl font-bold text-gray-800">{selectedVillage.days_without_water}</p>
                  <p className="text-xs text-gray-600">Days w/o Water</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Cloud className="mx-auto text-blue-500 mb-1" size={24} />
                  <p className="text-lg font-bold text-gray-800">{selectedVillage.rainfall_current}/{selectedVillage.rainfall_normal}</p>
                  <p className="text-xs text-gray-600">Rainfall (mm)</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Droplets className="mx-auto text-cyan-500 mb-1" size={24} />
                  <p className="text-lg font-bold text-gray-800">{selectedVillage.groundwater_current.toFixed(1)}m</p>
                  <p className="text-xs text-gray-600">Groundwater</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Users className="mx-auto text-purple-500 mb-1" size={24} />
                  <p className="text-lg font-bold text-gray-800">{selectedVillage.population.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Population</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-3">🚛 Tanker Status</h3>
              {activeAssignment ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Truck size={32} className="text-green-600" />
                    <div>
                      <p className="text-xl font-bold text-green-800">Tanker On The Way!</p>
                      <p className="text-sm text-gray-600">Help is coming</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Vehicle:</span> {activeAssignment.tanker?.vehicle_number}</p>
                    <p><span className="font-semibold">Driver:</span> {activeAssignment.tanker?.driver_name}</p>
                    <p><span className="font-semibold">ETA:</span> {activeAssignment.estimated_arrival_minutes} minutes</p>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                      {activeAssignment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle size={32} className="text-yellow-600" />
                    <div>
                      <p className="text-lg font-bold text-yellow-800">No Tanker Assigned Yet</p>
                      <p className="text-sm text-gray-600">Request emergency water supply</p>
                    </div>
                  </div>
                  <button
                    onClick={requestEmergencyWater}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    🆘 Request Emergency Water
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-3">📝 Water Request Form</h3>
              <form onSubmit={submitWaterRequest} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={`${selectedVillage.name}, ${selectedVillage.district}`}
                    disabled
                    className="w-full border-2 border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Days Without Water</label>
                  <input
                    type="number"
                    value={daysWithoutWater}
                    onChange={(e) => setDaysWithoutWater(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Enter number of days"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-2"
                    rows="3"
                    placeholder="Describe your situation..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Your phone number"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {generateSMS().length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-3">📱 SMS Notifications</h3>
                <div className="space-y-2">
                  {generateSMS().map((sms, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{sms.time}</p>
                      <p className="text-sm text-gray-800">{sms.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {villageHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-3">📊 Village History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Tanker</th>
                        <th className="p-2 text-left">Driver</th>
                        <th className="p-2 text-left">Liters</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {villageHistory.map((assignment) => (
                        <tr key={assignment.id} className="border-b">
                          <td className="p-2">{new Date(assignment.assigned_at).toLocaleDateString()}</td>
                          <td className="p-2">{assignment.tanker?.vehicle_number || 'N/A'}</td>
                          <td className="p-2">{assignment.tanker?.driver_name || 'N/A'}</td>
                          <td className="p-2">{assignment.liters_delivered || '-'}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              assignment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              assignment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!selectedVillage && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
            <Home size={48} className="mx-auto text-green-600 mb-2" />
            <p className="text-lg font-semibold text-green-800">Select your village to view status</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SarpanchView
