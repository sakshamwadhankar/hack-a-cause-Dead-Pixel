import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Droplets, MapPin, ArrowRight, Loader } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function DistrictSelect() {
  const navigate = useNavigate()
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districtData, setDistrictData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_URL}/villages/districts/all`)
      setStates(response.data.states)
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const handleStateChange = (stateName) => {
    setSelectedState(stateName)
    setSelectedDistrict('')
    setDistrictData(null)
  }

  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName)
    const state = states.find(s => s.name === selectedState)
    const district = state?.districts.find(d => d.name === districtName)
    setDistrictData(district)
  }

  const handleEnterDashboard = async () => {
    if (!districtData) return

    setLoading(true)

    // Save to localStorage
    const districtInfo = {
      state: selectedState,
      district: selectedDistrict,
      center_lat: districtData.lat,
      center_lng: districtData.lng,
      normal_rainfall: districtData.normal_rainfall,
      village_count: districtData.village_count,
      enteredAt: new Date().toISOString()
    }
    localStorage.setItem('selectedDistrict', JSON.stringify(districtInfo))

    // If no villages, load from OSM
    if (districtData.village_count === 0) {
      setLoadingVillages(true)
      try {
        await axios.post(`${API_URL}/villages/districts/load-real`, {
          state: selectedState,
          district: selectedDistrict,
          center_lat: districtData.lat,
          center_lng: districtData.lng
        })
      } catch (error) {
        console.error('Error loading villages:', error)
      }
      setLoadingVillages(false)
    }

    setLoading(false)
    navigate('/dashboard')
  }

  const currentStateDistricts = states.find(s => s.name === selectedState)?.districts || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Droplets size={64} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">JalRakshak</h1>
          <p className="text-blue-100 text-lg">Powered by real-time water data across India</p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Your District</h2>

          {/* State Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Step 1: Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="">Choose a state...</option>
              {states.map(state => (
                <option key={state.name} value={state.name}>
                  🇮🇳 {state.name} ({state.districts.length} districts)
                </option>
              ))}
            </select>
          </div>

          {/* District Selection */}
          {selectedState && (
            <div className="mb-6 animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Step 2: Select District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">Choose a district...</option>
                {currentStateDistricts.map(district => (
                  <option key={district.name} value={district.name}>
                    📍 {district.name} ({district.village_count} villages)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* District Info Card */}
          {districtData && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200 animate-fadeIn">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedDistrict}</h3>
                  <p className="text-gray-600">{selectedState}</p>
                </div>
                <MapPin size={32} className="text-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Normal Rainfall</p>
                  <p className="font-semibold text-gray-800">{districtData.normal_rainfall}mm</p>
                </div>
                <div>
                  <p className="text-gray-600">Villages Available</p>
                  <p className="font-semibold text-gray-800">
                    {districtData.village_count > 0 ? districtData.village_count : 'Will load from OSM'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Coordinates</p>
                  <p className="font-semibold text-gray-800 text-xs">
                    {districtData.lat.toFixed(4)}°N, {districtData.lng.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enter Button */}
          {districtData && (
            <button
              onClick={handleEnterDashboard}
              disabled={loading || loadingVillages}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingVillages ? (
                <>
                  <Loader size={24} className="animate-spin" />
                  <span>Loading villages from OpenStreetMap...</span>
                </>
              ) : loading ? (
                <>
                  <Loader size={24} className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          )}

          {/* All India Overview Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('selectedDistrict')
                navigate('/dashboard')
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              View All India Overview →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-100 text-sm">
          <p>Real data from IMD, CGWB, Census India & OpenStreetMap</p>
        </div>
      </div>
    </div>
  )
}

export default DistrictSelect
