import React, { useEffect, useRef } from 'react';
import { CabCard } from './CabCard';
import type { CabOption, Coordinates, SearchParams } from '../types';

// Let TypeScript know that 'L' is a global from the Leaflet script
declare const L: any;

// --- Map component defined in-file ---
interface MapProps {
  pickup: Coordinates;
  dropoff: Coordinates;
  pickupAddress: string;
  dropoffAddress: string;
}

const Map: React.FC<MapProps> = ({ pickup, dropoff, pickupAddress, dropoffAddress }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the map instance

  useEffect(() => {
    if (mapContainerRef.current && pickup && dropoff) {
      // Clear previous map instance if coordinates change
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(mapContainerRef.current);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const pickupLatLng: [number, number] = [pickup.latitude, pickup.longitude];
      const dropoffLatLng: [number, number] = [dropoff.latitude, dropoff.longitude];

      const pickupIcon = L.divIcon({
        html: `<div class="relative"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg></div>`,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const dropoffIcon = L.divIcon({
        html: `<div class="relative"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></div>`,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });
      
      // Use original address for tooltip, but format coordinates nicely if that's what we have
      const pickupTooltipContent = pickupAddress.startsWith('Lat:') ? `Lat: ${pickup.latitude}, Lon: ${pickup.longitude}` : pickupAddress;
      const dropoffTooltipContent = dropoffAddress.startsWith('Lat:') ? `Lat: ${dropoff.latitude}, Lon: ${dropoff.longitude}` : dropoffAddress;

      L.marker(pickupLatLng, { icon: pickupIcon }).addTo(map).bindPopup("<b>Pickup Location</b>").bindTooltip(pickupTooltipContent);
      L.marker(dropoffLatLng, { icon: dropoffIcon }).addTo(map).bindPopup("<b>Drop-off Location</b>").bindTooltip(dropoffTooltipContent);

      // Add a dashed polyline to connect the markers
      L.polyline([pickupLatLng, dropoffLatLng], {
        color: '#06b6d4', // A cyan that matches the theme
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 10'
      }).addTo(map);

      const bounds = L.latLngBounds(pickupLatLng, dropoffLatLng);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function to remove the map instance
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup, dropoff, pickupAddress, dropoffAddress]);

  return <div ref={mapContainerRef} className="h-64 md:h-80 w-full rounded-lg border border-cyan-700/60 shadow-lg z-0" aria-label="Route map"/>;
};


interface ResultsDisplayProps {
  cabOptions: CabOption[];
  totalCabCount: number;
  error: string | null;
  hasSearched: boolean;
  routeCoordinates: { pickup: Coordinates; dropoff: Coordinates } | null;
  lastSearch: SearchParams | null;
  preferredCabType: string | null;
  onSetPreferred: (cabType: string) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    cabOptions, 
    totalCabCount, 
    error, 
    hasSearched, 
    routeCoordinates, 
    lastSearch,
    preferredCabType,
    onSetPreferred,
 }) => {

  if (error) {
    return (
      <div className="text-center p-8 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
        <p className="text-cyan-400">{error}</p>
      </div>
    );
  }
  
  if (!hasSearched) {
      return (
        <div className="text-center p-8 text-zinc-500">
            <p>Enter your locations to find the smartest ride.</p>
        </div>
      );
  }

  if (hasSearched && totalCabCount === 0) {
    return (
      <div className="text-center p-8 text-zinc-500">
        <p>No cabs found for this route. Try different locations.</p>
      </div>
    );
  }

  if (hasSearched && totalCabCount > 0 && cabOptions.length === 0) {
    return (
      <div className="text-center p-8 text-zinc-500">
        <p>No cabs found matching your filters. Try adjusting the cab type or fare range.</p>
      </div>
    );
  }


  return (
    <div>
      {routeCoordinates && lastSearch && (
        <div className="animate-fade-in-up mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-zinc-300">Your Route</h2>
          <Map 
            pickup={routeCoordinates.pickup} 
            dropoff={routeCoordinates.dropoff}
            pickupAddress={lastSearch.pickup}
            dropoffAddress={lastSearch.dropoff}
          />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-300">Available Cabs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabOptions.map((option, index) => {
          // Create a more stable key than just the index
          const stableKey = `${option.provider}-${option.cabType}-${option.fare}-${option.eta}-${index}`;
          return (
            <CabCard 
                key={stableKey} 
                option={option} 
                routeCoordinates={routeCoordinates}
                preferredCabType={preferredCabType}
                onSetPreferred={onSetPreferred}
            />
          );
        })}
      </div>
    </div>
  );
};