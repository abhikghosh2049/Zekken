import React from 'react';
import { CabCard } from './CabCard';
import { Loader } from './Loader';
import type { CabOption, Coordinates } from '../types';

interface ResultsDisplayProps {
  cabOptions: CabOption[];
  totalCabCount: number;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  routeCoordinates: { pickup: Coordinates; dropoff: Coordinates } | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ cabOptions, totalCabCount, isLoading, error, hasSearched, routeCoordinates }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400">{error}</p>
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
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-300">Available Cabs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabOptions.map((option, index) => {
          // Create a more stable key than just the index
          const stableKey = `${option.provider}-${option.cabType}-${option.fare}-${option.eta}-${index}`;
          return <CabCard key={stableKey} option={option} routeCoordinates={routeCoordinates} />;
        })}
      </div>
    </div>
  );
};