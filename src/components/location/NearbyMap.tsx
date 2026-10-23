import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NearbyPerson, NearbyTeamItem } from '@/services/api/locationService';

// Leaflet icon configs
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const studentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const professionalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const teamIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface NearbyMapProps {
  userCenter: { lat: number; lng: number };
  radiusKm: number;
  people: NearbyPerson[];
  teams: NearbyTeamItem[];
  selectedId?: string | null;
  onSelectMarker?: (id: string, type: 'PERSON' | 'TEAM') => void;
  onSelectProfile?: (userId: string) => void;
}

const MapViewController: React.FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
};

export const NearbyMap: React.FC<NearbyMapProps> = ({
  userCenter,
  radiusKm,
  people,
  teams,
  onSelectMarker,
  onSelectProfile,
}) => {
  return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-modal relative z-0">
      <MapContainer
        center={[userCenter.lat, userCenter.lng]}
        zoom={radiusKm <= 10 ? 12 : radiusKm <= 20 ? 11 : 10}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapViewController center={userCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Current Approximate Location Marker */}
        <Marker position={[userCenter.lat, userCenter.lng]} icon={userIcon}>
          <Popup>
            <div className="p-1 text-xs font-bold text-slate-900 text-left">
              Your Approximate Area ({radiusKm} km search radius)
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[userCenter.lat, userCenter.lng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#6366f1',
            fillColor: '#818cf8',
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '4, 4',
          }}
        />

        {/* People Markers */}
        {people.map((p) => {
          const lat = p.approximateLat !== undefined ? p.approximateLat : userCenter.lat;
          const lng = p.approximateLng !== undefined ? p.approximateLng : userCenter.lng;
          return (
            <Marker
              key={p.id}
              position={[lat, lng]}
              icon={p.userType === 'STUDENT' ? studentIcon : professionalIcon}
              eventHandlers={{
                click: () => onSelectMarker && onSelectMarker(p.id, 'PERSON'),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-left text-xs max-w-[180px]">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-brand-600 font-semibold">{p.role}</div>
                  <div className="text-[10px] text-slate-500">{p.college}</div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    {p.compatibilityScore !== undefined && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {p.compatibilityScore}% Match
                      </span>
                    )}
                    <span className="text-slate-400">{p.distanceKm} km</span>
                  </div>
                  {onSelectProfile && (
                    <button
                      onClick={() => onSelectProfile(p.id)}
                      className="w-full text-center text-[11px] font-semibold text-white bg-brand-600 hover:bg-brand-700 py-1 rounded mt-1 transition"
                    >
                      View Candidate
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Teams Markers */}
        {teams.map((item) => {
          const lat = item.approximateLat !== undefined ? item.approximateLat : userCenter.lat;
          const lng = item.approximateLng !== undefined ? item.approximateLng : userCenter.lng;
          return (
            <Marker
              key={item.team.id}
              position={[lat, lng]}
              icon={teamIcon}
              eventHandlers={{
                click: () => onSelectMarker && onSelectMarker(item.team.id, 'TEAM'),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-left text-xs max-w-[180px]">
                  <div className="font-bold text-slate-900">{item.team.name}</div>
                  <div className="text-[11px] text-brand-600 font-semibold">{item.team.eventName}</div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500 font-medium">{item.distanceKm} km away</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
