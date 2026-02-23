import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const RegionContext = createContext()

export function RegionProvider({ children }) {
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('selectedState') || 'Maharashtra'
  })
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem('selectedDistrict') || 'Nagpur'
  })
  const [allStates, setAllStates] = useState([])
  const [districtData, setDistrictData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllDistricts()
  }, [])

  useEffect(() => {
    if (allStates.length > 0 && selectedState && selectedDistrict) {
      const state = allStates.find(s => s.name === selectedState)
      if (state) {
        const district = state.districts.find(d => d.name === selectedDistrict)
        if (district) {
          setDistrictData(district)
        }
      }
    }
  }, [selectedState, selectedDistrict, allStates])

  const fetchAllDistricts = async () => {
    try {
      const response = await axios.get(`${API_URL}/villages/districts/all`)
      setAllStates(response.data.states)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching districts:', error)
      setLoading(false)
    }
  }

  const setRegion = (state, district) => {
    setSelectedState(state)
    setSelectedDistrict(district)
    localStorage.setItem('selectedState', state)
    localStorage.setItem('selectedDistrict', district)
  }

  const loadDistrictData = async () => {
    try {
      const response = await axios.post(`${API_URL}/villages/districts/load`, {
        state: selectedState,
        district: selectedDistrict
      })
      // Refresh districts to update village counts
      await fetchAllDistricts()
      return response.data
    } catch (error) {
      console.error('Error loading district data:', error)
      throw error
    }
  }

  return (
    <RegionContext.Provider value={{ 
      selectedState, 
      selectedDistrict, 
      districtData,
      allStates, 
      setRegion, 
      loadDistrictData,
      loading 
    }}>
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
