import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const villageIcon = (risk) => {
  const color = risk === 'high' ? 'red' : risk === 'medium' ? 'orange' : 'green'
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
  })
}

const tankerIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: blue; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
  iconSize: [24, 24],
})

function VillageMap({ villages, tankers }) {
  const center = villages.length > 0 
    ? [villages[0].latitude, villages[0].longitude]
    : [21.35, 74.88]

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {villages.map(village => (
        <Marker
          key={village.id}
          position={[village.latitude, village.longitude]}
          icon={villageIcon(village.drought_risk)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{village.name}</h3>
              <p className="text-sm">Population: {village.population}</p>
              <p className="text-sm">Water Level: {village.water_level}%</p>
              <p className="text-sm">Risk: <span className={`font-semibold ${
                village.drought_risk === 'high' ? 'text-red-600' :
                village.drought_risk === 'medium' ? 'text-orange-600' :
                'text-green-600'
              }`}>{village.drought_risk.toUpperCase()}</span></p>
              <p className="text-sm">Last Rainfall: {village.last_rainfall} days ago</p>
            </div>
          </Popup>
          {village.drought_risk === 'high' && (
            <Circle
              center={[village.latitude, village.longitude]}
              radius={2000}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }}
            />
          )}
        </Marker>
      ))}

      {tankers.map(tanker => (
        <Marker
          key={tanker.id}
          position={[tanker.current_location_lat, tanker.current_location_lng]}
          icon={tankerIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{tanker.vehicle_number}</h3>
              <p className="text-sm">Driver: {tanker.driver_name}</p>
              <p className="text-sm">Capacity: {tanker.capacity}L</p>
              <p className="text-sm">Status: <span className={`font-semibold ${
                tanker.status === 'available' ? 'text-green-600' : 'text-orange-600'
              }`}>{tanker.status.toUpperCase()}</span></p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default VillageMap
