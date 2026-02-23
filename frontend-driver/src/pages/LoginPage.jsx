import { useState, useRef, useEffect } from 'react'
import { api } from '../utils/api'

function LoginPage({ onLogin }) {
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoOTP, setDemoOTP] = useState('')
  const [driverName, setDriverName] = useState('')
  const [canResend, setCanResend] = useState(false)
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => setCanResend(true), 30000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setPhone(value)
      setError('')
    }
  }

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.sendOTP(phone)
      // Always show OTP for demo purposes
      setDemoOTP(response.data.demo_otp || response.data.otp || response.data.fallback_otp)
      setDriverName(response.data.driver_name)
      setStep('otp')
      setTimeout(() => otpRefs[0].current?.focus(), 100)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOTP = [...otp]
    newOTP[index] = value

    setOtp(newOTP)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus()
    }

    // Auto-submit when all filled
    if (newOTP.every(digit => digit !== '') && index === 3) {
      handleVerifyOTP(newOTP.join(''))
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleVerifyOTP = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 4) {
      setError('Please enter complete OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.verifyOTP(phone, otpValue)
      localStorage.setItem('driver_token', response.data.token)
      localStorage.setItem('driver_info', JSON.stringify(response.data.driver))
      onLogin()
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP')
      setOtp(['', '', '', ''])
      otpRefs[0].current?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setCanResend(false)
    setOtp(['', '', '', ''])
    handleSendOTP()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="text-6xl mb-4">💧</div>
          <h1 className="text-4xl font-bold text-white mb-2">JalRakshak Driver</h1>
          <p className="text-orange-100">Water Tanker Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
          {step === 'phone' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Driver</h2>
              <p className="text-gray-600 mb-6">Enter your registered phone number</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  maxLength={10}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
                <p className="text-xs text-blue-700">📞 9876543210 (Ramesh Patil - Latur)</p>
                <p className="text-xs text-blue-700">📞 9321098765 (Ravi Thakur - Nagpur)</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
              <p className="text-gray-600 mb-2">
                OTP sent to <span className="font-semibold">{phone}</span>
              </p>
              {driverName && (
                <p className="text-sm text-orange-600 font-semibold mb-6">
                  Welcome, {driverName}!
                </p>
              )}

              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="tel"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    maxLength={1}
                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>

              {demoOTP && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Demo OTP (remove in production):</p>
                  <p className="text-2xl font-bold text-gray-700">{demoOTP}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some(d => !d)}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    className="text-orange-600 font-semibold text-sm hover:text-orange-700"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">Resend OTP in 30 seconds</p>
                )}
              </div>

              <button
                onClick={() => {
                  setStep('phone')
                  setOtp(['', '', '', ''])
                  setError('')
                }}
                className="w-full mt-3 text-gray-600 text-sm hover:text-gray-800"
              >
                ← Change Phone Number
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>© 2025 JalRakshak | Powered by Real Data</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
