import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon paths under webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RouteOptimizationMap = () => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:3601/api/custom-views/route-map', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setData(r.data))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: '#dc2626' }}>Failed to load: {err}</div>;
  if (!data) return <div>Loading route map...</div>;

  const center = [data.center.lat, data.center.lng];

  return (
    <div style={styles.wrap}>
      <div style={styles.summary}>
        <div><b>Routes:</b> {data.summary.totalRoutes}</div>
        <div><b>Stops:</b> {data.summary.totalStops}</div>
        <div><b>Total Distance:</b> {data.summary.totalDistanceKm} km</div>
        <div><b>Generated:</b> {new Date(data.generatedAt).toLocaleTimeString()}</div>
      </div>
      <div style={styles.mapBox}>
        <MapContainer center={center} zoom={data.zoom} style={{ height: '480px', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {data.routes.map((route) => {
            const positions = route.stops.map((s) => [s.lat, s.lng]);
            return (
              <React.Fragment key={route.routeId}>
                <Polyline positions={positions} pathOptions={{ color: route.color, weight: 4 }} />
                {route.stops.map((s) => (
                  <CircleMarker
                    key={`${route.routeId}-${s.seq}`}
                    center={[s.lat, s.lng]}
                    radius={8}
                    pathOptions={{ color: route.color, fillColor: route.color, fillOpacity: 0.85 }}
                  >
                    <Popup>
                      <div>
                        <b>{route.routeId} — Stop #{s.seq}</b><br />
                        Driver: {route.driverName}<br />
                        {s.address}<br />
                        Status: {s.status}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
      <div style={styles.legend}>
        {data.routes.map((r) => (
          <span key={r.routeId} style={styles.legendItem}>
            <span style={{ ...styles.dot, background: r.color }} />
            {r.routeId} — {r.driverName} ({r.distanceKm} km, ETA {r.etaMinutes}m)
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrap: { background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  summary: { display: 'flex', gap: 24, marginBottom: 12, fontSize: 13, color: '#475569', flexWrap: 'wrap' },
  mapBox: { borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' },
  legend: { marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12 },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: 6 },
  dot: { display: 'inline-block', width: 12, height: 12, borderRadius: 6 },
};

export default RouteOptimizationMap;
