import { CheckCircle, XCircle } from 'lucide-react'

function Toast({ message, type = 'success' }) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 min-w-[300px]`}>
        <Icon size={24} />
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  )
}

export default Toast
