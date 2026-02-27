// =============================================================
// CONCRETE CLASS — RatingFactor (Inherits ScoringFactor)
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { Destination } from '../types';

export class RatingFactor extends ScoringFactor {
  constructor() {
    super('Rating', 10);
  }

  evaluate(destination: Destination): { score: number; reason: string } {
    const score = Math.round((destination.rating / 5) * this.maxScore);
    return { score, reason: `User rating: ${destination.rating}/5 stars.` };
  }
}
