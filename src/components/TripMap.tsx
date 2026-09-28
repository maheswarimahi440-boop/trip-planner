import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  ExternalLink, 
  Compass, 
  Calendar, 
  Sparkles,
  Building2,
  Coffee,
  Sun
} from 'lucide-react';
import L from 'leaflet';
import { TripPlan } from '../types/trip';

interface TripMapProps {
  trip: TripPlan;
}

export const TripMap: React.FC<TripMapProps> = ({ trip }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [activeCluster, setActiveCluster] = useState<number | null>(null);

  // Initialize or re-center Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = trip.coordinates?.lat || 35.6762;
    const lng = trip.coordinates?.lng || 139.6503;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 13);
    }

    return () => {
      // Don't necessarily destroy on every small state update
    };
  }, [trip.destination, trip.coordinates]);

  // Update Markers based on selectedDay
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    // Add Hotel Marker
    const hotel = trip.hotelOptions.find(h => h.isSelected) || trip.hotelOptions[0];
    if (hotel?.coordinates) {
      const hotelIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: #8b5cf6; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold; font-size: 13px;">🏨</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const hotelMarker = L.marker([hotel.coordinates.lat, hotel.coordinates.lng], { icon: hotelIcon })
        .bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <div style="font-size: 11px; font-weight: bold; color: #7c3aed; text-transform: uppercase;">Selected Accommodation</div>
            <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px;">${hotel.name}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${hotel.location}</div>
            <div style="font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 4px;">${hotel.costPerNight} ${trip.currency} / night</div>
          </div>
        `);
      markersRef.current.addLayer(hotelMarker);
      bounds.push([hotel.coordinates.lat, hotel.coordinates.lng]);
    }

    // Add Itinerary Activities Markers
    trip.itinerary.forEach((day) => {
      if (selectedDay !== 'all' && day.dayNumber !== selectedDay) return;

      const dayColors = ['#0d9488', '#4f46e5', '#f59e0b', '#ec4899', '#06b6d4', '#10b981'];
      const color = dayColors[(day.dayNumber - 1) % dayColors.length];

      const slots = [
        { label: 'Morning', data: day.morning, icon: '☀️' },
        { label: 'Afternoon', data: day.afternoon, icon: '🏛️' },
        { label: 'Evening', data: day.evening, icon: '🌆' }
      ];

      slots.forEach((s) => {
        if (!s.data?.coordinates) return;

        const iconHtml = `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white; font-weight: 800; font-size: 11px;">D${day.dayNumber}</div>`;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const lat = s.data.coordinates.lat;
        const lng = s.data.coordinates.lng;

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.data.location} ${trip.destination}`)}`;

        const popupContent = `
          <div style="font-family: inherit; padding: 4px; max-width: 220px;">
            <div style="font-size: 10px; font-weight: bold; color: ${color}; text-transform: uppercase;">
              Day ${day.dayNumber} · ${s.label} (${s.data.time})
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px;">
              ${s.data.activity}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              📍 ${s.data.location}
            </div>
            <div style="font-size: 11px; color: #047857; margin-top: 2px; font-weight: 600;">
              ${s.data.cost > 0 ? `Est. Cost: ${s.data.cost} ${trip.currency}` : 'Free Admission'}
            </div>
            <div style="margin-top: 6px;">
              <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: bold; color: #0284c7; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                Open Directions ↗
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon }).bindPopup(popupContent);
        markersRef.current?.addLayer(marker);
        bounds.push([lat, lng]);
      });
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 15 });
      } catch (e) {
        // ignore bounds sizing error
      }
    }
  }, [selectedDay, trip]);

  const clusters = trip.attractionClusters || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Interactive Location & Cluster Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Attractions clustered by neighborhood geography to minimize daily transit fatigue.
          </p>
        </div>

        {/* Day Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl max-w-full">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDay === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Days
          </button>
          {trip.itinerary.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDay(d.dayNumber)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDay === d.dayNumber
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              D{d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md h-[460px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 shadow-md text-xs space-y-1.5 pointer-events-auto max-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Map Legend
          </span>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[9px] text-white font-bold">🏨</span>
            <span className="font-semibold text-[11px]">Hotel Accommodation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center text-[9px] text-white font-bold">D1</span>
            <span className="font-semibold text-[11px]">Itinerary Highlights</span>
          </div>
        </div>
      </div>

      {/* Geographic Attraction Clusters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Geographic Attraction Clusters ({clusters.length})
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Grouping nearby destinations reduces travel time and lets you absorb each district's unique neighborhood spirit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {cluster.clusterName}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {cluster.attractions.length} spots
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {cluster.description}
              </p>

              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                {cluster.attractions.map((att, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="font-medium flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {att.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                      Day {att.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
