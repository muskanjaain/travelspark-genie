// =============================================================
// MAIN CLASS — RecommendationEngine (Composition + Polymorphism)
// Demonstrates: Encapsulation, Abstraction, Polymorphism via
// polymorphic ScoringFactor array, and Composition
// =============================================================

import { ScoringFactor } from './ScoringFactor';
import { InterestFactor } from './factors/InterestFactor';
import { BudgetFactor } from './factors/BudgetFactor';
import { WeatherFactor } from './factors/WeatherFactor';
import { SeasonFactor } from './factors/SeasonFactor';
import { PopularityFactor } from './factors/PopularityFactor';
import { RatingFactor } from './factors/RatingFactor';
import type {
  Destination,
  TravelPreferences,
  ScoredDestination,
  ScoreExplanation,
  Interest,
} from './types';

/**
 * Core recommendation engine — uses polymorphic scoring factors.
 * Encapsulates the scoring pipeline and factor composition.
 */
export class RecommendationEngine {
  // Encapsulation: private factor instances
  private interestFactor: InterestFactor;
  private budgetFactor: BudgetFactor;
  private weatherFactor: WeatherFactor;
  private seasonFactor: SeasonFactor;
  private popularityFactor: PopularityFactor;
  private ratingFactor: RatingFactor;

  // Polymorphism: all factors stored as base class array
  private factors: ScoringFactor[];

  constructor() {
    this.interestFactor = new InterestFactor();
    this.budgetFactor = new BudgetFactor();
    this.weatherFactor = new WeatherFactor();
    this.seasonFactor = new SeasonFactor();
    this.popularityFactor = new PopularityFactor();
    this.ratingFactor = new RatingFactor();

    this.factors = [
      this.interestFactor,
      this.budgetFactor,
      this.weatherFactor,
      this.seasonFactor,
      this.popularityFactor,
      this.ratingFactor,
    ];
  }

  /**
   * Get total maximum possible score (sum of all factor weights).
   */
  get totalMaxScore(): number {
    return this.factors.reduce((sum, f) => sum + f.maxScore, 0);
  }

  /**
   * Score and rank destinations based on user preferences.
   * This is the main public API — abstracts away the internal scoring pipeline.
   */
  scoreDestinations(destinations: Destination[], preferences: TravelPreferences): ScoredDestination[] {
    const scored = destinations.map(dest => this.scoreOne(dest, preferences));
    return scored.sort((a, b) => b.aiScore - a.aiScore);
  }

  /**
   * Score a single destination (encapsulated internal logic).
   */
  private scoreOne(dest: Destination, prefs: TravelPreferences): ScoredDestination {
    const explanations: ScoreExplanation[] = [];

    // Each factor is evaluated polymorphically with its specific args
    const interestResult = this.interestFactor.evaluate(dest, prefs.interests);
    explanations.push(this.interestFactor.toExplanation(dest, prefs.interests));

    const budgetResult = this.budgetFactor.evaluate(dest, prefs.budget);
    explanations.push(this.budgetFactor.toExplanation(dest, prefs.budget));

    explanations.push(this.weatherFactor.toExplanation(dest.weather, prefs.interests));
    explanations.push(this.seasonFactor.toExplanation(dest, prefs.travelDate));
    explanations.push(this.popularityFactor.toExplanation(dest));
    explanations.push(this.ratingFactor.toExplanation(dest));

    const totalScore = explanations.reduce((sum, e) => sum + e.score, 0);

    return {
      ...dest,
      aiScore: totalScore,
      explanations,
      matchedInterests: interestResult.extra?.matched ?? [],
      budgetFit: budgetResult.extra?.fit ?? 'good',
    };
  }
}
