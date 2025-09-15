const axios = require('axios');

class PlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.baseUrl = 'https://places.googleapis.com/v1';
    
    if (!this.apiKey) {
      console.warn('WARNING: GOOGLE_PLACES_API_KEY not set. API calls will fail.');
    }
  }

  async searchPlaces(query, location = null, radius = 5000, categories = [], maxResults = 20) {
    try {
      const url = `${this.baseUrl}/places:searchText`;
      
      const requestBody = {
        textQuery: query,
        maxResultCount: Math.min(maxResults, 20), // API limit
        ...(location && {
          locationBias: {
            circle: {
              center: {
                latitude: location.lat,
                longitude: location.lng
              },
              radius: radius
            }
          }
        })
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': this.getFieldMask(),
          'Content-Type': 'application/json'
        }
      });

      let places = response.data.places || [];
      
      // Enrich places with detailed information
      const enrichedPlaces = await Promise.all(
        places.slice(0, Math.min(places.length, maxResults)).map(async (place) => {
          try {
            const detailedPlace = await this.getPlaceDetails(place.id);
            return detailedPlace;
          } catch (error) {
            console.warn(`Failed to get details for place ${place.id}:`, error.message);
            return this.transformPlaceData(place); // Return basic data if detailed fetch fails
          }
        })
      );

      // Filter by categories if specified (after enrichment)
      let finalPlaces = enrichedPlaces;
      if (categories.length > 0) {
        finalPlaces = enrichedPlaces.filter(place => 
          place.types && place.types.some(type => 
            categories.some(cat => 
              type.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(type.toLowerCase())
            )
          )
        );
      }

      return finalPlaces;
    } catch (error) {
      if (error.response) {
        console.error('Places API Error:', error.response.data);
        throw new Error(`Places API error: ${error.response.data.error?.message || 'Unknown error'}`);
      }
      throw error;
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const url = `${this.baseUrl}/places/${placeId}`;
      
      const response = await axios.get(url, {
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': this.getDetailedFieldMask()
        }
      });

      return this.transformPlaceData(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Place Details API Error:', error.response.data);
        throw new Error(`Place Details API error: ${error.response.data.error?.message || 'Unknown error'}`);
      }
      throw error;
    }
  }

  getFieldMask() {
    return [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.rating',
      'places.userRatingCount',
      'places.types',
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',
      'places.websiteUri',
      'places.googleMapsUri',
      'places.businessStatus',
      'places.priceLevel',
      'places.primaryType'
    ].join(',');
  }

  getDetailedFieldMask() {
    return [
      'id',
      'displayName',
      'formattedAddress',
      'location',
      'rating',
      'userRatingCount',
      'types',
      'nationalPhoneNumber',
      'internationalPhoneNumber',
      'websiteUri',
      'googleMapsUri',
      'businessStatus',
      'priceLevel',
      'primaryType',
      'regularOpeningHours',
      'photos',
      'reviews',
      'addressComponents'
    ].join(',');
  }

  transformPlaceData(place) {
    return {
      id: place.id,
      placeId: place.id,
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || 'Address not available',
      location: place.location ? {
        lat: place.location.latitude,
        lng: place.location.longitude
      } : null,
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      types: place.types || [],
      primaryType: place.primaryType,
      phone: place.nationalPhoneNumber || place.internationalPhoneNumber || null,
      website: place.websiteUri || null,
      googleMapsUrl: place.googleMapsUri || null,
      businessStatus: place.businessStatus || 'OPERATIONAL',
      priceLevel: place.priceLevel || null,
      openingHours: place.regularOpeningHours?.weekdayDescriptions || null,
      photos: place.photos ? place.photos.slice(0, 5).map(photo => ({
        name: photo.name,
        widthPx: photo.widthPx,
        heightPx: photo.heightPx
      })) : [],
      reviews: place.reviews ? place.reviews.slice(0, 5).map(review => ({
        rating: review.rating,
        text: review.text?.text || '',
        time: review.publishTime,
        authorName: review.authorAttribution?.displayName || 'Anonymous'
      })) : []
    };
  }
}

module.exports = new PlacesService();