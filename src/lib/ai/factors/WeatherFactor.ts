// =============================================================
// CONCRETE CLASS — WeatherFactor (Inherits ScoringFactor)
// Demonstrates: Inheritance, Polymorphism, Encapsulation
// =============================================================

import { ScoringFactor } from '../ScoringFactor';
import type { WeatherData, Interest } from '../types';

export class WeatherFactor extends ScoringFactor {
  constructor() {
    super('Weather', 15);
  }

  evaluate(weather: WeatherData | undefined, interests: Interest[]): { score: number; reason: string } {
    if (!weather) return { score: 7, reason: 'Weather data unavailable; neutral score applied.' };

    const temp = weather.temp;
    const desc = weather.description.toLowerCase();

    if (interests.includes('beach')) {
      if (temp >= 25 && temp <= 35 && !desc.includes('rain')) {
        return { score: 15, reason: `Perfect beach weather at ${temp}°C with ${weather.description}.` };
      }
      if (temp >= 20 && temp < 25) {
        return { score: 10, reason: `Warm enough for beach at ${temp}°C, though not ideal.` };
      }
      return { score: 3, reason: `${temp}°C is not ideal for beach activities.` };
    }

    if (interests.includes('adventure')) {
      if (temp >= 10 && temp <= 28) {
        return { score: 14, reason: `Great adventure weather at ${temp}°C — comfortable for outdoor activities.` };
      }
      return { score: 6, reason: `${temp}°C may be challenging for outdoor adventures.` };
    }

    if (temp >= 18 && temp <= 30 && !desc.includes('storm')) {
      return { score: 13, reason: `Pleasant ${temp}°C weather — ${weather.description}.` };
    }
    if (temp < 5 || temp > 40) {
      return { score: 2, reason: `Extreme temperature of ${temp}°C may affect enjoyment.` };
    }
    return { score: 8, reason: `Moderate conditions at ${temp}°C — ${weather.description}.` };
  }
}
