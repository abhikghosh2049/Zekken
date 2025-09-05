import React from 'react';
import type { SearchParams } from '../types';

interface RecentSearchesProps {
  searches: SearchParams[];
  onSelect: (search: SearchParams) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect }) => {
  return (
    <div className="bg-sky-950/20 rounded-lg p-4 backdrop-blur-sm border border-cyan-700/50 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
        </svg>
        Recent Searches
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSelect(search)}
            className="w-full text-left p-3 bg-black/40 hover:bg-zinc-700/60 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-cyan-500 group transform hover:scale-[1.02] hover:border-cyan-600/50"
            aria-label={`Search again for pickup at ${search.pickup}, dropoff at ${search.dropoff}, for ${search.seats} passengers`}
          >
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1 min-w-0">
                  {/* Icons and connecting line */}
                  <div className="flex flex-col items-center self-stretch">
                    <div className="p-1.5 bg-zinc-700 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="w-px flex-grow bg-zinc-600 my-1"></div>
                    <div className="p-1.5 bg-zinc-700 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </div>
                  </div>
                  {/* Location Text */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-sm">
                      <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">From:</span>
                      <p className="text-xs text-zinc-400 truncate mt-0.5" title={search.pickup}>{search.pickup}</p>
                    </div>
                    <div className="h-4"></div>
                    <div className="text-sm">
                        <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">To:</span>
                        <p className="text-xs text-zinc-400 truncate mt-0.5" title={search.dropoff}>{search.dropoff}</p>
                    </div>
                  </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm pr-2 flex-shrink-0" title={`${search.seats} passengers`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                <span className="font-semibold">{search.seats}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};