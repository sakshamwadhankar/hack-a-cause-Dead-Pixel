import { AlertTriangle, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function AlertsList({ alerts, onRefresh }) {
  const dismissAlert = async (alertId) => {
    try {
      await axios.put(`${API_URL}/alerts/${alertId}/dismiss`)
      onRefresh()
    } catch (error) {
      console.error('Error dismissing alert:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-red-600" />
        Active Alerts
      </h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active alerts</p>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`border-l-4 p-3 rounded ${
                alert.severity === 'high'
                  ? 'border-red-500 bg-red-50'
                  : alert.severity === 'medium'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">
                    {alert.alert_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
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
