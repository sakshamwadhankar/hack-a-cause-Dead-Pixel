import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDistrict } from '../context/DistrictContext'
import { Truck, MapPin, Clock, Users, Droplets, CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function DriverView() {
  const { district, state } = useDistrict()
  const [tankers, setTankers] = useState([])
  const [selectedTanker, setSelectedTanker] = useState(null)
  const [route, setRoute] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deliveryModal, setDeliveryModal] = useState(null)
  const [litersInput, setLitersInput] = useState('')
  const [notesInput, setNotesInput] = useState('')

  useEffect(() => {
    fetchTankers()
  }, [district])

  useEffect(() => {
    if (selectedTanker) {
      fetchRoute()
      fetchDeliveries()
    }
  }, [selectedTanker])

  const fetchTankers = async () => {
    try {
      const params = district ? `?district=${district}` : ''
      const response = await axios.get(`${API_URL}/tankers/${params}`)
      setTankers(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tankers:', error)
      setLoading(false)
    }
  }

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`${API_URL}/tankers/${selectedTanker.id}/route`)
      setRoute(response.data.route || [])
    } catch (error) {
      console.error('Error fetching route:', error)
    }
  }

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${API_URL}/tankers/assignments/all`)
      const tankerDeliveries = response.data.filter(
        a => a.tanker?.id === selectedTanker.id && a.status === 'delivered'
      )
      setDeliveries(tankerDeliveries)
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    }
  }

  const openDeliveryModal = (stop) => {
    const litersPerStop = Math.floor(selectedTanker.capacity_liters / (route.length || 1))
    setLitersInput(litersPerStop.toString())
    setNotesInput('')
    setDeliveryModal(stop)
  }

  const markDelivered = async () => {
    if (!deliveryModal || !litersInput) return

    try {
      await axios.post(`${API_URL}/tankers/${selectedTanker.id}/deliver`, {
        village_id: deliveryModal.village_id,
        liters_delivered: parseInt(litersInput),
        notes: notesInput || null
      })
      
      alert('✅ Delivery marked successfully!')
      setDeliveryModal(null)
      fetchRoute()
      fetchDeliveries()
      fetchTankers()
    } catch (error) {
      console.error('Error marking delivery:', error)
      alert('Failed to mark delivery')
    }
  }

  const pendingStops = route.filter(r => r.status === 'pending' || r.status === 'in_transit')
  const completedToday = deliveries.length
  const totalLitersDelivered = deliveries.reduce((sum, d) => sum + (d.liters_delivered || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Truck size={48} className="mx-auto text-orange-600 animate-pulse mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-orange-600 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-3">
            <Truck size={32} />
            <h1 className="text-2xl font-bold">
              🚛 Driver Portal {district && `- ${district}`}
            </h1>
          </div>
          {district && state && (
            <p className="text-sm text-orange-100 mb-3">
              📍 {district} District, {state}
            </p>
          )}
          {selectedTanker && (
            <div className="text-sm bg-orange-700 rounded-lg p-2">
              <p className="font-semibold">{selectedTanker.driver_name}</p>
              <p className="text-orange-200">{selectedTanker.vehicle_number}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Your Tanker
          </label>
          <select
            value={selectedTanker?.id || ''}
            onChange={(e) => {
              const tanker = tankers.find(t => t.id === parseInt(e.target.value))
              setSelectedTanker(tanker)
            }}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg"
          >
            <option value="">Choose your tanker...</option>
            {tankers.map(tanker => (
              <option key={tanker.id} value={tanker.id}>
                {tanker.vehicle_number} - {tanker.driver_name}
              </option>
            ))}
          </select>
        </div>

        {selectedTanker && (
          <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-blue-900 mb-3">📊 Delivery Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Total Stops</p>
                  <p className="text-2xl font-bold text-blue-900">{route.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedToday}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingStops.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Liters Delivered</p>
                  <p className="text-2xl font-bold text-blue-900">{totalLitersDelivered}L</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${route.length > 0 ? (completedToday / route.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  {route.length > 0 ? Math.round((completedToday / route.length) * 100) : 0}% Complete
                </p>
              </div>
            </div>

            {pendingStops.length > 0 && (
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">🗺️ Your Route</h3>
                <div className="space-y-3">
                  {pendingStops.map((stop, index) => (
                    <div key={stop.assignment_id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">{stop.village_name}</h4>
                            <p className="text-sm text-gray-600">Priority: {stop.priority_score.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-500" />
                          <span>{stop.estimated_arrival_minutes} mins</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{stop.latitude.toFixed(2)}, {stop.longitude.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openDeliveryModal(stop)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <CheckCircle className="mr-2" size={20} />
                        ✅ Mark Delivered
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deliveries.length > 0 && (
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">✅ Completed Deliveries</h3>
                <div className="space-y-2">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="bg-gray-100 rounded-lg p-3 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{delivery.village?.name}</p>
                          <p className="text-sm text-gray-600">
                            {delivery.liters_delivered}L delivered
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(delivery.delivered_at).toLocaleString()}
                          </p>
                        </div>
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingStops.length === 0 && deliveries.length === 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-2" />
                <p className="text-lg font-semibold text-green-800">All Deliveries Complete!</p>
                <p className="text-sm text-gray-600">Great job today!</p>
              </div>
            )}
          </>
        )}

        {!selectedTanker && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
            <Truck size={48} className="mx-auto text-blue-600 mb-2" />
            <p className="text-lg font-semibold text-blue-800">Select your tanker to view route</p>
          </div>
        )}
      </div>

      {deliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Mark Delivery Complete</h3>
            <p className="text-gray-700 mb-4">Village: <span className="font-semibold">{deliveryModal.village_name}</span></p>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Liters Delivered
              </label>
              <input
                type="number"
                value={litersInput}
                onChange={(e) => setLitersInput(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-3"
                placeholder="Enter liters"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-3"
                rows="3"
                placeholder="Any notes about the delivery..."
              ></textarea>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeliveryModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={markDelivered}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverView
