import { useState } from 'react'
import { api } from '../utils/api'
import { X, CheckCircle } from 'lucide-react'

function DeliveryModal({ assignment, onClose, onComplete }) {
  const [litersDelivered, setLitersDelivered] = useState(assignment.tanker.capacity_liters)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await api.markDelivered({
        assignment_id: assignment.assignment_id,
        liters_delivered: litersDelivered,
        notes: notes || null,
        delivery_lat: assignment.village.latitude,
        delivery_lng: assignment.village.longitude
      })

      setSuccess(true)
      
      setTimeout(() => {
        onComplete({
          ...assignment,
          liters_delivered: litersDelivered,
          delivered_at: response.data.delivered_at
        })
      }, 1500)
    } catch (error) {
      console.error('Error marking delivered:', error)
      alert('Failed to mark delivery. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Delivery Confirmed!
          </h3>
          <p className="text-gray-600">
            {assignment.village.name} has been updated
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-2xl p-6 animate-fadeIn" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Confirm Delivery</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-gray-800">{assignment.village.name}</p>
          <p className="text-sm text-gray-600">{assignment.village.district} District</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Liters Delivered
            </label>
            <input
              type="number"
              value={litersDelivered}
              onChange={(e) => setLitersDelivered(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              min="0"
              max={assignment.tanker.capacity_liters}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tank capacity: {assignment.tanker.capacity_liters.toLocaleString()} liters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any issues? Road blocked? etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
              rows="3"
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              📸 Photo upload feature coming soon!
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || litersDelivered <= 0}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                <span>Confirm Delivery</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryModal
