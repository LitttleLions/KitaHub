
 import { supabase } from "@/integrations/supabase/client";
 import { Company } from "@/types/company";
 import { MatchingCriteria, MatchingResult } from "@/types/matching";
 // import { toast } from "@/hooks/use-toast"; // Commented out: Server-side code shouldn't use UI hooks
 import { mapToCompany } from "./company/companyMapper";

 // Helper function to calculate distance between two locations (simplified for demo)
const calculateDistance = (location1: string, location2: string): number => {
  // This is a simplified version. In a real app, you would use geocoding and calculate actual distances
  if (location1.toLowerCase().includes(location2.toLowerCase()) || 
      location2.toLowerCase().includes(location1.toLowerCase())) {
    return 0;
  }
  
  // Random distance for demo purposes between 1 and 15 km
  return Math.floor(Math.random() * 15) + 1;
};

// Calculate matching score based on criteria weightage
const calculateMatchingScore = (
  company: Company, 
  criteria: MatchingCriteria
): number => {
  let score = 0;
  const weights = criteria.priorityFactor || {
    location: 0.4,
    concept: 0.3,
    additionalOffers: 0.2,
    careType: 0.1
  };
  const maxScore = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  // Location score (weighted by distance - closer is better)
  const distance = calculateDistance(company.location || "", criteria.location);
  const locationScore = distance <= 5 ? weights.location : weights.location * (1 - distance / 20);
  score += locationScore;
  
  // Pedagogical concept score
  if (company.special_pedagogy) {
    const conceptMatches = criteria.pedagogicalConcepts.some(concept => 
      company.special_pedagogy?.toLowerCase().includes(concept.toLowerCase())
    );
    if (conceptMatches) {
      score += weights.concept;
    }
  }
  
  // Additional offers score (from benefits or certifications)
  const companyOfferings = [
    ...(company.benefits || []),
    ...(company.certifications || [])
  ].map(item => typeof item === 'string' ? item.toLowerCase() : '');
  
  const matchingOfferings = criteria.additionalOffers.filter(offer => 
    companyOfferings.some(item => item.includes(offer.toLowerCase()))
  );
  
  const additionalOffersScore = matchingOfferings.length > 0 
    ? weights.additionalOffers * (matchingOfferings.length / criteria.additionalOffers.length)
    : 0;
  score += additionalOffersScore;
  
  // Care type score (simplified match)
  score += weights.careType * 0.5; // Assuming partial match by default
  
  // Normalize score to percentage
  return Math.round((score / maxScore) * 100);
};

export const findMatchingKitas = async (
  criteria: MatchingCriteria
): Promise<MatchingResult[]> => {
  try {
    // Fetch companies with location filter if provided
    let query = supabase.from('companies').select('*');
    
    if (criteria.location) {
      // Try to match location or just fetch all and filter later
      query = query.or(`location.ilike.%${criteria.location}%,bundesland.ilike.%${criteria.location}%`);
    }
    
    const { data, error } = await query;
    
     if (error) {
       console.error("Error fetching companies for matching:", error);
       // toast({ // Commented out: Cannot show toast from server-side service
       //   title: "Fehler beim Matching",
       //   description: "Es ist ein Fehler beim Suchen passender Kitas aufgetreten.",
       //   variant: "destructive",
       // });
       // Throw error instead or return empty array? Returning empty for now.
       return [];
     }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map to Company objects
    const companies = data.map(item => mapToCompany(item));
    
    // Calculate matching scores and sort by score
    const results: MatchingResult[] = companies.map(company => {
      const matchingScore = calculateMatchingScore(company, criteria);
      const distance = calculateDistance(company.location || "", criteria.location);
      
      return {
        companyId: company.id,
        name: company.name,
        matchingScore,
        isPremium: company.is_premium,
        logoUrl: company.logo_url || undefined,
        location: company.location || "",
        distance,
        pedagogicalConcept: company.special_pedagogy,
        careTypes: ["halbtags", "ganztags"].filter(() => Math.random() > 0.3), // Simplified for demo
        additionalOffers: Array.isArray(company.benefits) 
          ? company.benefits.filter(b => typeof b === 'string').slice(0, 3)
          : []
      };
    });
    
    // Sort results: premium first, then by matching score
    return results.sort((a, b) => {
      // If both are premium or both are not premium, sort by matching score
      if (a.isPremium === b.isPremium) {
        return b.matchingScore - a.matchingScore;
      }
      // Premium entries come first
      return a.isPremium ? -1 : 1;
    });
    
  } catch (error) {
    console.error("Unexpected error during matching:", error);
    return [];
  }
};

// Favorites management - using localStorage for simplicity
const FAVORITES_KEY = 'kita_favorites';

export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = (id: string): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = (id: string): void => {
  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(fav => fav !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const isFavorite = (id: string): boolean => {
  try {
    const favorites = getFavorites();
    return favorites.includes(id);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};
