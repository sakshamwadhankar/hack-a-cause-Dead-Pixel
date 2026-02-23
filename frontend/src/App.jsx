import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DriverView from './pages/DriverView'
import SarpanchView from './pages/SarpanchView'
import { Droplets } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets size={32} />
                <h1 className="text-2xl font-bold">JalRakshak</h1>
              </div>
              <div className="flex space-x-6">
                <Link to="/" className="hover:text-blue-200 transition">Dashboard</Link>
                <Link to="/driver" className="hover:text-blue-200 transition">Driver</Link>
                <Link to="/sarpanch" className="hover:text-blue-200 transition">Sarpanch</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/driver" element={<DriverView />} />
          <Route path="/sarpanch" element={<SarpanchView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
