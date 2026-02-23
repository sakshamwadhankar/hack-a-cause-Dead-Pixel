import axios from 'axios'

const getBaseURL = () => {
  // Check if running in Android (Capacitor)
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    // Use your computer's local IP
    // Updated with actual IP address
    return "http://172.19.36.129:8000"
  }
  
  // Running in browser
  return "http://localhost:8000"
}

const BASE_URL = getBaseURL()

const getToken = () => localStorage.getItem('driver_token')

export const api = {
  sendOTP: (phone) => 
    axios.post(`${BASE_URL}/driver/send-otp`, { phone }),
  
  verifyOTP: (phone, otp) => 
    axios.post(`${BASE_URL}/driver/verify-otp`, { phone, otp }),
  
  getAssignments: () => 
    axios.get(`${BASE_URL}/driver/my-assignments`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  
  markDelivered: (data) => 
    axios.post(`${BASE_URL}/driver/mark-delivered`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  
  logout: () => 
    axios.post(`${BASE_URL}/driver/logout`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  
  getProfile: () => 
    axios.get(`${BASE_URL}/driver/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
}

// Export BASE_URL for debugging
export { BASE_URL }

