import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { LogOut, MapPin, Users, Droplets, Clock, Navigation, CheckCircle, Package } from 'lucide-react'
import DeliveryModal from '../components/DeliveryModal'

function AssignmentsPage({ onLogout }) {
  const [assignments, setAssignments] = useState([])
  const [completedAssignments, setCompletedAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [driverInfo, setDriverInfo] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('driver_info'))
    setDriverInfo(info)
    fetchAssignments()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAssignments, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.getAssignments()
      setAssignments(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      if (error.response?.status === 401) {
        onLogout()
      }
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    onLogout()
  }

  const handleOpenMaps = (assignment) => {
    window.open(assignment.google_maps_link, '_blank')
  }

  const handleMarkDelivered = (assignment) => {
    setSelectedAssignment(assignment)
    setShowDeliveryModal(true)
  }

  const handleDeliveryComplete = (deliveredAssignment) => {
    setCompletedAssignments([...completedAssignments, deliveredAssignment])
    setAssignments(assignments.filter(a => a.assignment_id !== deliveredAssignment.assignment_id))
    setShowDeliveryModal(false)
    setSelectedAssignment(null)
  }

  const getStressColor = (level) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'moderate': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-green-500 bg-green-50'
    }
  }

  const getStressBadge = (level) => {
    switch (level) {
      case 'critical': return { text: '🔴 CRITICAL', color: 'bg-red-600' }
      case 'high': return { text: '🟠 HIGH', color: 'bg-orange-600' }
      case 'moderate': return { text: '🟡 MODERATE', color: 'bg-yellow-600' }
      default: return { text: '🟢 SAFE', color: 'bg-green-600' }
    }
  }

  const totalAssignments = assignments.length + completedAssignments.length
  const progress = totalAssignments > 0 ? (completedAssignments.length / totalAssignments) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">Loading assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🚛</div>
            <div>
              <h1 className="text-xl font-bold">JalRakshak Driver</h1>
              <p className="text-sm text-orange-100">{driverInfo?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-orange-700 rounded-lg transition"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Driver Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Vehicle Number</p>
              <p className="text-lg font-bold text-gray-800">{driverInfo?.vehicle_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">District</p>
              <p className="text-lg font-bold text-gray-800">{driverInfo?.district}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold text-green-600">🟢 On Duty</p>
            </div>
          </div>

          {/* Progress Bar */}
          {totalAssignments > 0 && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Today's Progress</span>
                <span>{completedAssignments.length}/{totalAssignments} deliveries</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        {assignments.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              📋 Pending Deliveries ({assignments.length})
            </h2>
            <div className="space-y-3">
              {assignments.map((assignment, index) => {
                const badge = getStressBadge(assignment.village.stress_level)
                return (
                  <div
                    key={assignment.assignment_id}
                    className={`bg-white rounded-lg shadow-md border-l-4 ${getStressColor(assignment.village.stress_level)} p-4 animate-fadeIn`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {badge.text}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        Stop #{index + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      📍 {assignment.village.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{assignment.village.district} District</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Population</p>
                          <p className="font-semibold text-gray-800">
                            {assignment.village.population.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Days w/o Water</p>
                          <p className="font-semibold text-red-600">
                            {assignment.village.days_without_water} days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">WSI Score</p>
                          <p className="font-semibold text-gray-800">
                            {assignment.village.wsi_score.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">ETA</p>
                          <p className="font-semibold text-gray-800">
                            {assignment.estimated_arrival_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Assigned at: {new Date(assignment.assigned_at).toLocaleString('en-IN')}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOpenMaps(assignment)}
                        className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2"
                      >
                        <Navigation size={18} />
                        <span>Open Maps</span>
                      </button>
                      <button
                        onClick={() => handleMarkDelivered(assignment)}
                        className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Delivered</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Pending Deliveries
            </h3>
            <p className="text-gray-600">You're all done for now!</p>
            <p className="text-sm text-gray-500 mt-2">
              New assignments will appear here automatically
            </p>
          </div>
        )}

        {/* Completed Deliveries */}
        {completedAssignments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              ✅ Completed Today ({completedAssignments.length})
            </h2>
            <div className="space-y-2">
              {completedAssignments.map((assignment) => (
                <div
                  key={assignment.assignment_id}
                  className="bg-gray-100 rounded-lg p-3 border border-gray-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{assignment.village.name}</p>
                      <p className="text-xs text-gray-600">
                        {assignment.liters_delivered?.toLocaleString()} liters delivered
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(assignment.delivered_at).toLocaleTimeString('en-IN')}
                      </p>
                      <span className="text-green-600 font-bold text-sm">✓ Done</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && selectedAssignment && (
        <DeliveryModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowDeliveryModal(false)
            setSelectedAssignment(null)
          }}
          onComplete={handleDeliveryComplete}
        />
      )}
    </div>
  )
}

export default AssignmentsPage
