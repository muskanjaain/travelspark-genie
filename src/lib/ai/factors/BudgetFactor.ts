// =============================================================
// CONCRETE CLASS — BudgetFactor (Inherits ScoringFactor)
// Demonstrates: Inheritance, Polymorphism, Encapsulation
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { Destination, ScoredDestination } from '../types';

export class BudgetFactor extends ScoringFactor {
  private _defaultDays: number;

  constructor(defaultDays: number = 5) {
    super('Budget Fit', 25);
    this._defaultDays = defaultDays;
  }

  evaluate(destination: Destination, budget: number): { score: number; reason: string; extra: { fit: ScoredDestination['budgetFit'] } } {
    const estimatedTotal = destination.baseCost * this._defaultDays;
    const ratio = budget / estimatedTotal;

    if (ratio >= 1.5) {
      return { score: 25, reason: `Well within budget — estimated $${estimatedTotal} for ${this._defaultDays} days vs your $${budget} budget.`, extra: { fit: 'excellent' } };
    }
    if (ratio >= 1.0) {
      return { score: 20, reason: `Fits your budget — estimated $${estimatedTotal} for ${this._defaultDays} days.`, extra: { fit: 'good' } };
    }
    if (ratio >= 0.7) {
      return { score: 10, reason: `Slightly over budget at ~$${estimatedTotal}, but manageable with savings.`, extra: { fit: 'stretch' } };
    }
    return { score: 3, reason: `Estimated $${estimatedTotal} significantly exceeds your $${budget} budget.`, extra: { fit: 'over' } };
  }
}
