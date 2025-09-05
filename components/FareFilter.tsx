import React from 'react';

interface FareFilterProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onFareChange: (range: { min: number; max: number }) => void;
}

export const FareFilter: React.FC<FareFilterProps> = ({ min, max, currentMin, currentMax, onFareChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), currentMax);
    onFareChange({ min: newMin, max: currentMax });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), currentMin);
    onFareChange({ min: currentMin, max: newMax });
  };
  
  return (
    <div className="space-y-4" title="Adjust the sliders to filter results by your price range.">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <label htmlFor="min-fare" className="text-zinc-400" title="Set the minimum price for the cab fare.">Min Fare</label>
          <span className="font-semibold text-cyan-300">₹{currentMin}</span>
        </div>
        <input
          id="min-fare"
          type="range"
          min={min}
          max={max}
          value={currentMin}
          onChange={handleMinChange}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          aria-label="Minimum fare"
        />
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <label htmlFor="max-fare" className="text-zinc-400" title="Set the maximum price for the cab fare.">Max Fare</label>
          <span className="font-semibold text-cyan-300">₹{currentMax}</span>
        </div>
        <input
          id="max-fare"
          type="range"
          min={min}
          max={max}
          value={currentMax}
          onChange={handleMaxChange}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          aria-label="Maximum fare"
        />
      </div>
    </div>
  );
};