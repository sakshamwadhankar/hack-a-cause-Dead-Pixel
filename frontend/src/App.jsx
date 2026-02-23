import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DriverView from './pages/DriverView'
import SarpanchView from './pages/SarpanchView'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'
import { Map, Truck, Home, BarChart3 } from 'lucide-react'

function BottomNav() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  const navItems = [
    { path: '/', icon: Map, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/driver', icon: Truck, label: 'Driver' },
    { path: '/sarpanch', icon: Home, label: 'Sarpanch' }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/driver" element={<DriverView />} />
          <Route path="/sarpanch" element={<SarpanchView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
