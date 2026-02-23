import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const RegionContext = createContext()

export function RegionProvider({ children }) {
  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem('selectedRegion') || 'marathwada'
  })
  const [regions, setRegions] = useState([])
  const [regionData, setRegionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegions()
  }, [])

  useEffect(() => {
    if (regions.length > 0) {
      const region = regions.find(r => r.id === selectedRegion)
      setRegionData(region)
    }
  }, [selectedRegion, regions])

  const fetchRegions = async () => {
    try {
      const response = await axios.get(`${API_URL}/villages/regions`)
      setRegions(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching regions:', error)
      setLoading(false)
    }
  }

  const setRegion = (regionId) => {
    setSelectedRegion(regionId)
    localStorage.setItem('selectedRegion', regionId)
  }

  return (
    <RegionContext.Provider value={{ selectedRegion, regionData, regions, setRegion, loading }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion must be used within RegionProvider')
  }
  return context
}
