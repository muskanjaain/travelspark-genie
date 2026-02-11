// =============================================================
// AI TRAVEL RECOMMENDATION ENGINE
// Rule-based reasoning, heuristic scoring, constraint satisfaction
// =============================================================

export type Interest = 'adventure' | 'beach' | 'heritage' | 'nature' | 'city' | 'food' | 'nightlife' | 'wellness';

export interface TravelPreferences {
  budget: number; // in USD
  travelDate: string; // ISO date
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
  baseCost: number; // estimated daily cost in USD
  rating: number; // 1-5
  popularity: number; // 0-100
  latitude: number;
  longitude: number;
  bestMonths: number[]; // 1-12
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

export interface ScoredDestination extends Destination {
  aiScore: number;
  explanations: ScoreExplanation[];
  matchedInterests: Interest[];
  budgetFit: 'excellent' | 'good' | 'stretch' | 'over';
  bestFlight?: FlightOption;
}

export interface ScoreExplanation {
  factor: string;
  score: number;
  maxScore: number;
  reason: string;
}

// ---- SCORING WEIGHTS (Constraint Satisfaction) ----
const WEIGHTS = {
  INTEREST_MATCH: 30,
  BUDGET_FIT: 25,
  WEATHER_SUITABILITY: 15,
  SEASON_MATCH: 10,
  POPULARITY: 10,
  RATING: 10,
};

// ---- RULE-BASED WEATHER SCORING ----
function scoreWeather(weather: WeatherData | undefined, interests: Interest[]): { score: number; reason: string } {
  if (!weather) return { score: 7, reason: "Weather data unavailable; neutral score applied." };
  
  const temp = weather.temp;
  const desc = weather.description.toLowerCase();
  
  // Beach lovers want warm & sunny
  if (interests.includes('beach')) {
    if (temp >= 25 && temp <= 35 && !desc.includes('rain')) {
      return { score: 15, reason: `Perfect beach weather at ${temp}°C with ${weather.description}.` };
    }
    if (temp >= 20 && temp < 25) {
      return { score: 10, reason: `Warm enough for beach at ${temp}°C, though not ideal.` };
    }
    return { score: 3, reason: `${temp}°C is not ideal for beach activities.` };
  }
  
  // Adventure prefers mild temps
  if (interests.includes('adventure')) {
    if (temp >= 10 && temp <= 28) {
      return { score: 14, reason: `Great adventure weather at ${temp}°C — comfortable for outdoor activities.` };
    }
    return { score: 6, reason: `${temp}°C may be challenging for outdoor adventures.` };
  }
  
  // General comfort
  if (temp >= 18 && temp <= 30 && !desc.includes('storm')) {
    return { score: 13, reason: `Pleasant ${temp}°C weather — ${weather.description}.` };
  }
  if (temp < 5 || temp > 40) {
    return { score: 2, reason: `Extreme temperature of ${temp}°C may affect enjoyment.` };
  }
  return { score: 8, reason: `Moderate conditions at ${temp}°C — ${weather.description}.` };
}

// ---- INTEREST MATCHING (Heuristic) ----
function scoreInterests(destination: Destination, interests: Interest[]): { score: number; matched: Interest[]; reason: string } {
  if (interests.length === 0) return { score: 15, matched: [], reason: "No specific interests provided; general recommendation." };
  
  const matched = interests.filter(i => destination.tags.includes(i));
  const ratio = matched.length / interests.length;
  const score = Math.round(ratio * WEIGHTS.INTEREST_MATCH);
  
  if (ratio >= 0.8) {
    return { score, matched, reason: `Excellent match! Covers ${matched.join(', ')} — aligns with ${Math.round(ratio * 100)}% of your interests.` };
  }
  if (ratio >= 0.5) {
    return { score, matched, reason: `Good match for ${matched.join(', ')}. Partially meets your preferences.` };
  }
  if (ratio > 0) {
    return { score, matched, reason: `Limited match: only covers ${matched.join(', ')}.` };
  }
  return { score: 0, matched: [], reason: "Does not match your selected interests." };
}

// ---- BUDGET CONSTRAINT ----
function scoreBudget(destination: Destination, budget: number, days: number = 5): { score: number; fit: ScoredDestination['budgetFit']; reason: string } {
  const estimatedTotal = destination.baseCost * days;
  const ratio = budget / estimatedTotal;
  
  if (ratio >= 1.5) {
    return { score: 25, fit: 'excellent', reason: `Well within budget — estimated $${estimatedTotal} for ${days} days vs your $${budget} budget.` };
  }
  if (ratio >= 1.0) {
    return { score: 20, fit: 'good', reason: `Fits your budget — estimated $${estimatedTotal} for ${days} days.` };
  }
  if (ratio >= 0.7) {
    return { score: 10, fit: 'stretch', reason: `Slightly over budget at ~$${estimatedTotal}, but manageable with savings.` };
  }
  return { score: 3, fit: 'over', reason: `Estimated $${estimatedTotal} significantly exceeds your $${budget} budget.` };
}

// ---- SEASONAL MATCH ----
function scoreSeason(destination: Destination, travelDate: string): { score: number; reason: string } {
  const month = new Date(travelDate).getMonth() + 1;
  if (destination.bestMonths.includes(month)) {
    return { score: 10, reason: `Traveling in peak season — ideal time to visit!` };
  }
  // Adjacent months
  const adjacent = destination.bestMonths.some(m => Math.abs(m - month) <= 1 || Math.abs(m - month) >= 11);
  if (adjacent) {
    return { score: 6, reason: `Near peak season — still a good time to visit.` };
  }
  return { score: 2, reason: `Off-season travel — may encounter less ideal conditions but fewer crowds.` };
}

// ---- MAIN SCORING FUNCTION ----
export function scoreDestinations(
  destinations: Destination[],
  preferences: TravelPreferences
): ScoredDestination[] {
  const scored = destinations.map(dest => {
    const explanations: ScoreExplanation[] = [];
    
    // 1. Interest matching
    const interestResult = scoreInterests(dest, preferences.interests);
    explanations.push({ factor: 'Interest Match', score: interestResult.score, maxScore: WEIGHTS.INTEREST_MATCH, reason: interestResult.reason });
    
    // 2. Budget fit
    const budgetResult = scoreBudget(dest, preferences.budget);
    explanations.push({ factor: 'Budget Fit', score: budgetResult.score, maxScore: WEIGHTS.BUDGET_FIT, reason: budgetResult.reason });
    
    // 3. Weather
    const weatherResult = scoreWeather(dest.weather, preferences.interests);
    explanations.push({ factor: 'Weather', score: weatherResult.score, maxScore: WEIGHTS.WEATHER_SUITABILITY, reason: weatherResult.reason });
    
    // 4. Season
    const seasonResult = scoreSeason(dest, preferences.travelDate);
    explanations.push({ factor: 'Season', score: seasonResult.score, maxScore: WEIGHTS.SEASON_MATCH, reason: seasonResult.reason });
    
    // 5. Popularity
    const popScore = Math.round((dest.popularity / 100) * WEIGHTS.POPULARITY);
    explanations.push({ factor: 'Popularity', score: popScore, maxScore: WEIGHTS.POPULARITY, reason: `Popularity index: ${dest.popularity}/100.` });
    
    // 6. Rating
    const ratingScore = Math.round((dest.rating / 5) * WEIGHTS.RATING);
    explanations.push({ factor: 'Rating', score: ratingScore, maxScore: WEIGHTS.RATING, reason: `User rating: ${dest.rating}/5 stars.` });
    
    const totalScore = explanations.reduce((sum, e) => sum + e.score, 0);
    
    return {
      ...dest,
      aiScore: totalScore,
      explanations,
      matchedInterests: interestResult.matched,
      budgetFit: budgetResult.fit,
    } as ScoredDestination;
  });
  
  // Sort by AI score descending
  return scored.sort((a, b) => b.aiScore - a.aiScore);
}

// ---- FLIGHT SCORING ----
export function scoreFlights(flights: FlightOption[], budget: number): (FlightOption & { flightScore: number; flightReason: string })[] {
  return flights
    .map(f => {
      let score = 100;
      const reasons: string[] = [];
      
      // Price factor (40% weight)
      const priceRatio = f.price / budget;
      if (priceRatio <= 0.3) { score += 30; reasons.push('Excellent price relative to budget'); }
      else if (priceRatio <= 0.5) { score += 15; reasons.push('Reasonable flight cost'); }
      else { score -= 10; reasons.push('Flight takes significant budget share'); }
      
      // Stops penalty
      if (f.stops === 0) { score += 20; reasons.push('Direct flight — saves time'); }
      else if (f.stops === 1) { score += 5; reasons.push('One stop — acceptable'); }
      else { score -= 15; reasons.push(`${f.stops} stops — longer journey`); }
      
      return { ...f, flightScore: Math.max(0, Math.min(150, score)), flightReason: reasons.join('. ') + '.' };
    })
    .sort((a, b) => b.flightScore - a.flightScore);
}

// ---- SIMULATED DESTINATION DATA ----
export const DESTINATIONS: Destination[] = [
  {
    id: 'bali', name: 'Bali', country: 'Indonesia',
    description: 'Tropical paradise with stunning temples, rice terraces, and world-class surfing.',
    imageUrl: '', tags: ['beach', 'nature', 'wellness', 'adventure'],
    baseCost: 60, rating: 4.7, popularity: 92, latitude: -8.34, longitude: 115.09,
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'paris', name: 'Paris', country: 'France',
    description: 'The city of lights — iconic landmarks, world-class cuisine, and rich history.',
    imageUrl: '', tags: ['heritage', 'food', 'city'],
    baseCost: 180, rating: 4.8, popularity: 98, latitude: 48.85, longitude: 2.35,
    bestMonths: [4, 5, 6, 9, 10],
  },
  {
    id: 'queenstown', name: 'Queenstown', country: 'New Zealand',
    description: 'Adventure capital of the world — bungee jumping, skiing, and breathtaking fjords.',
    imageUrl: '', tags: ['adventure', 'nature'],
    baseCost: 150, rating: 4.6, popularity: 78, latitude: -45.03, longitude: 168.66,
    bestMonths: [12, 1, 2, 3, 6, 7, 8],
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan',
    description: 'Ancient temples, traditional tea houses, and stunning cherry blossoms.',
    imageUrl: '', tags: ['heritage', 'nature', 'food'],
    baseCost: 130, rating: 4.7, popularity: 88, latitude: 35.01, longitude: 135.77,
    bestMonths: [3, 4, 10, 11],
  },
  {
    id: 'cancun', name: 'Cancún', country: 'Mexico',
    description: 'Caribbean beaches, Mayan ruins, and vibrant nightlife.',
    imageUrl: '', tags: ['beach', 'nightlife', 'heritage', 'adventure'],
    baseCost: 100, rating: 4.3, popularity: 85, latitude: 21.16, longitude: -86.85,
    bestMonths: [12, 1, 2, 3, 4],
  },
  {
    id: 'cape-town', name: 'Cape Town', country: 'South Africa',
    description: 'Stunning coastline, Table Mountain, vineyards, and diverse wildlife.',
    imageUrl: '', tags: ['nature', 'adventure', 'beach', 'food'],
    baseCost: 80, rating: 4.5, popularity: 82, latitude: -33.92, longitude: 18.42,
    bestMonths: [10, 11, 12, 1, 2, 3],
  },
  {
    id: 'bangkok', name: 'Bangkok', country: 'Thailand',
    description: 'Bustling street markets, ornate temples, and legendary street food.',
    imageUrl: '', tags: ['food', 'city', 'heritage', 'nightlife'],
    baseCost: 45, rating: 4.4, popularity: 90, latitude: 13.75, longitude: 100.52,
    bestMonths: [11, 12, 1, 2, 3],
  },
  {
    id: 'iceland', name: 'Reykjavik', country: 'Iceland',
    description: 'Northern lights, geothermal hot springs, glaciers, and volcanic landscapes.',
    imageUrl: '', tags: ['nature', 'adventure', 'wellness'],
    baseCost: 200, rating: 4.6, popularity: 75, latitude: 64.13, longitude: -21.90,
    bestMonths: [6, 7, 8, 9, 10, 11, 12, 1, 2],
  },
  {
    id: 'marrakech', name: 'Marrakech', country: 'Morocco',
    description: 'Vibrant souks, palatial gardens, and Saharan desert adventures.',
    imageUrl: '', tags: ['heritage', 'adventure', 'food'],
    baseCost: 55, rating: 4.3, popularity: 80, latitude: 31.63, longitude: -8.00,
    bestMonths: [3, 4, 5, 10, 11],
  },
  {
    id: 'maldives', name: 'Maldives', country: 'Maldives',
    description: 'Overwater villas, crystal-clear lagoons, and world-class diving.',
    imageUrl: '', tags: ['beach', 'wellness', 'nature'],
    baseCost: 250, rating: 4.9, popularity: 88, latitude: 3.20, longitude: 73.22,
    bestMonths: [1, 2, 3, 4, 11, 12],
  },
];

// ---- SIMULATED FLIGHT DATA ----
export function generateFlights(destinationId: string, date: string): FlightOption[] {
  const airlines = ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'Air India', 'Lufthansa', 'British Airways', 'Thai Airways', 'ANA'];
  const durations = ['4h 30m', '6h 15m', '8h 45m', '11h 20m', '14h 00m', '3h 50m', '7h 30m'];
  
  const seed = destinationId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const basePrice = 200 + (seed % 400);
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${destinationId}-flight-${i}`,
    airline: airlines[(seed + i) % airlines.length],
    departure: `${6 + (i * 3)}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${14 + (i * 2)}:${i % 2 === 0 ? '45' : '15'}`,
    duration: durations[(seed + i) % durations.length],
    price: Math.round(basePrice + (i * 80) + (Math.sin(seed + i) * 100)),
    stops: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2,
    destinationId,
  }));
}

// ---- SIMULATED WEATHER DATA ----
export function generateWeather(dest: Destination): WeatherData {
  const conditions = ['Clear sky', 'Partly cloudy', 'Light rain', 'Sunny', 'Overcast', 'Scattered clouds', 'Warm and humid'];
  const seed = dest.latitude * 100 + dest.longitude;
  const baseTemp = Math.abs(dest.latitude) < 25 ? 28 : Math.abs(dest.latitude) < 45 ? 18 : 8;
  const variation = Math.sin(seed) * 8;
  
  return {
    temp: Math.round(baseTemp + variation),
    description: conditions[Math.abs(Math.round(seed)) % conditions.length],
    icon: baseTemp > 22 ? '☀️' : baseTemp > 10 ? '⛅' : '❄️',
    humidity: 40 + Math.abs(Math.round(Math.sin(seed) * 40)),
    windSpeed: 5 + Math.abs(Math.round(Math.cos(seed) * 15)),
  };
}
