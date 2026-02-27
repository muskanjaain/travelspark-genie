// =============================================================
// CONCRETE CLASS — PopularityFactor (Inherits ScoringFactor)
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { Destination } from '../types';

export class PopularityFactor extends ScoringFactor {
  constructor() {
    super('Popularity', 10);
  }

  evaluate(destination: Destination): { score: number; reason: string } {
    const score = Math.round((destination.popularity / 100) * this.maxScore);
    return { score, reason: `Popularity index: ${destination.popularity}/100.` };
  }
}
