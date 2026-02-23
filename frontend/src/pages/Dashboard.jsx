import { useState, useEffect } from 'react'
import axios from 'axios'
import VillageMap from '../components/VillageMap'
import StatsCard from '../components/StatsCard'
import AlertsList from '../components/AlertsList'
import QuickActions from '../components/QuickActions'
import Toast from '../components/Toast'
import { useRegion } from '../context/RegionContext'
import { AlertTriangle, Droplets, Truck, MapPin, TrendingUp, ChevronDown } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function Dashboard() {
  const { selectedState, selectedDistrict, districtData, allStates, setRegion, loadDistrictData } = useRegion()
  const [stats, setStats] = useState(null)
  const [villages, setVillages] = useState([])
  const [tankers, setTankers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [toast, setToast] = useState(null)
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [needsDataLoad, setNeedsDataLoad] = useState(false)

  useEffect(() => {
    if (selectedDistrict && districtData) {
      fetchData()
    }
  }, [selectedState, selectedDistrict])

  useEffect(() => {
    const dataInterval = setInterval(() => {
      if (selectedDistrict && districtData && !needsDataLoad) fetchData()
    }, 30000)
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    
    return () => {
      clearInterval(dataInterval)
      clearInterval(timeInterval)
    }
  }, [selectedDistrict, districtData, needsDataLoad])

  const fetchData = async () => {
    try {
      const [villagesRes, tankersRes, alertsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/villages/?region=${selectedState}`),
        axios.get(`${API_URL}/tankers/`),
        axios.get(`${API_URL}/alerts/`),
        axios.get(`${API_URL}/tankers/assignments/active`)
      ])
      
      // Filter villages by district
      const districtVillages = villagesRes.data.filter(v => v.district === selectedDistrict)
      
      if (districtVillages.length === 0) {
        setNeedsDataLoad(true)
        setStats({ total_villages: 0, critical_count: 0, high_count: 0, moderate_count: 0, safe_count: 0, avg_wsi: 0 })
      } else {
        setNeedsDataLoad(false)
        // Calculate stats for this district
        const critical_count = districtVillages.filter(v => v.stress_level === 'critical').length
        const high_count = districtVillages.filter(v => v.stress_level === 'high').length
        const moderate_count = districtVillages.filter(v => v.stress_level === 'moderate').length
        const safe_count = districtVillages.filter(v => v.stress_level === 'safe').length
        const avg_wsi = districtVillages.reduce((sum, v) => sum + v.water_stress_index, 0) / districtVillages.length
        
        setStats({
          total_villages: districtVillages.length,
          critical_count,
          high_count,
          moderate_count,
          safe_count,
          avg_wsi
        })
      }
      
      setVillages(districtVillages)
      setTankers(tankersRes.data.filter(t => t.region === selectedState))
      setAlerts(alertsRes.data)
      setAssignments(assignmentsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Error loading data', 'error')
      setLoading(false)
    }
  }

  const handleLoadDistrictData = async () => {
    try {
      showToast('Fetching real villages from OpenStreetMap...', 'info')
      const result = await axios.post(`${API_URL}/villages/districts/load-real`, {
        state: selectedState,
        district: selectedDistrict,
        center_lat: districtData.lat,
        center_lng: districtData.lng
      })
      showToast(`✅ ${result.data.villages_loaded} real villages loaded from OpenStreetMap!`, 'success')
      setNeedsDataLoad(false)
      fetchData()
    } catch (error) {
      console.error('Error loading district data:', error)
      showToast('Error loading district data', 'error')
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const formatDateTime = (date) => {
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const tankersActive = tankers.filter(t => t.status === 'dispatched').length

  const currentStateDistricts = allStates.find(s => s.name === selectedState)?.districts || []

  if (loading || !districtData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Droplets size={48} className="mx-auto text-blue-600 animate-pulse mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading Dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Droplets size={32} className="text-blue-200" />
              <h1 className="text-2xl font-bold">JalRakshak</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* State Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStateDropdown(!showStateDropdown)
                    setShowDistrictDropdown(false)
                  }}
                  className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  <span className="font-semibold">🇮🇳 {selectedState}</span>
                  <ChevronDown size={20} />
                </button>
                
                {showStateDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white text-gray-800 rounded-lg shadow-xl min-w-[250px] max-h-[400px] overflow-y-auto z-50">
                    {allStates.map(state => (
                      <button
                        key={state.name}
                        onClick={() => {
                          setRegion(state.name, state.districts[0]?.name || '')
                          setShowStateDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition ${
                          selectedState === state.name ? 'bg-blue-100 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{state.name}</span>
                          <span className="text-sm text-gray-500">{state.districts.length} districts</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* District Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDistrictDropdown(!showDistrictDropdown)
                    setShowStateDropdown(false)
                  }}
                  className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  <span className="font-semibold">📍 {selectedDistrict}</span>
                  <ChevronDown size={20} />
                </button>
                
                {showDistrictDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white text-gray-800 rounded-lg shadow-xl min-w-[280px] max-h-[400px] overflow-y-auto z-50">
                    {currentStateDistricts.map(district => (
                      <button
                        key={district.name}
                        onClick={() => {
                          setRegion(selectedState, district.name)
                          setShowDistrictDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition ${
                          selectedDistrict === district.name ? 'bg-blue-100 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{district.name}</div>
                            <div className="text-xs text-gray-500">
                              {district.normal_rainfall}mm rainfall • {district.village_count} villages
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-blue-200">Live System Time</div>
              <div className="text-lg font-mono">{formatDateTime(currentTime)}</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-800 px-6 py-2">
          <p className="text-sm text-blue-100 text-center">
            🌍 {selectedDistrict} District, {selectedState} | {districtData?.normal_rainfall}mm Normal Rainfall
          </p>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatsCard
            title="Total Villages"
            value={stats?.total_villages || 0}
            icon={<MapPin size={24} />}
            color="blue"
          />
          <StatsCard
            title="Critical Villages"
            value={stats?.critical_count || 0}
            icon={<AlertTriangle size={24} />}
            color="red"
            pulse={stats?.critical_count > 0}
          />
          <StatsCard
            title="Tankers Active"
            value={tankersActive}
            icon={<Truck size={24} />}
            color="orange"
          />
          <StatsCard
            title="Avg WSI Score"
            value={stats?.avg_wsi?.toFixed(1) || '0.0'}
            icon={<TrendingUp size={24} />}
            color="purple"
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Last Updated: {formatDateTime(currentTime)} • Auto-refresh every 30 seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {selectedDistrict} District - Village Water Stress Map
              </h3>
              <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200 relative">
                {needsDataLoad ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                      <MapPin size={64} className="mx-auto text-blue-600 mb-4" />
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">
                        📍 {selectedDistrict} District Selected
                      </h4>
                      <p className="text-gray-600 mb-4">
                        No village data loaded yet for this district.
                      </p>
                      <button
                        onClick={handleLoadDistrictData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                      >
                        🗺️ Load Real Villages from OpenStreetMap
                      </button>
                      <p className="text-sm text-gray-500 mt-3">
                        Fetches real village names and coordinates from OSM + real IMD rainfall data
                      </p>
                    </div>
                  </div>
                ) : null}
                <VillageMap 
                  villages={villages} 
                  tankers={tankers}
                  assignments={assignments}
                  center={districtData ? [districtData.lat, districtData.lng] : null}
                  zoom={10}
                  onRefresh={fetchData}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <AlertsList 
              alerts={alerts} 
              onRefresh={fetchData}
              showToast={showToast}
            />
            <QuickActions 
              tankers={tankers}
              stats={stats}
              onRefresh={fetchData}
              showToast={showToast}
            />
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default Dashboard
