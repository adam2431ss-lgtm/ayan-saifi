export interface PlaceResult {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  rating: number;
  userRatingCount: number;
  types: string[];
  primaryType: string;
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  businessStatus: string;
  priceLevel: string | null;
  openingHours: string[] | null;
  photos: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  reviews: Array<{
    rating: number;
    text: string;
    time: string;
    authorName: string;
  }>;
}

export interface SearchFilters {
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
  categories?: string[];
  maxResults?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  query?: string;
  location?: any;
  error?: string;
}