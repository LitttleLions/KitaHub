
export interface MatchingCriteria {
  location: string;
  childAge: number;
  careType: 'halbtags' | 'ganztags' | 'flexibel';
  pedagogicalConcepts: string[];
  additionalOffers: string[];
  startDate: string;
  priorityFactor?: {
    location: number;
    concept: number;
    additionalOffers: number;
    careType: number;
  };
}

export interface MatchingResult {
  companyId: string;
  name: string;
  matchingScore: number;
  isPremium: boolean;
  logoUrl?: string;
  location: string;
  distance?: number;
  pedagogicalConcept?: string;
  careTypes: string[];
  additionalOffers: string[];
}

export interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
