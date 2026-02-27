// =============================================================
// CLASS — FlightScorer
// Demonstrates: Encapsulation, single-responsibility
// =============================================================

import type { FlightOption, ScoredFlight } from './types';

/**
 * Encapsulates flight scoring logic.
 */
export class FlightScorer {
  private budget: number;

  constructor(budget: number) {
    this.budget = budget;
  }

  /**
   * Score and rank flights relative to the user's budget.
   */
  scoreFlights(flights: FlightOption[]): ScoredFlight[] {
    return flights
      .map(f => this.scoreOne(f))
      .sort((a, b) => b.flightScore - a.flightScore);
  }

  private scoreOne(flight: FlightOption): ScoredFlight {
    let score = 100;
    const reasons: string[] = [];

    const priceRatio = flight.price / this.budget;
    if (priceRatio <= 0.3) { score += 30; reasons.push('Excellent price relative to budget'); }
    else if (priceRatio <= 0.5) { score += 15; reasons.push('Reasonable flight cost'); }
    else { score -= 10; reasons.push('Flight takes significant budget share'); }

    if (flight.stops === 0) { score += 20; reasons.push('Direct flight — saves time'); }
    else if (flight.stops === 1) { score += 5; reasons.push('One stop — acceptable'); }
    else { score -= 15; reasons.push(`${flight.stops} stops — longer journey`); }

    return {
      ...flight,
      flightScore: Math.max(0, Math.min(150, score)),
      flightReason: reasons.join('. ') + '.',
    };
  }
}
