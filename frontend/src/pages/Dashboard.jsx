import { useState, useEffect } from 'react'
import axios from 'axios'
import VillageMap from '../components/VillageMap'
import StatsCard from '../components/StatsCard'
import AlertsList from '../components/AlertsList'
import { AlertTriangle, Droplets, Truck, MapPin } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [villages, setVillages] = useState([])
  const [tankers, setTankers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, villagesRes, tankersRes, alertsRes] = await Promise.all([
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/villages/`),
        axios.get(`${API_URL}/tankers/`),
        axios.get(`${API_URL}/alerts/`)
      ])
      
      setStats(statsRes.data)
      setVillages(villagesRes.data)
      setTankers(tankersRes.data)
      setAlerts(alertsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Drought Monitoring Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Villages"
          value={stats?.total_villages || 0}
          icon={<MapPin />}
          color="blue"
        />
        <StatsCard
          title="High Risk Villages"
          value={stats?.high_risk_villages || 0}
          icon={<AlertTriangle />}
          color="red"
        />
        <StatsCard
          title="Available Tankers"
          value={`${stats?.available_tankers || 0}/${stats?.total_tankers || 0}`}
          icon={<Truck />}
          color="green"
        />
        <StatsCard
          title="Pending Requests"
          value={stats?.pending_requests || 0}
          icon={<Droplets />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">Village Map</h3>
            <div className="h-[500px]">
              <VillageMap villages={villages} tankers={tankers} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <AlertsList alerts={alerts} onRefresh={fetchData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
