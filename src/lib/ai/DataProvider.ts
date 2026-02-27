// =============================================================
// CLASS — DataProvider (Encapsulates simulated data generation)
// =============================================================

import type { Destination, WeatherData, FlightOption } from './types';
import { DESTINATIONS } from './destinations';

export class DataProvider {
  /**
   * Get all built-in destinations.
   */
  static getDestinations(): Destination[] {
    return [...DESTINATIONS];
  }

  /**
   * Generate simulated weather for a destination.
   */
  static generateWeather(dest: Destination): WeatherData {
    const conditions = ['Clear sky', 'Partly cloudy', 'Light rain', 'Sunny', 'Overcast', 'Scattered clouds', 'Warm and humid'];
    const seed = dest.latitude * 100 + dest.longitude;
    const baseTemp = Math.abs(dest.latitude) < 25 ? 28 : Math.abs(dest.latitude) < 45 ? 18 : 8;
    const variation = Math.sin(seed) * 8;

    return {
      temp: Math.round(baseTemp + variation),
      description: conditions[Math.abs(Math.round(seed)) % conditions.length],
      icon: baseTemp > 22 ? '☀️' : baseTemp > 10 ? '⛅' : '❄️',
      humidity: 40 + Math.abs(Math.round(Math.sin(seed) * 40)),
      windSpeed: 5 + Math.abs(Math.round(Math.cos(seed) * 15)),
    };
  }

  /**
   * Generate simulated flights for a destination.
   */
  static generateFlights(destinationId: string, _date: string): FlightOption[] {
    const airlines = ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'Air India', 'Lufthansa', 'British Airways', 'Thai Airways', 'ANA'];
    const durations = ['4h 30m', '6h 15m', '8h 45m', '11h 20m', '14h 00m', '3h 50m', '7h 30m'];
    const seed = destinationId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const basePrice = 200 + (seed % 400);

    return Array.from({ length: 5 }, (_, i) => ({
      id: `${destinationId}-flight-${i}`,
      airline: airlines[(seed + i) % airlines.length],
      departure: `${6 + (i * 3)}:${i % 2 === 0 ? '00' : '30'}`,
      arrival: `${14 + (i * 2)}:${i % 2 === 0 ? '45' : '15'}`,
      duration: durations[(seed + i) % durations.length],
      price: Math.round(basePrice + (i * 80) + (Math.sin(seed + i) * 100)),
      stops: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2,
      destinationId,
    }));
  }
}
