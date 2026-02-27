// =============================================================
// DESTINATION DATA — Static dataset
// =============================================================

import type { Destination } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'bali', name: 'Bali', country: 'Indonesia',
    description: 'Tropical paradise with stunning temples, rice terraces, and world-class surfing.',
    imageUrl: '', tags: ['beach', 'nature', 'wellness', 'adventure'],
    baseCost: 60, rating: 4.7, popularity: 92, latitude: -8.34, longitude: 115.09,
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'paris', name: 'Paris', country: 'France',
    description: 'The city of lights — iconic landmarks, world-class cuisine, and rich history.',
    imageUrl: '', tags: ['heritage', 'food', 'city'],
    baseCost: 180, rating: 4.8, popularity: 98, latitude: 48.85, longitude: 2.35,
    bestMonths: [4, 5, 6, 9, 10],
  },
  {
    id: 'queenstown', name: 'Queenstown', country: 'New Zealand',
    description: 'Adventure capital of the world — bungee jumping, skiing, and breathtaking fjords.',
    imageUrl: '', tags: ['adventure', 'nature'],
    baseCost: 150, rating: 4.6, popularity: 78, latitude: -45.03, longitude: 168.66,
    bestMonths: [12, 1, 2, 3, 6, 7, 8],
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan',
    description: 'Ancient temples, traditional tea houses, and stunning cherry blossoms.',
    imageUrl: '', tags: ['heritage', 'nature', 'food'],
    baseCost: 130, rating: 4.7, popularity: 88, latitude: 35.01, longitude: 135.77,
    bestMonths: [3, 4, 10, 11],
  },
  {
    id: 'cancun', name: 'Cancún', country: 'Mexico',
    description: 'Caribbean beaches, Mayan ruins, and vibrant nightlife.',
    imageUrl: '', tags: ['beach', 'nightlife', 'heritage', 'adventure'],
    baseCost: 100, rating: 4.3, popularity: 85, latitude: 21.16, longitude: -86.85,
    bestMonths: [12, 1, 2, 3, 4],
  },
  {
    id: 'cape-town', name: 'Cape Town', country: 'South Africa',
    description: 'Stunning coastline, Table Mountain, vineyards, and diverse wildlife.',
    imageUrl: '', tags: ['nature', 'adventure', 'beach', 'food'],
    baseCost: 80, rating: 4.5, popularity: 82, latitude: -33.92, longitude: 18.42,
    bestMonths: [10, 11, 12, 1, 2, 3],
  },
  {
    id: 'bangkok', name: 'Bangkok', country: 'Thailand',
    description: 'Bustling street markets, ornate temples, and legendary street food.',
    imageUrl: '', tags: ['food', 'city', 'heritage', 'nightlife'],
    baseCost: 45, rating: 4.4, popularity: 90, latitude: 13.75, longitude: 100.52,
    bestMonths: [11, 12, 1, 2, 3],
  },
  {
    id: 'iceland', name: 'Reykjavik', country: 'Iceland',
    description: 'Northern lights, geothermal hot springs, glaciers, and volcanic landscapes.',
    imageUrl: '', tags: ['nature', 'adventure', 'wellness'],
    baseCost: 200, rating: 4.6, popularity: 75, latitude: 64.13, longitude: -21.90,
    bestMonths: [6, 7, 8, 9, 10, 11, 12, 1, 2],
  },
  {
    id: 'marrakech', name: 'Marrakech', country: 'Morocco',
    description: 'Vibrant souks, palatial gardens, and Saharan desert adventures.',
    imageUrl: '', tags: ['heritage', 'adventure', 'food'],
    baseCost: 55, rating: 4.3, popularity: 80, latitude: 31.63, longitude: -8.00,
    bestMonths: [3, 4, 5, 10, 11],
  },
  {
    id: 'maldives', name: 'Maldives', country: 'Maldives',
    description: 'Overwater villas, crystal-clear lagoons, and world-class diving.',
    imageUrl: '', tags: ['beach', 'wellness', 'nature'],
    baseCost: 250, rating: 4.9, popularity: 88, latitude: 3.20, longitude: 73.22,
    bestMonths: [1, 2, 3, 4, 11, 12],
  },
];
