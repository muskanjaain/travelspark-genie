// =============================================================
// AI ENGINE — Type Definitions
// =============================================================

export type Interest = 'adventure' | 'beach' | 'heritage' | 'nature' | 'city' | 'food' | 'nightlife' | 'wellness';

export interface TravelPreferences {
  budget: number;
  travelDate: string;
  interests: Interest[];
  originCity: string;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  tags: Interest[];
  baseCost: number;
  rating: number;
  popularity: number;
  latitude: number;
  longitude: number;
  bestMonths: number[];
  weather?: WeatherData;
}

export interface FlightOption {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  destinationId: string;
}

export interface ScoreExplanation {
  factor: string;
  score: number;
  maxScore: number;
  reason: string;
}

export interface ScoredDestination extends Destination {
  aiScore: number;
  explanations: ScoreExplanation[];
  matchedInterests: Interest[];
  budgetFit: 'excellent' | 'good' | 'stretch' | 'over';
  bestFlight?: FlightOption;
}

export interface ScoredFlight extends FlightOption {
  flightScore: number;
  flightReason: string;
}
