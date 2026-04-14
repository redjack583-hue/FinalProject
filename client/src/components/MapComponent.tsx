import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapItem {
  id: number | string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
}

interface MapProps {
  items: MapItem[];
  center?: [number, number];
  zoom?: number;
}

// Component to handle auto-centering when items change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ items, center = [48.3809, -89.2477], zoom = 12 }: MapProps) {
  // If we have items, we could optionally calculate the actual center of items
  // For now, defaulting to Thunder Bay center
  
  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border shadow-sm z-0">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        {items.map((item) => (
          item.latitude && item.longitude ? (
            <Marker key={item.id} position={[item.latitude, item.longitude]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm m-0">{item.name}</h3>
                  {item.category && <p className="text-xs text-muted-foreground m-0 mb-1">{item.category}</p>}
                  <p className="text-xs line-clamp-2 m-0">{item.description}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
