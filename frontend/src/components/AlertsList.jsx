import { useEffect } from 'react'
import { AlertTriangle, X, CheckCircle } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function AlertsList({ alerts, onRefresh, showToast }) {
  useEffect(() => {
    if (alerts.length === 0) {
      generateAlerts()
    }
  }, [])

  const generateAlerts = async () => {
    try {
      await axios.post(`${API_URL}/alerts/generate`)
      onRefresh()
    } catch (error) {
      console.error('Error generating alerts:', error)
    }
  }

  const resolveAlert = async (alertId) => {
    try {
      await axios.put(`${API_URL}/alerts/${alertId}/resolve`)
      showToast('Alert resolved successfully', 'success')
      onRefresh()
    } catch (error) {
      console.error('Error resolving alert:', error)
      showToast('Failed to resolve alert', 'error')
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-orange-500 bg-orange-50'
      case 'low': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center text-gray-800">
          <AlertTriangle className="mr-2 text-red-600" size={24} />
          Active Alerts
        </h3>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
          {alerts.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
            <p className="text-gray-500">No active alerts</p>
            <p className="text-sm text-gray-400">All villages are being monitored</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {alert.alert_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="ml-2 text-gray-400 hover:text-green-600 transition"
                  title="Resolve alert"
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AlertsList
