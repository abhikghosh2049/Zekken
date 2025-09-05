import React, { useState, useRef, useEffect } from 'react';
import type { SearchParams, BookmarkedLocation } from '../types';
import { fetchLocationSuggestions } from '../services/geminiService';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  pickup: string;
  dropoff: string;
  seats: number;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onSeatsChange: (value: number) => void;
  bookmarkedLocations: BookmarkedLocation[];
  onAddBookmark: (address: string) => void;
  onRemoveBookmark: (id: string) => void;
}

const EmptyStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const FilledStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  isLoading, 
  pickup,
  dropoff,
  seats,
  onPickupChange,
  onDropoffChange,
  onSeatsChange,
  bookmarkedLocations, 
  onAddBookmark,
  onRemoveBookmark,
}) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);
  const [isBookmarkListOpenFor, setIsBookmarkListOpenFor] = useState<'pickup' | 'dropoff' | null>(null);
  const [bookmarkingLocation, setBookmarkingLocation] = useState<string | null>(null);

  const debounceTimeout = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setActiveInput(null);
        setIsBookmarkListOpenFor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ pickup, dropoff, seats });
  };
  
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onPickupChange(`Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`);
        setIsFetchingLocation(false);
      },
      (error) => {
        let errorMessage = "Could not fetch location. Please ensure you have enabled location permissions for this site in your browser settings.";
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "You denied the request for Geolocation. To use this feature, please enable location permissions in your browser settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable at the moment.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out. Please try again.";
                break;
        }
        alert(errorMessage);
        setIsFetchingLocation(false);
      }
    );
  };
  
  const handleFocus = (inputType: 'pickup' | 'dropoff') => {
    setActiveInput(inputType);
    setIsBookmarkListOpenFor(null);
  };
  
  const handleToggleBookmarkList = (inputType: 'pickup' | 'dropoff') => {
    setActiveInput(null);
    setIsBookmarkListOpenFor(prev => prev === inputType ? null : inputType);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputType: 'pickup' | 'dropoff') => {
    const value = e.target.value;
    if (inputType === 'pickup') {
      onPickupChange(value);
    } else {
      onDropoffChange(value);
    }
    setActiveInput(inputType);
    setIsBookmarkListOpenFor(null);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    setSuggestions([]);

    if (value.length > 2) {
      setIsFetchingSuggestions(true);
      debounceTimeout.current = window.setTimeout(async () => {
        const fetchedSuggestions = await fetchLocationSuggestions(value);
        setSuggestions(fetchedSuggestions);
        setIsFetchingSuggestions(false);
      }, 500);
    } else {
      setIsFetchingSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string, inputType: 'pickup' | 'dropoff') => {
    if (inputType === 'pickup') {
      onPickupChange(suggestion);
    } else {
      onDropoffChange(suggestion);
    }
    setSuggestions([]);
    setActiveInput(null);
    setIsBookmarkListOpenFor(null);
  };

  const handleBookmarkToggle = (address: string) => {
      const trimmedAddress = address.trim().toLowerCase();
      if (!trimmedAddress || bookmarkingLocation) return;

      const existingBookmark = bookmarkedLocations.find(bm => bm.address.trim().toLowerCase() === trimmedAddress);

      setBookmarkingLocation(address);

      // Simulate network request for better UX feedback
      setTimeout(() => {
        if (existingBookmark) {
          onRemoveBookmark(existingBookmark.id);
        } else {
          onAddBookmark(address);
        }
        setBookmarkingLocation(null);
      }, 1200);
  };

  const renderBookmarkList = (inputType: 'pickup' | 'dropoff') => {
    if (isBookmarkListOpenFor !== inputType) return null;
    return (
        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-cyan-700/60 rounded-lg shadow-xl z-10 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-zinc-900/50 px-4 py-2 border-b border-cyan-700/60">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Bookmarks</h4>
                <button type="button" onClick={() => setIsBookmarkListOpenFor(null)} className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors" aria-label="Close bookmarks">CLOSE</button>
            </div>
             <div className="max-h-64 overflow-y-auto">
                {bookmarkedLocations.length === 0 ? <p className="px-4 py-4 text-sm text-zinc-500">You have no saved locations.</p> : (
                    <ul role="listbox" aria-label="Bookmarked locations">
                        {bookmarkedLocations.map(bm => (
                            <li key={bm.id} className="group flex items-center justify-between text-sm text-zinc-300 hover:bg-cyan-600/20 transition-colors duration-150">
                               <div onClick={() => handleSuggestionClick(bm.address, inputType)} className="flex-grow flex items-center gap-3 px-4 py-3 cursor-pointer">
                                    <svg className="h-4 w-4 text-cyan-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate" title={bm.address}>{bm.address}</p>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); onRemoveBookmark(bm.id); }} className="p-2 mr-2 text-zinc-500 hover:text-cyan-400 flex-shrink-0" title={`Delete bookmark: ${bm.address}`}>
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
             </div>
        </div>
    )
  }
  
  const renderSuggestions = (inputType: 'pickup' | 'dropoff') => {
    if (activeInput !== inputType || isBookmarkListOpenFor) return null;

    const showBookmarks = bookmarkedLocations.length > 0;
    const showApiSuggestions = suggestions.length > 0 || isFetchingSuggestions;
    if (!showBookmarks && !showApiSuggestions) return null;


    return (
        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-cyan-700/60 rounded-lg shadow-xl z-10 overflow-hidden flex flex-col">
            <div className="max-h-64 overflow-y-auto">
                {showBookmarks && (
                    <>
                        <h4 className="px-4 pt-3 pb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Bookmarked</h4>
                        <ul role="listbox" aria-label="Bookmarked locations">
                            {bookmarkedLocations.map(bm => (
                                <li key={bm.id} className="group flex items-center justify-between text-sm text-zinc-300 hover:bg-cyan-600/20 transition-colors duration-150">
                                   <div onClick={() => handleSuggestionClick(bm.address, inputType)} className="flex-grow flex items-center gap-3 px-4 py-2 cursor-pointer">
                                        <svg className="h-4 w-4 text-cyan-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate" title={bm.address}>{bm.address}</p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onRemoveBookmark(bm.id); }} className="p-2 mr-2 text-zinc-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" title={`Delete ${bm.address}`}>
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {showBookmarks && showApiSuggestions && <hr className="border-cyan-700/60 my-1"/>}
                {showApiSuggestions && (
                     <>
                        <h4 className="px-4 pt-3 pb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Suggestions</h4>
                        {isFetchingSuggestions && suggestions.length === 0 ? (
                             <div className="px-4 py-3 text-sm text-zinc-400 flex items-center gap-3">
                                <svg className="animate-spin h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Fetching suggestions...</span>
                             </div>
                        ) : (
                            <ul role="listbox" aria-label={`Address suggestions for ${inputType}`}>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, inputType)} className="px-4 py-3 text-sm text-zinc-300 hover:bg-cyan-600/20 cursor-pointer transition-colors duration-150 flex items-center gap-3" role="option" aria-selected="false">
                                        <svg className="h-4 w-4 text-zinc-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        <span className="flex-1">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
            <div className="bg-zinc-900/50 px-4 py-2 text-right border-t border-cyan-700/60">
                <button type="button" onClick={() => setActiveInput(null)} className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors" aria-label="Close suggestions">CLOSE</button>
            </div>
        </div>
    );
  };

  const isBookmarked = (address: string) => 
    address.trim() ? bookmarkedLocations.some(bm => bm.address.trim().toLowerCase() === address.trim().toLowerCase()) : false;

  const isPickupBookmarked = isBookmarked(pickup);
  const isDropoffBookmarked = isBookmarked(dropoff);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
          <label htmlFor="pickup" className="block text-sm font-medium text-zinc-300 mb-2">Pickup Location</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            </div>
            <input
              id="pickup"
              type="text"
              value={pickup}
              onChange={(e) => handleInputChange(e, 'pickup')}
              onFocus={() => handleFocus('pickup')}
              placeholder="e.g., Airport Terminal 1"
              className="w-full bg-zinc-800/50 border border-cyan-800/50 rounded-lg py-3 pl-10 pr-28 md:pr-36 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-base"
              required
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
                <button type="button" onClick={() => handleToggleBookmarkList('pickup')} className="px-2 md:px-3 h-full text-zinc-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors" title="View bookmarked locations"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-13zM12 11.5a.5.5 0 01-.5.5h-5a.5.5 0 010-1h5a.5.5 0 01.5.5zm0-3a.5.5 0 01-.5.5h-5a.5.5 0 010-1h5a.5.5 0 01.5.5z" /></svg></button>
                <div className="h-2/3 border-l border-cyan-800/50"></div>
                <button
                  type="button"
                  onClick={() => handleBookmarkToggle(pickup)}
                  disabled={!pickup.trim() || isLoading || !!bookmarkingLocation}
                  className={`px-2 md:px-3 h-full transition-colors text-zinc-400 hover:bg-zinc-700 hover:text-cyan-400 disabled:text-zinc-600 disabled:hover:bg-transparent disabled:cursor-wait ${isPickupBookmarked ? 'text-cyan-400' : ''}`}
                  title={bookmarkingLocation === pickup ? 'Processing...' : isPickupBookmarked ? 'Remove bookmark' : 'Bookmark this location'}
                >
                  {bookmarkingLocation === pickup ? <SpinnerIcon /> : isPickupBookmarked ? <FilledStar /> : <EmptyStar />}
                </button>
                <div className="h-2/3 border-l border-cyan-800/50"></div>
                <button type="button" onClick={handleGetCurrentLocation} disabled={isFetchingLocation || isLoading} className="px-2 md:px-3 h-full text-zinc-400 rounded-r-lg hover:bg-zinc-700 hover:text-cyan-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors" title="Use my current location">
                    {isFetchingLocation ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 100 2 1 1 0 000-2zM7 9a3 3 0 116 0 3 3 0 01-6 0zM10 18a7.002 7.002 0 006.323-3.676 1 1 0 00-1.638-1.152A5.002 5.002 0 015.315 13.172a1 1 0 00-1.638 1.152A7.002 7.002 0 0010 18z"/></svg>}
                </button>
            </div>
          </div>
          {renderSuggestions('pickup')}
          {renderBookmarkList('pickup')}
        </div>
        <div className="relative">
          <label htmlFor="dropoff" className="block text-sm font-medium text-zinc-300 mb-2">Drop-off Location</label>
          <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              </div>
              <input
              id="dropoff"
              type="text"
              value={dropoff}
              onChange={(e) => handleInputChange(e, 'dropoff')}
              onFocus={() => handleFocus('dropoff')}
              placeholder="e.g., Grand Hotel Downtown"
              className="w-full bg-zinc-800/50 border border-cyan-800/50 rounded-lg py-3 pl-10 pr-20 md:pr-24 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-base"
              required
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
                <button type="button" onClick={() => handleToggleBookmarkList('dropoff')} className="px-2 md:px-3 h-full text-zinc-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors" title="View bookmarked locations"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-13zM12 11.5a.5.5 0 01-.5.5h-5a.5.5 0 010-1h5a.5.5 0 01.5.5zm0-3a.5.5 0 01-.5.5h-5a.5.5 0 010-1h5a.5.5 0 01.5.5z" /></svg></button>
                <div className="h-2/3 border-l border-cyan-800/50"></div>
                <button
                  type="button"
                  onClick={() => handleBookmarkToggle(dropoff)}
                  disabled={!dropoff.trim() || isLoading || !!bookmarkingLocation}
                  className={`px-2 md:px-3 h-full rounded-r-lg transition-colors text-zinc-400 hover:bg-zinc-700 hover:text-cyan-400 disabled:text-zinc-600 disabled:hover:bg-transparent disabled:cursor-wait ${isDropoffBookmarked ? 'text-cyan-400' : ''}`}
                  title={bookmarkingLocation === dropoff ? 'Processing...' : isDropoffBookmarked ? 'Remove bookmark' : 'Bookmark this location'}
                >
                  {bookmarkingLocation === dropoff ? <SpinnerIcon /> : isDropoffBookmarked ? <FilledStar /> : <EmptyStar />}
                </button>
            </div>
          </div>
          {renderSuggestions('dropoff')}
          {renderBookmarkList('dropoff')}
        </div>
      </div>
      <div className="relative">
        <label htmlFor="seats" className="block text-sm font-medium text-zinc-300 mb-2">Passengers</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
            <input
            id="seats"
            type="number"
            value={seats}
            onChange={(e) => onSeatsChange(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="8"
            placeholder="e.g., 2"
            className="w-full bg-zinc-800/50 border border-cyan-800/50 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-base"
            required
            />
        </div>
      </div>
      <button type="submit" disabled={isLoading || isFetchingLocation} className="w-full flex justify-center items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50">
        {isLoading ? 'Analyzing...' : 'Find Best Cabs'}
      </button>
    </form>
  );
};