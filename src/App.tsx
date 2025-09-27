import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(/Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent))
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-center py-8">
        Guthaben.de - Guthabenkarten & Geschenkkarten
      </h1>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg mb-4">Über 500 Produkte verfügbar</p>
          <div className="flex justify-center gap-4">
            <a 
              href="/desktop/guthaben.de_telekom.html" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Desktop Version
            </a>
            <a 
              href="/mobile/guthaben.de_telekom.html" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mobile Version
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Guthabenkarten</h3>
            <p className="text-sm text-gray-600">Handy-Guthaben für alle Anbieter</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Geschenkkarten</h3>
            <p className="text-sm text-gray-600">Amazon, Apple, Google Play und mehr</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Gaming Cards</h3>
            <p className="text-sm text-gray-600">Steam, PlayStation, Xbox</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App