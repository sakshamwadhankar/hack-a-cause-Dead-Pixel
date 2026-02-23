import { useState } from 'react'
import { Truck, AlertTriangle, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function QuickActions({ tankers, stats, onRefresh, showToast }) {
  const [showStats, setShowStats] = useState(false)
  const [allocating, setAllocating] = useState(false)

  const autoAllocate = async () => {
    setAllocating(true)
    try {
      const response = await axios.post(`${API_URL}/tankers/allocate`)
      const { assignments_created, villages_covered, tankers_dispatched } = response.data
      
      if (assignments_created > 0) {
        showToast(
          `${assignments_created} tanker(s) dispatched to ${villages_covered.length} village(s)`,
          'success'
        )
      } else {
        showToast('No tankers available or no critical villages need water', 'success')
      }
      onRefresh()
    } catch (error) {
      console.error('Error allocating tankers:', error)
      showToast('Failed to allocate tankers', 'error')
    } finally {
      setAllocating(false)
    }
  }

  const generateAlerts = async () => {
    try {
      const response = await axios.post(`${API_URL}/alerts/generate`)
      showToast(`${response.data.alerts_created} new alert(s) generated`, 'success')
      onRefresh()
    } catch (error) {
      console.error('Error generating alerts:', error)
      showToast('Failed to generate alerts', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'dispatched': return 'bg-orange-100 text-orange-800'
      case 'returning': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
      
      <div className="space-y-3 mb-6">
        <button
          onClick={autoAllocate}
          disabled={allocating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Truck className="mr-2" size={20} />
          {allocating ? 'Allocating...' : '🚛 Auto-Allocate Tankers'}
        </button>

        <button
          onClick={generateAlerts}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-semibold flex items-center justify-center"
        >
          <AlertTriangle className="mr-2" size={20} />
          ⚠️ Generate Alerts
        </button>

        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center"
        >
          <BarChart3 className="mr-2" size={20} />
          📊 Village Stats
          {showStats ? <ChevronUp className="ml-2" size={16} /> : <ChevronDown className="ml-2" size={16} />}
        </button>
      </div>

      {showStats && stats && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-purple-900 mb-3">System Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Villages:</span>
              <span className="font-semibold">{stats.total_villages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Critical:</span>
              <span className="font-semibold text-red-600">{stats.critical_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">High Risk:</span>
              <span className="font-semibold text-orange-600">{stats.high_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Moderate:</span>
              <span className="font-semibold text-yellow-600">{stats.moderate_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Safe:</span>
              <span className="font-semibold text-green-600">{stats.safe_count}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-purple-300">
              <span className="text-gray-700">Average WSI:</span>
              <span className="font-semibold">{stats.avg_wsi}</span>
            </div>
            {stats.most_stressed_village && (
              <div className="pt-2 border-t border-purple-300">
                <span className="text-gray-700">Most Stressed:</span>
                <div className="font-semibold text-red-600">
                  {stats.most_stressed_village.name} ({stats.most_stressed_village.wsi})
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Live Tanker Status</h4>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {tankers.map(tanker => (
            <div
              key={tanker.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{tanker.vehicle_number}</p>
                <p className="text-xs text-gray-600">{tanker.driver_name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(tanker.status)}`}>
                {tanker.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickActions
