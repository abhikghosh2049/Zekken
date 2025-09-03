import React from 'react';
import type { CabOption, Coordinates } from '../types';
import { PROVIDER_LOGOS, CAB_TYPE_ICONS, PERSON_ICON } from '../constants';

interface CabCardProps {
  option: CabOption;
  routeCoordinates: { pickup: Coordinates; dropoff: Coordinates } | null;
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

const generateBookingLink = (provider: string, coordinates: { pickup: Coordinates; dropoff: Coordinates } | null): string => {
  if (!coordinates) {
    return '#'; // Fallback if coordinates are not available
  }
  const { dropoff } = coordinates;
  switch (provider.toLowerCase()) {
    case 'uber':
      return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${dropoff.latitude}&dropoff[longitude]=${dropoff.longitude}`;
    case 'ola':
      return `https://book.olacabs.com/?drop_lat=${dropoff.latitude}&drop_lng=${dropoff.longitude}`;
    case 'indrive':
      return 'https://indrive.com/'; // Generic link as their booking URL is not standardized
    default:
      return '#';
  }
};


export const CabCard: React.FC<CabCardProps> = ({ option, routeCoordinates }) => {
  const bookingLink = generateBookingLink(option.provider, routeCoordinates);
  const isBookable = bookingLink !== '#';
  const cabTypeIcon = CAB_TYPE_ICONS[option.cabType] || CAB_TYPE_ICONS['Default'];

  return (
    <div className="bg-zinc-800/70 rounded-xl shadow-lg overflow-hidden border border-zinc-700 transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/50 group">
       <div className={`h-2 ${getProviderColor(option.provider)} transition-all duration-300 group-hover:h-3`}></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            {PROVIDER_LOGOS[option.provider] || null}
            {option.provider}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" title={`Capacity: ${option.capacity} passengers`}>
                {PERSON_ICON}
                {option.capacity}
            </span>
            <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                {cabTypeIcon}
                {option.cabType}
            </span>
          </div>
        </div>
        
        <div className="flex justify-around items-center text-center my-6">
            <div title="This is the estimated cost for your ride.">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">
                    ₹{option.fare.toFixed(0)}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Estimated Fare</p>
            </div>
             <div title="Estimated time for the cab to reach your pickup location.">
                <p className="text-4xl font-extrabold text-zinc-200">
                    {option.eta}<span className="text-2xl text-zinc-400 ml-1">min</span>
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
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg'
              : 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
          }`}
          aria-disabled={!isBookable}
          onClick={(e) => !isBookable && e.preventDefault()}
          title={isBookable ? `Book on ${option.provider}` : 'Booking not available for this provider'}
          aria-label={`Book a ${option.cabType} with ${option.provider}`}
        >
          Book Now
        </a>
      </div>
    </div>
  );
};