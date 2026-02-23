import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import AssignmentsPage from './pages/AssignmentsPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('driver_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('driver_token')
    localStorage.removeItem('driver_info')
    setIsAuthenticated(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <AssignmentsPage onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
