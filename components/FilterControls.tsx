import React from 'react';

interface FilterControlsProps {
  cabTypes: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ cabTypes, activeFilter, onFilterChange }) => {
  const filters = ['All', ...cabTypes];

  return (
    <div className="mb-4 flex justify-center flex-wrap gap-3" title="Click a cab type to filter the results.">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 ${
            activeFilter === filter
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white'
          }`}
          aria-pressed={activeFilter === filter}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};