// =============================================================
// AI ENGINE — Public API (re-exports for backward compatibility)
// =============================================================

// Classes
export { RecommendationEngine } from './RecommendationEngine';
export { FlightScorer } from './FlightScorer';
export { DataProvider } from './DataProvider';
export { ScoringFactor } from './ScoringFactor';

// Factor classes (for extensibility / viva demo)
export { InterestFactor } from './factors/InterestFactor';
export { BudgetFactor } from './factors/BudgetFactor';
export { WeatherFactor } from './factors/WeatherFactor';
export { SeasonFactor } from './factors/SeasonFactor';
export { PopularityFactor } from './factors/PopularityFactor';
export { RatingFactor } from './factors/RatingFactor';

// Types
export type {
  Interest,
  TravelPreferences,
  WeatherData,
  Destination,
  FlightOption,
  ScoredDestination,
  ScoredFlight,
  ScoreExplanation,
} from './types';

// Destination data
export { DESTINATIONS } from './destinations';

// ---- Convenience functions (backward-compatible wrappers) ----
import { RecommendationEngine } from './RecommendationEngine';
import { FlightScorer } from './FlightScorer';
import { DataProvider } from './DataProvider';
import type { Destination, TravelPreferences, ScoredDestination, FlightOption, ScoredFlight } from './types';

const _engine = new RecommendationEngine();

export function scoreDestinations(destinations: Destination[], preferences: TravelPreferences): ScoredDestination[] {
  return _engine.scoreDestinations(destinations, preferences);
}

export function scoreFlights(flights: FlightOption[], budget: number): ScoredFlight[] {
  const scorer = new FlightScorer(budget);
  return scorer.scoreFlights(flights);
}

export function generateFlights(destinationId: string, date: string): FlightOption[] {
  return DataProvider.generateFlights(destinationId, date);
}

export function generateWeather(dest: Destination) {
  return DataProvider.generateWeather(dest);
}
