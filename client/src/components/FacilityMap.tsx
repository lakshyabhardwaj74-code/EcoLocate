import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Facility } from '../types';
import { ShieldCheck, Star, Navigation, Truck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet default marker icon issue in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Electric Blue Eco Marker Icon
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User Location Cyan Marker Icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  facilities: Facility[];
  selectedFacilityId?: string | null;
  userCoords?: { lat: number; lng: number } | null;
  onSelectFacility?: (facility: Facility) => void;
  center?: [number, number];
  zoom?: number;
}

// Controller to auto-center map when selection changes
const MapCenterController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const FacilityMap: React.FC<MapProps> = ({
  facilities,
  selectedFacilityId,
  userCoords,
  onSelectFacility,
  center = [20.5937, 78.9629],
  zoom = 5,
}) => {
  let activeCenter: [number, number] = center;
  let activeZoom = zoom;

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);
  if (selectedFacility) {
    activeCenter = [selectedFacility.latitude, selectedFacility.longitude];
    activeZoom = 13;
  } else if (userCoords) {
    activeCenter = [userCoords.lat, userCoords.lng];
    activeZoom = 11;
  } else if (facilities.length > 0) {
    activeCenter = [facilities[0].latitude, facilities[0].longitude];
    activeZoom = 10;
  }

  return (
    <div className="w-full h-full min-h-[420px] relative rounded-2xl overflow-hidden shadow-card border border-[#E2E8F0]">
      <MapContainer
        center={activeCenter}
        zoom={activeZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapCenterController center={activeCenter} zoom={activeZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Current Location Marker */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
            <Popup>
              <div className="p-1 text-center font-sans">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#16A6A0]/15 text-[#16A6A0] rounded-full mb-1">
                  You Are Here
                </span>
                <p className="text-xs font-bold text-[#071A21]">Your Current Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Facility Markers */}
        {facilities.map((f) => (
          <Marker
            key={f.id}
            position={[f.latitude, f.longitude]}
            icon={blueIcon}
            eventHandlers={{
              click: () => {
                if (onSelectFacility) onSelectFacility(f);
              },
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-2 max-w-xs font-sans space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#071A21] leading-snug">{f.name}</h4>
                  {f.isVerified && (
                    <span className="shrink-0 text-[10px] font-bold bg-[#16A6A0]/10 text-[#16A6A0] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#16A6A0]/25">
                      <ShieldCheck className="w-3 h-3 text-[#16A6A0]" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#5e777f] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#16A6A0] shrink-0" />
                  <span>{f.address}, {f.city}</span>
                </p>

                <div className="flex items-center justify-between text-xs text-[#5e777f] pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{f.rating.toFixed(1)}</span>
                  </div>
                  {f.distanceKm !== undefined && f.distanceKm !== null && (
                    <span className="text-[#16A6A0] font-bold bg-[#16A6A0]/10 px-2 py-0.5 rounded-md">
                      {f.distanceKm} km away
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  <Link
                    to={`/facilities/${f.id}`}
                    className="text-center py-1.5 text-xs font-bold text-[#071A21] bg-slate-100 hover:bg-[#16A6A0]/10 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-press flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-white bg-[#071A21] hover:bg-[#16A6A0] rounded-lg transition-colors shadow-xs"
                  >
                    <Navigation className="w-3 h-3 text-[#38D9E8]" />
                    Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
