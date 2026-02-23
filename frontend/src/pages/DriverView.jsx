import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Phone, CheckCircle, Navigation } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function DriverView() {
  const [tankers, setTankers] = useState([])
  const [selectedTanker, setSelectedTanker] = useState(null)
  const [assignment, setAssignment] = useState(null)

  useEffect(() => {
    fetchTankers()
  }, [])

  useEffect(() => {
    if (selectedTanker) {
      fetchAssignment()
    }
  }, [selectedTanker])

  const fetchTankers = async () => {
    try {
      const response = await axios.get(`${API_URL}/tankers/`)
      setTankers(response.data)
    } catch (error) {
      console.error('Error fetching tankers:', error)
    }
  }

  const fetchAssignment = async () => {
    if (!selectedTanker || selectedTanker.status !== 'assigned') {
      setAssignment(null)
      return
    }

    try {
      const response = await axios.get(`${API_URL}/villages/${selectedTanker.assigned_village_id}`)
      setAssignment(response.data)
    } catch (error) {
      console.error('Error fetching assignment:', error)
    }
  }

  const completeDelivery = async () => {
    if (!selectedTanker) return

    try {
      await axios.put(`${API_URL}/tankers/${selectedTanker.id}/complete`)
      alert('Delivery completed successfully!')
      fetchTankers()
      setAssignment(null)
    } catch (error) {
      console.error('Error completing delivery:', error)
      alert('Failed to complete delivery')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Driver Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">Select Your Tanker</h3>
            <div className="space-y-2">
              {tankers.map(tanker => (
                <button
                  key={tanker.id}
                  onClick={() => setSelectedTanker(tanker)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedTanker?.id === tanker.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold">{tanker.vehicle_number}</div>
                  <div className="text-sm text-gray-600">{tanker.driver_name}</div>
                  <div className={`text-xs mt-1 font-medium ${
                    tanker.status === 'available' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {tanker.status.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTanker ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4">Tanker Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Vehicle Number</p>
                  <p className="font-semibold text-lg">{selectedTanker.vehicle_number}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Driver Name</p>
                  <p className="font-semibold text-lg">{selectedTanker.driver_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Capacity</p>
                  <p className="font-semibold text-lg">{selectedTanker.capacity} L</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className={`font-semibold text-lg ${
                    selectedTanker.status === 'available' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {selectedTanker.status.toUpperCase()}
                  </p>
                </div>
              </div>

              {assignment && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-4">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <Navigation className="mr-2" />
                    Current Assignment
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 text-sm">Destination Village</p>
                      <p className="font-semibold text-lg">{assignment.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Population</p>
                      <p className="font-semibold">{assignment.population}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Water Level</p>
                      <p className="font-semibold">{assignment.water_level}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Coordinates</p>
                      <p className="font-semibold flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {assignment.latitude.toFixed(4)}, {assignment.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={completeDelivery}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <CheckCircle className="mr-2" />
                    Mark Delivery Complete
                  </button>
                </div>
              )}

              {!assignment && selectedTanker.status === 'available' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-600 mb-2" />
                  <p className="text-lg font-semibold text-green-800">Tanker Available</p>
                  <p className="text-gray-600">Waiting for assignment</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 text-lg">Select a tanker to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DriverView
