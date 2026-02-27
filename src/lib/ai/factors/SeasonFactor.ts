// =============================================================
// CONCRETE CLASS — SeasonFactor (Inherits ScoringFactor)
// Demonstrates: Inheritance, Polymorphism
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { Destination } from '../types';

export class SeasonFactor extends ScoringFactor {
  constructor() {
    super('Season', 10);
  }

  evaluate(destination: Destination, travelDate: string): { score: number; reason: string } {
    const month = new Date(travelDate).getMonth() + 1;

    if (destination.bestMonths.includes(month)) {
      return { score: 10, reason: 'Traveling in peak season — ideal time to visit!' };
    }

    const adjacent = destination.bestMonths.some(m => Math.abs(m - month) <= 1 || Math.abs(m - month) >= 11);
    if (adjacent) {
      return { score: 6, reason: 'Near peak season — still a good time to visit.' };
    }

    return { score: 2, reason: 'Off-season travel — may encounter less ideal conditions but fewer crowds.' };
  }
}
