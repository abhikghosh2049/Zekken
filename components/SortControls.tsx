import React from 'react';

type SortOrder = 'fare-asc' | 'fare-desc';

interface SortControlsProps {
  activeSort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

const SortButton: React.FC<{
  label: string;
  onClick: () => void;
  isActive: boolean;
}> = ({ label, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500 ${
        isActive
          ? 'bg-cyan-600 text-white shadow-sm'
          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white'
      }`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

export const SortControls: React.FC<SortControlsProps> = ({ activeSort, onSortChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3" title="Click to sort results by fare.">
      <SortButton
        label="Fare: Low to High"
        onClick={() => onSortChange('fare-asc')}
        isActive={activeSort === 'fare-asc'}
      />
      <SortButton
        label="Fare: High to Low"
        onClick={() => onSortChange('fare-desc')}
        isActive={activeSort === 'fare-desc'}
      />
    </div>
  );
};