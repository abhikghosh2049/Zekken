export interface CabOption {
  provider: 'Uber' | 'Ola' | 'inDrive' | string;
  cabType: string;
  fare: number;
  eta: number;
  capacity: number;
}

export interface SearchParams {
  pickup: string;
  dropoff: string;
  seats: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CabApiResponse {
  cabs: CabOption[];
  locations: {
    pickup: Coordinates;
    dropoff: Coordinates;
  };
}

export interface BookmarkedLocation {
  id: string;
  name: string;
  address: string;
}
