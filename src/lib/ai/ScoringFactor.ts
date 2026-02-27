// =============================================================
// ABSTRACT BASE CLASS — ScoringFactor (Abstraction + Polymorphism)
// Demonstrates: Abstraction, Encapsulation, Polymorphism
// =============================================================

import type { ScoreExplanation } from './types';

/**
 * Abstract base class for all scoring factors.
 * Uses the Template Method pattern — subclasses implement `evaluate()`.
 * Encapsulates weight and provides a common interface.
 */
export abstract class ScoringFactor {
  // Encapsulation: private fields with public getters
  private _name: string;
  private _maxScore: number;

  constructor(name: string, maxScore: number) {
    this._name = name;
    this._maxScore = maxScore;
  }

  get name(): string {
    return this._name;
  }

  get maxScore(): number {
    return this._maxScore;
  }

  /**
   * Abstract method — must be implemented by subclasses (Polymorphism).
   * Each factor evaluates differently but returns the same shape.
   */
  abstract evaluate(...args: any[]): { score: number; reason: string; extra?: Record<string, any> };

  /**
   * Template method — wraps evaluate() into a ScoreExplanation.
   */
  toExplanation(...args: any[]): ScoreExplanation {
    const result = this.evaluate(...args);
    return {
      factor: this._name,
      score: Math.min(result.score, this._maxScore),
      maxScore: this._maxScore,
      reason: result.reason,
    };
  }
}
