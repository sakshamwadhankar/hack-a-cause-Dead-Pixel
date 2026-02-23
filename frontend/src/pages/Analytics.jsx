import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, AlertTriangle, Users, Search } from 'lucide-react'

const API_URL = 'http://localhost:8000'

function Analytics() {
  const [stats, setStats] = useState(null)
  const [villages, setVillages] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'water_stress_index', direction: 'desc' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, villagesRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/villages/stats`),
        axios.get(`${API_URL}/villages/`),
        axios.get(`${API_URL}/tankers/assignments/all`)
      ])
      
      setStats(statsRes.data)
      setVillages(villagesRes.data)
      setAssignments(assignmentsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const sortedVillages = [...villages].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const filteredVillages = sortedVillages.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.district.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDistrictCounts = () => {
    const districts = {}
    villages.forEach(v => {
      if (v.stress_level === 'critical' || v.stress_level === 'high') {
        districts[v.district] = (districts[v.district] || 0) + 1
      }
    })
    const sorted = Object.entries(districts).sort((a, b) => b[1] - a[1])
    return sorted[0] || ['None', 0]
  }

  const getTotalAtRiskPopulation = () => {
    return villages
      .filter(v => v.stress_level === 'critical' || v.stress_level === 'high')
      .reduce((sum, v) => sum + v.population, 0)
  }

  const getBarChartData = () => {
    return villages.map(v => ({
      name: v.name.substring(0, 8),
      wsi: v.water_stress_index,
      fill: v.water_stress_index >= 70 ? '#ef4444' :
            v.water_stress_index >= 50 ? '#f97316' :
            v.water_stress_index >= 30 ? '#eab308' : '#22c55e'
    }))
  }

  const getPieChartData = () => {
    return [
      { name: 'Critical', value: stats?.critical_count || 0, color: '#ef4444' },
      { name: 'High', value: stats?.high_count || 0, color: '#f97316' },
      { name: 'Moderate', value: stats?.moderate_count || 0, color: '#eab308' },
      { name: 'Safe', value: stats?.safe_count || 0, color: '#22c55e' }
    ]
  }

  const getWSIColor = (wsi) => {
    if (wsi >= 70) return 'bg-red-500'
    if (wsi >= 50) return 'bg-orange-500'
    if (wsi >= 30) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStressBadge = (level) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      safe: 'bg-green-100 text-green-800'
    }
    return colors[level] || colors.safe
  }

  const hasActiveAssignment = (villageId) => {
    return assignments.some(a => 
      a.village?.id === villageId && 
      (a.status === 'pending' || a.status === 'in_transit')
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <TrendingUp size={48} className="mx-auto text-purple-600 animate-pulse mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading Analytics...</div>
        </div>
      </div>
    )
  }

  const [mostStressedDistrict, districtCount] = getDistrictCounts()
  const atRiskPopulation = getTotalAtRiskPopulation()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-purple-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
          <p className="text-purple-200">Comprehensive drought monitoring and tanker operations analysis</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle size={32} />
              <span className="text-sm font-semibold bg-red-700 px-3 py-1 rounded-full">CRITICAL</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Most Stressed Village</h3>
            <p className="text-3xl font-bold">{stats?.most_stressed_village?.name || 'N/A'}</p>
            <p className="text-red-100">WSI: {stats?.most_stressed_village?.wsi || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={32} />
              <span className="text-sm font-semibold bg-orange-700 px-3 py-1 rounded-full">ALERT</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Most Affected District</h3>
            <p className="text-3xl font-bold">{mostStressedDistrict}</p>
            <p className="text-orange-100">{districtCount} critical villages</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users size={32} />
              <span className="text-sm font-semibold bg-purple-700 px-3 py-1 rounded-full">AT RISK</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Population at Risk</h3>
            <p className="text-3xl font-bold">{atRiskPopulation.toLocaleString()}</p>
            <p className="text-purple-100">Critical + High stress areas</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Village Stress Analysis</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search villages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('name')}>
                    Village {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('district')}>
                    District {sortConfig.key === 'district' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('population')}>
                    Population {sortConfig.key === 'population' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('water_stress_index')}>
                    WSI Score {sortConfig.key === 'water_stress_index' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left">Stress Level</th>
                  <th className="p-3 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('days_without_water')}>
                    Days w/o Water {sortConfig.key === 'days_without_water' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left">Rainfall Deficit</th>
                  <th className="p-3 text-left">Tanker Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVillages.map(village => (
                  <tr key={village.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{village.name}</td>
                    <td className="p-3">{village.district}</td>
                    <td className="p-3">{village.population.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getWSIColor(village.water_stress_index)}`}
                            style={{ width: `${Math.min(village.water_stress_index, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{village.water_stress_index.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStressBadge(village.stress_level)}`}>
                        {village.stress_level.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={village.days_without_water > 7 ? 'text-red-600 font-bold' : ''}>
                        {village.days_without_water}
                      </span>
                    </td>
                    <td className="p-3">{village.rainfall_normal - village.rainfall_current}mm</td>
                    <td className="p-3">
                      {hasActiveAssignment(village.id) ? (
                        <span className="text-green-600 font-semibold">🚛 Assigned</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Water Stress Index by Village</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getBarChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="Critical" />
                <ReferenceLine y={50} stroke="#f97316" strokeDasharray="3 3" label="High" />
                <Bar dataKey="wsi" fill="#8884d8">
                  {getBarChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Villages by Stress Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tanker Operations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Village</th>
                  <th className="p-3 text-left">Tanker</th>
                  <th className="p-3 text-left">Driver</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Assigned At</th>
                  <th className="p-3 text-left">ETA</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{assignment.id}</td>
                    <td className="p-3 font-semibold">{assignment.village?.name || 'N/A'}</td>
                    <td className="p-3">{assignment.tanker?.vehicle_number || 'N/A'}</td>
                    <td className="p-3">{assignment.tanker?.driver_name || 'N/A'}</td>
                    <td className="p-3">{assignment.priority_score?.toFixed(1) || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        assignment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">{new Date(assignment.assigned_at).toLocaleString()}</td>
                    <td className="p-3">{assignment.estimated_arrival_minutes || 'N/A'} mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
