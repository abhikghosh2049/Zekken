import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FilterControls } from './components/FilterControls';
import { FareFilter } from './components/FareFilter';
import { SortControls } from './components/SortControls';
import { RecentSearches } from './components/RecentSearches';
import { fetchCabOptions } from './services/geminiService';
import type { CabOption, SearchParams, Coordinates, BookmarkedLocation } from './types';

type SortOrder = 'fare-asc' | 'fare-desc';

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_STORAGE_KEY = 'zekkenRecentSearches';
const BOOKMARKS_STORAGE_KEY = 'zekkenBookmarkedLocations';

const App: React.FC = () => {
  const [cabOptions, setCabOptions] = useState<CabOption[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<{ pickup: Coordinates; dropoff: Coordinates; } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('fare-asc');

  const [fareRange, setFareRange] = useState<{ min: number; max: number } | null>(null);
  const [currentFareFilter, setCurrentFareFilter] = useState<{ min: number; max: number } | null>(null);

  const [recentSearches, setRecentSearches] = useState<SearchParams[]>([]);
  const [bookmarkedLocations, setBookmarkedLocations] = useState<BookmarkedLocation[]>([]);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [seats, setSeats] = useState(1);
  const [searchFormKey, setSearchFormKey] = useState(Date.now());

  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) setBookmarkedLocations(JSON.parse(storedBookmarks));
    } catch (error) {
      console.error("Could not load data from local storage:", error);
    }
  }, []);

  const handleSearch = useCallback(async ({ pickup, dropoff, seats }: SearchParams) => {
    if (!pickup || !dropoff) {
      setError("Please enter both pickup and drop-off locations.");
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setCabOptions([]);
    setRouteCoordinates(null);
    setActiveFilter('All');
    setSortOrder('fare-asc');
    setFareRange(null);
    setCurrentFareFilter(null);

    try {
      const { cabs, locations } = await fetchCabOptions(pickup, dropoff, seats);

      // Sanitize the data from the API to prevent rendering crashes
      const validCabs = cabs.filter(cab => 
        cab &&
        typeof cab.provider === 'string' &&
        typeof cab.cabType === 'string' &&
        typeof cab.fare === 'number' &&
        typeof cab.eta === 'number' &&
        typeof cab.capacity === 'number'
      );

      setCabOptions(validCabs);
      setRouteCoordinates(locations);

      if (validCabs.length > 0) {
        const fares = validCabs.map(c => c.fare);
        const minFare = Math.floor(Math.min(...fares));
        const maxFare = Math.ceil(Math.max(...fares));
        const initialRange = { min: minFare, max: maxFare };
        setFareRange(initialRange);
        setCurrentFareFilter(initialRange);

        const newSearch: SearchParams = { pickup, dropoff, seats };
        setRecentSearches(prevSearches => {
          const filtered = prevSearches.filter(s => !(s.pickup.trim().toLowerCase() === newSearch.pickup.trim().toLowerCase() && s.dropoff.trim().toLowerCase() === newSearch.dropoff.trim().toLowerCase() && s.seats === newSearch.seats));
          const updatedSearches = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
          localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updatedSearches));
          return updatedSearches;
        });
      }
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't fetch cab details. The AI might be busy, or the locations are invalid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleAddBookmark = (name: string, address: string) => {
    setBookmarkedLocations(prev => {
      const addressLower = address.trim().toLowerCase();
      const existingBookmarkIndex = prev.findIndex(bm => bm.address.trim().toLowerCase() === addressLower);

      let updatedBookmarks;

      if (existingBookmarkIndex !== -1) {
        // Address exists, update its name
        updatedBookmarks = [...prev];
        const existingBookmark = updatedBookmarks[existingBookmarkIndex];
        updatedBookmarks[existingBookmarkIndex] = { ...existingBookmark, name };
      } else {
        // Address is new, add it to the start of the list
        const newBookmark: BookmarkedLocation = { id: Date.now().toString(), name, address };
        updatedBookmarks = [newBookmark, ...prev];
      }
      
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };
  
  const handleRemoveBookmark = (id: string) => {
      setBookmarkedLocations(prev => {
          const updated = prev.filter(bm => bm.id !== id);
          localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
          return updated;
      });
  };

  const handleFilterChange = (filter: string) => setActiveFilter(filter);
  const handleSortChange = (newSortOrder: SortOrder) => setSortOrder(newSortOrder);
  const handleFareChange = (newRange: { min: number; max: number }) => setCurrentFareFilter(newRange);
  
  const handleRecentSearchSelect = (search: SearchParams) => {
    setPickup(search.pickup);
    setDropoff(search.dropoff);
    setSeats(search.seats);
    setSearchFormKey(Date.now()); // Remounts the form with new initial values
    // Automatically trigger a new search
    handleSearch(search);
  };

  const uniqueCabTypes = [...new Set(cabOptions.map(option => option.cabType))].sort();
  
  const filteredCabOptions = cabOptions.filter(option => {
    const typeMatch = activeFilter === 'All' || option.cabType === activeFilter;
    const fareMatch = currentFareFilter
      ? option.fare >= currentFareFilter.min && option.fare <= currentFareFilter.max
      : true;
    const capacityMatch = option.capacity >= seats;
    return typeMatch && fareMatch && capacityMatch;
  });

  const sortedAndFilteredCabOptions = [...filteredCabOptions].sort((a, b) => {
    if (sortOrder === 'fare-asc') return a.fare - b.fare;
    return b.fare - a.fare;
  });

  return (
    <div className="min-h-screen font-sans text-zinc-200">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-8">
          <div className="max-w-2xl mx-auto bg-zinc-900/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-zinc-800/80">
            <SearchForm
              key={searchFormKey}
              onSearch={handleSearch}
              isLoading={isLoading}
              pickup={pickup}
              dropoff={dropoff}
              seats={seats}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
              onSeatsChange={setSeats}
              bookmarkedLocations={bookmarkedLocations}
              onAddBookmark={handleAddBookmark}
              onRemoveBookmark={handleRemoveBookmark}
            />
          </div>

          {recentSearches.length > 0 && !isLoading && !hasSearched && (
            <div className="max-w-2xl mx-auto mt-6">
              <RecentSearches searches={recentSearches} onSelect={handleRecentSearchSelect} />
            </div>
          )}

          <div className="mt-12">
            {!isLoading && !error && cabOptions.length > 0 && (
              <div className="max-w-4xl mx-auto bg-black/40 rounded-xl p-6 mb-8 border border-zinc-800 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-zinc-300">Refine Your Search</h3>
                   <FilterControls 
                    cabTypes={uniqueCabTypes}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                 <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 border-t border-zinc-800 pt-6">
                  <div>
                    <h3 className="text-base font-semibold mb-3 text-zinc-300">Filter by Fare Range</h3>
                     {fareRange && currentFareFilter && (
                      <FareFilter
                        min={fareRange.min}
                        max={fareRange.max}
                        currentMin={currentFareFilter.min}
                        currentMax={currentFareFilter.max}
                        onFareChange={handleFareChange}
                      />
                    )}
                   </div>
                   <div>
                    <h3 className="text-base font-semibold mb-3 text-zinc-300">Sort by Fare</h3>
                     <SortControls
                        activeSort={sortOrder}
                        onSortChange={handleSortChange}
                      />
                   </div>
                </div>
              </div>
            )}
            <ResultsDisplay
              cabOptions={sortedAndFilteredCabOptions}
              totalCabCount={cabOptions.length}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
              routeCoordinates={routeCoordinates}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
