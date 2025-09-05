import React, { useState, useEffect } from 'react';
import type { CabOption, Coordinates } from '../types';
import { PROVIDER_LOGOS, CAB_TYPE_ICONS, PERSON_ICON } from '../constants';

interface CabCardProps {
  option: CabOption;
  routeCoordinates: { pickup: Coordinates; dropoff: Coordinates } | null;
  preferredCabType: string | null;
  onSetPreferred: (cabType: string) => void;
}

const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
        case 'uber':
            return 'bg-black';
        case 'ola':
            return 'bg-green-500';
        case 'indrive':
            return 'bg-lime-500';
        default:
            return 'bg-zinc-500';
    }
}

const generateBookingLink = (provider: string, coordinates: { pickup: Coordinates; dropoff: Coordinates } | null): string | null => {
  if (!coordinates) {
    return null; // Can't generate a link without coordinates
  }
  const { dropoff } = coordinates;
  switch (provider.toLowerCase()) {
    case 'uber':
      return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${dropoff.latitude}&dropoff[longitude]=${dropoff.longitude}`;
    case 'ola':
      return `https://book.olacabs.com/?drop_lat=${dropoff.latitude}&drop_lng=${dropoff.longitude}`;
    case 'indrive':
      return null; // Direct booking link is not reliably available
    default:
      return null; // No link for unknown providers
  }
};


export const CabCard: React.FC<CabCardProps> = ({ option, routeCoordinates, preferredCabType, onSetPreferred }) => {
  const [displayedEta, setDisplayedEta] = useState(option.eta);
  const [etaKey, setEtaKey] = useState(0);

  useEffect(() => {
    // Reset state if the card's data changes to ensure UI is always in sync with props
    setDisplayedEta(option.eta);
    setEtaKey(k => k + 1);

    const intervalId = setInterval(() => {
      setDisplayedEta(prevEta => {
        // Fluctuate between the base ETA and one minute higher. This creates a subtle "live" feel.
        // A minimum ETA of 1 is ensured to avoid showing 0.
        const baseEta = Math.max(1, option.eta);
        const newEta = prevEta === baseEta ? baseEta + 1 : baseEta;
        
        // Changing the key forces React to re-mount the span, re-triggering the CSS animation
        setEtaKey(k => k + 1);
        return newEta;
      });
    }, 1800 + Math.random() * 800); // Random interval between 1.8s and 2.6s to desynchronize cards

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [option.eta]);

  let bookingLink: string | null = null;
  let isBookable = false;

  try {
    bookingLink = generateBookingLink(option.provider, routeCoordinates);
    isBookable = !!bookingLink;
  } catch (error) {
    console.error("An unexpected error occurred while generating the booking link:", error);
    // isBookable remains false, bookingLink remains null, so the button will be disabled.
  }

  const cabTypeIcon = CAB_TYPE_ICONS[option.cabType] || CAB_TYPE_ICONS['Default'];
  const isPreferred = option.cabType === preferredCabType;

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

  return (
    <div className={`bg-zinc-800/70 rounded-xl shadow-lg overflow-hidden border transition-all duration-300 transform hover:-translate-y-2 group ${isPreferred ? 'border-cyan-400/80 shadow-cyan-400/20 hover:shadow-2xl hover:shadow-cyan-400/30' : 'border-blue-800/60 hover:shadow-2xl hover:shadow-blue-900/50'}`}>
       <div className={`h-2 ${getProviderColor(option.provider)} transition-all duration-300 group-hover:h-3`}></div>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            {PROVIDER_LOGOS[option.provider] || null}
            {option.provider}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" title={`Capacity: ${option.capacity} passengers`}>
                {PERSON_ICON}
                {option.capacity}
            </span>
            <div className="flex items-center gap-1.5 bg-zinc-700 rounded-full pl-2.5 pr-1.5 py-0.5">
                <span className="text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                    {cabTypeIcon}
                    {option.cabType}
                </span>
                <button
                    onClick={() => onSetPreferred(option.cabType)}
                    className={`p-1 rounded-full transition-colors duration-200 ${isPreferred ? 'text-cyan-400' : 'text-zinc-500 hover:bg-zinc-600/50 hover:text-cyan-400'}`}
                    title={isPreferred ? `Unmark '${option.cabType}' as preferred` : `Mark '${option.cabType}' as preferred`}
                    aria-label={isPreferred ? 'Unmark as preferred' : 'Mark as preferred'}
                >
                    {isPreferred ? <FilledStar/> : <EmptyStar/>}
                </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-around items-center text-center my-4 sm:my-6">
            <div title="This is the estimated cost for your ride.">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400">
                    ₹{option.fare.toFixed(0)}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Estimated Fare</p>
            </div>
             <div title="Estimated time for the cab to reach your pickup location.">
                <p className="text-3xl sm:text-4xl font-extrabold text-zinc-200">
                    <span key={etaKey} className="inline-block animate-eta-flicker">
                      {displayedEta}
                    </span>
                    <span className="text-xl sm:text-2xl text-zinc-400 ml-1">min</span>
                </p>
                <p className="text-sm text-zinc-400 mt-1">ETA</p>
            </div>
        </div>

        <a
          href={isBookable ? bookingLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full block text-center font-bold py-2.5 px-4 rounded-lg transition duration-300 ${
            isBookable
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg'
              : 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
          }`}
          aria-disabled={!isBookable}
          onClick={(e) => !isBookable && e.preventDefault()}
          title={isBookable ? `Book on ${option.provider}` : `Direct booking for ${option.provider} is not supported.`}
          aria-label={`Book a ${option.cabType} with ${option.provider}`}
        >
          Book Now
        </a>
      </div>
    </div>
  );
};