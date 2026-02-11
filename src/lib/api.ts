import { supabase } from "@/integrations/supabase/client";
import type { WeatherData, FlightOption, Destination, Interest } from "@/lib/aiEngine";
import { generateWeather, generateFlights, DESTINATIONS } from "@/lib/aiEngine";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callEdgeFunction(name: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Edge function ${name} returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Edge function "${name}" failed, using local fallback:`, err);
    return null;
  }
}

export async function fetchWeather(dest: Destination): Promise<{ data: WeatherData; source: string }> {
  const result = await callEdgeFunction("get-weather", {
    lat: dest.latitude,
    lon: dest.longitude,
    destinationId: dest.id,
  });

  if (result?.data) {
    return { data: result.data, source: result.source };
  }

  // Local fallback
  return { data: generateWeather(dest), source: "local-fallback" };
}

export async function fetchDestinations(interests: Interest[]): Promise<{ destinations: Destination[]; source: string }> {
  const result = await callEdgeFunction("get-destinations", { interests });

  if (result?.destinations) {
    const mapped: Destination[] = result.destinations.map((d: any) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      description: d.description,
      imageUrl: "",
      tags: d.tags,
      baseCost: d.baseCost,
      rating: d.rating,
      popularity: d.popularity,
      latitude: d.lat,
      longitude: d.lon,
      bestMonths: d.bestMonths,
    }));
    return { destinations: mapped, source: result.source };
  }

  // Local fallback
  return { destinations: DESTINATIONS, source: "local-fallback" };
}

export async function fetchFlights(
  destinationId: string,
  date: string,
  originCity: string
): Promise<{ flights: FlightOption[]; source: string }> {
  const result = await callEdgeFunction("get-flights", {
    destinationId,
    date,
    originCity,
  });

  if (result?.flights) {
    return { flights: result.flights, source: result.source };
  }

  // Local fallback
  return { flights: generateFlights(destinationId, date), source: "local-fallback" };
}
