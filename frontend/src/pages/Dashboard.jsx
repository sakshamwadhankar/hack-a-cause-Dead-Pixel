import { useState, useEffect } from 'react'
import axios from 'axios'
import VillageMap from '../components/VillageMap'
import StatsCard from '../components/StatsCard'
import AlertsList from '../components/AlertsList'
import QuickActions from '../components/QuickActions'
import Toast from '../components/Toast'
import { useDistrict } from '../context/DistrictContext'
import { AlertTriangle, Droplets, Truck, MapPin, TrendingUp } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function Dashboard() {
  const { district, state, center_lat, center_lng, districtInfo } = useDistrict()
  const [stats, setStats] = useState(null)
  const [villages, setVillages] = useState([])
  const [tankers, setTankers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchData()
  }, [district])

  useEffect(() => {
    const dataInterval = setInterval(() => fetchData(), 30000)
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    
    return () => {
      clearInterval(dataInterval)
      clearInterval(timeInterval)
    }
  }, [district])

  const fetchData = async () => {
    try {
      const params = district ? `?district=${district}` : ''
      const [villagesRes, tankersRes, alertsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/villages/${params}`),
        axios.get(`${API_URL}/tankers/${params}`),
        axios.get(`${API_URL}/alerts/`),
        axios.get(`${API_URL}/tankers/assignments/active`)
      ])
      
      const districtVillages = villagesRes.data
      
      const critical_count = districtVillages.filter(v => v.stress_level === 'critical').length
      const high_count = districtVillages.filter(v => v.stress_level === 'high').length
      const moderate_count = districtVillages.filter(v => v.stress_level === 'moderate').length
      const safe_count = districtVillages.filter(v => v.stress_level === 'safe').length
      const avg_wsi = districtVillages.length > 0 
        ? districtVillages.reduce((sum, v) => sum + v.water_stress_index, 0) / districtVillages.length
        : 0
      
      setStats({
        total_villages: districtVillages.length,
        critical_count,
        high_count,
        moderate_count,
        safe_count,
        avg_wsi
      })
      
      setVillages(districtVillages)
      setTankers(tankersRes.data)
      setAlerts(alertsRes.data)
      setAssignments(assignmentsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Error loading data', 'error')
      setLoading(false)
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

  if (loading) {
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Droplets size={32} className="text-blue-200" />
              <h1 className="text-2xl font-bold">
                💧 JalRakshak {district && `| 📍 ${district}`}
              </h1>
            </div>

            <div className="text-right">
              <div className="text-sm text-blue-200">Live System Time</div>
              <div className="text-lg font-mono">{formatDateTime(currentTime)}</div>
            </div>
          </div>
        </div>
        {district && state && (
          <div className="bg-blue-800 px-6 py-2">
            <p className="text-sm text-blue-100 text-center">
              🌍 {district} District, {state} | {districtInfo?.normal_rainfall}mm Normal Rainfall
            </p>
          </div>
        )}
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
                {district ? `${district} District` : 'All India'} - Village Water Stress Map
              </h3>
              <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
                <VillageMap 
                  villages={villages} 
                  tankers={tankers}
                  assignments={assignments}
                  center={center_lat && center_lng ? [center_lat, center_lng] : null}
                  zoom={district ? 10 : 5}
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
