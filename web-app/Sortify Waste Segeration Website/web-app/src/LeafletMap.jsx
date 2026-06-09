// src/LeafletMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Ensure marker icons load correctly in most bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LeafletMap({ place, height = 360 }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700">
      <MapContainer
        center={[place.lat, place.lng]}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: `${height}px`, width: '100%' }}
      >
        <TileLayer
          // OpenStreetMap tiles (free, no API key)
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[place.lat, place.lng]}>
          <Popup>
            <div>
              <strong>{place.name}</strong>
              <div style={{ marginTop: 6 }}>{place.lat.toFixed(6)}, {place.lng.toFixed(6)}</div>
              <div style={{ marginTop: 6 }}>
                <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
