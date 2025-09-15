import React from 'react';
import { PlaceResult } from '../types';

interface PlaceCardProps {
  place: PlaceResult;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const formatPriceLevel = (priceLevel: string | null) => {
    if (!priceLevel) return null;
    switch (priceLevel) {
      case 'PRICE_LEVEL_INEXPENSIVE': return '$';
      case 'PRICE_LEVEL_MODERATE': return '$$';
      case 'PRICE_LEVEL_EXPENSIVE': return '$$$';
      case 'PRICE_LEVEL_VERY_EXPENSIVE': return '$$$$';
      default: return priceLevel;
    }
  };

  const formatBusinessStatus = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'Open';
      case 'CLOSED_TEMPORARILY': return 'Temporarily Closed';
      case 'CLOSED_PERMANENTLY': return 'Permanently Closed';
      default: return status;
    }
  };

  const getPrimaryType = () => {
    return place.primaryType || place.types[0] || 'Business';
  };

  return (
    <div className="place-card">
      <div className="place-card-header">
        <div className="place-info">
          <h3 className="place-name">{place.name}</h3>
          <div className="place-meta">
            <span className="place-type">{getPrimaryType().replace(/_/g, ' ')}</span>
            {formatPriceLevel(place.priceLevel) && (
              <span className="price-level">{formatPriceLevel(place.priceLevel)}</span>
            )}
          </div>
        </div>
        
        {place.rating > 0 && (
          <div className="rating-section">
            <div className="rating-stars">
              {'★'.repeat(Math.round(place.rating))}
              {'☆'.repeat(5 - Math.round(place.rating))}
            </div>
            <div className="rating-text">
              <span className="rating-value">{place.rating.toFixed(1)}</span>
              <span className="review-count">({place.userRatingCount})</span>
            </div>
          </div>
        )}
      </div>

      <div className="place-card-body">
        <div className="place-address">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          <span>{place.address}</span>
        </div>

        {place.phone && (
          <div className="place-phone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
            </svg>
            <span>{place.phone}</span>
          </div>
        )}

        <div className="place-status">
          <span className={`status-badge ${place.businessStatus.toLowerCase()}`}>
            {formatBusinessStatus(place.businessStatus)}
          </span>
        </div>

        {place.openingHours && place.openingHours.length > 0 && (
          <div className="opening-hours">
            <h4>Opening Hours</h4>
            <div className="hours-list">
              {place.openingHours.slice(0, 3).map((hours, index) => (
                <div key={index} className="hours-item">{hours}</div>
              ))}
              {place.openingHours.length > 3 && (
                <div className="hours-more">+{place.openingHours.length - 3} more</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="place-card-footer">
        {place.website && (
          <a 
            href={place.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="action-button website"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Website
          </a>
        )}
        
        {place.googleMapsUrl && (
          <a 
            href={place.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="action-button maps"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
            View on Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;