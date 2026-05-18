import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBounds({ startCoords, endCoords }) {
  const map = useMap();
  useEffect(() => {
    if (startCoords && endCoords) {
      const bounds = L.latLngBounds([startCoords, endCoords]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [startCoords, endCoords, map]);
  return null;
}

export default function MapSection({ mapData }) {
  if (!mapData || !mapData.startCoords) return null;

  return (
    <div className="h-[450px] w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-white dark:border-slate-800 relative group">
      <div className="absolute inset-0 z-20 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
      
      <MapContainer 
        center={mapData.startCoords} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={mapData.startCoords} />
        <Marker position={mapData.endCoords} />
        
        {mapData.polyline && (
          <Polyline 
            positions={mapData.polyline} 
            color="#6366f1" 
            weight={5} 
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
            dashArray="10, 10"
            className="animate-pulse"
          />
        )}
        
        <MapBounds startCoords={mapData.startCoords} endCoords={mapData.endCoords} />
      </MapContainer>

      {/* Decorative Gradient Overlay for Premium Feel */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-20 pointer-events-none opacity-50"></div>
    </div>
  );
}
