// =============================================================
// CONCRETE CLASS — InterestFactor (Inherits ScoringFactor)
// Demonstrates: Inheritance, Polymorphism, Encapsulation
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { Destination, Interest } from '../types';

export class InterestFactor extends ScoringFactor {
  constructor() {
    super('Interest Match', 30);
  }

  /**
   * Polymorphic override — scores how well destination tags match user interests.
   */
  evaluate(destination: Destination, interests: Interest[]): { score: number; reason: string; extra: { matched: Interest[] } } {
    if (interests.length === 0) {
      return { score: 15, reason: 'No specific interests provided; general recommendation.', extra: { matched: [] } };
    }

    const matched = interests.filter(i => destination.tags.includes(i));
    const ratio = matched.length / interests.length;
    const score = Math.round(ratio * this.maxScore);

    let reason: string;
    if (ratio >= 0.8) {
      reason = `Excellent match! Covers ${matched.join(', ')} — aligns with ${Math.round(ratio * 100)}% of your interests.`;
    } else if (ratio >= 0.5) {
      reason = `Good match for ${matched.join(', ')}. Partially meets your preferences.`;
    } else if (ratio > 0) {
      reason = `Limited match: only covers ${matched.join(', ')}.`;
    } else {
      reason = 'Does not match your selected interests.';
    }

    return { score, reason, extra: { matched } };
  }
}
