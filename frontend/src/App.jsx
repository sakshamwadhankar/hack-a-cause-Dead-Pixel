import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DriverView from './pages/DriverView'
import SarpanchView from './pages/SarpanchView'
import Analytics from './pages/Analytics'
import DistrictSelect from './pages/DistrictSelect'
import NotFound from './pages/NotFound'
import { DistrictProvider, useDistrict } from './context/DistrictContext'
import { Map, Truck, Home, BarChart3, MapPin } from 'lucide-react'

function BottomNav() {
  const location = useLocation()
  const { district, state } = useDistrict()
  
  // Don't show nav on district select page
  if (location.pathname === '/select-district') return null
  
  const isActive = (path) => location.pathname === path
  
  const navItems = [
    { path: '/dashboard', icon: Map, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/driver', icon: Truck, label: 'Driver' },
    { path: '/sarpanch', icon: Home, label: 'Sarpanch' }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      {/* District Info Bar */}
      {district && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-semibold text-gray-800">{district}, {state}</span>
          </div>
          <Link
            to="/select-district"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Change
          </Link>
        </div>
      )}
      
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-semibold mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function ProtectedRoute({ children }) {
  const { districtInfo, isLoaded } = useDistrict()
  
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  
  // Allow dashboard without district for "All India" view
  if (!districtInfo && window.location.pathname === '/dashboard') {
    return children
  }
  
  if (!districtInfo) {
    return <Navigate to="/select-district" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <DistrictProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/select-district" element={<DistrictSelect />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/driver" element={
              <ProtectedRoute><DriverView /></ProtectedRoute>
            } />
            <Route path="/sarpanch" element={
              <ProtectedRoute><SarpanchView /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/select-district" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </DistrictProvider>
    </Router>
  )
}

export default App
