import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const DistrictContext = createContext()

export function DistrictProvider({ children }) {
  const [districtInfo, setDistrictInfo] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadDistrictFromStorage()
  }, [])

  const loadDistrictFromStorage = () => {
    const stored = localStorage.getItem('selectedDistrict')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setDistrictInfo(parsed)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error parsing district data:', error)
        setIsLoaded(true)
      }
    } else {
      setIsLoaded(true)
    }
  }

  const setDistrict = (data) => {
    localStorage.setItem('selectedDistrict', JSON.stringify(data))
    setDistrictInfo(data)
  }

  const clearDistrict = () => {
    localStorage.removeItem('selectedDistrict')
    setDistrictInfo(null)
  }

  const refreshData = () => {
    loadDistrictFromStorage()
  }

  return (
    <DistrictContext.Provider value={{ 
      districtInfo,
      state: districtInfo?.state,
      district: districtInfo?.district,
      center_lat: districtInfo?.center_lat,
      center_lng: districtInfo?.center_lng,
      normal_rainfall: districtInfo?.normal_rainfall,
      village_count: districtInfo?.village_count,
      isLoaded,
      setDistrict,
      clearDistrict,
      refreshData
    }}>
      {children}
    </DistrictContext.Provider>
  )
}

export function useDistrict() {
  const context = useContext(DistrictContext)
  if (!context) {
    throw new Error('useDistrict must be used within DistrictProvider')
  }
  return context
}
