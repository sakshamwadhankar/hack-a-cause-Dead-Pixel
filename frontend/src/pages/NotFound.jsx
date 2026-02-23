import { Link } from 'react-router-dom'
import { Droplets, Home } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Droplets size={64} className="mx-auto text-blue-600 mb-4" />
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">💧 Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist in JalRakshak</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Home size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
