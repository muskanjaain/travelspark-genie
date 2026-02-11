import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base destinations that are always available
const BASE_DESTINATIONS = [
  { id: "bali", name: "Bali", country: "Indonesia", lat: -8.34, lon: 115.09, tags: ["beach", "nature", "wellness", "adventure"], baseCost: 60, rating: 4.7, popularity: 92, bestMonths: [4,5,6,7,8,9,10], description: "Tropical paradise with stunning temples, rice terraces, and world-class surfing." },
  { id: "paris", name: "Paris", country: "France", lat: 48.85, lon: 2.35, tags: ["heritage", "food", "city"], baseCost: 180, rating: 4.8, popularity: 98, bestMonths: [4,5,6,9,10], description: "The city of lights — iconic landmarks, world-class cuisine, and rich history." },
  { id: "queenstown", name: "Queenstown", country: "New Zealand", lat: -45.03, lon: 168.66, tags: ["adventure", "nature"], baseCost: 150, rating: 4.6, popularity: 78, bestMonths: [12,1,2,3,6,7,8], description: "Adventure capital of the world — bungee jumping, skiing, and breathtaking fjords." },
  { id: "kyoto", name: "Kyoto", country: "Japan", lat: 35.01, lon: 135.77, tags: ["heritage", "nature", "food"], baseCost: 130, rating: 4.7, popularity: 88, bestMonths: [3,4,10,11], description: "Ancient temples, traditional tea houses, and stunning cherry blossoms." },
  { id: "cancun", name: "Cancún", country: "Mexico", lat: 21.16, lon: -86.85, tags: ["beach", "nightlife", "heritage", "adventure"], baseCost: 100, rating: 4.3, popularity: 85, bestMonths: [12,1,2,3,4], description: "Caribbean beaches, Mayan ruins, and vibrant nightlife." },
  { id: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.92, lon: 18.42, tags: ["nature", "adventure", "beach", "food"], baseCost: 80, rating: 4.5, popularity: 82, bestMonths: [10,11,12,1,2,3], description: "Stunning coastline, Table Mountain, vineyards, and diverse wildlife." },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.75, lon: 100.52, tags: ["food", "city", "heritage", "nightlife"], baseCost: 45, rating: 4.4, popularity: 90, bestMonths: [11,12,1,2,3], description: "Bustling street markets, ornate temples, and legendary street food." },
  { id: "iceland", name: "Reykjavik", country: "Iceland", lat: 64.13, lon: -21.90, tags: ["nature", "adventure", "wellness"], baseCost: 200, rating: 4.6, popularity: 75, bestMonths: [6,7,8,9,10,11,12,1,2], description: "Northern lights, geothermal hot springs, glaciers, and volcanic landscapes." },
  { id: "marrakech", name: "Marrakech", country: "Morocco", lat: 31.63, lon: -8.00, tags: ["heritage", "adventure", "food"], baseCost: 55, rating: 4.3, popularity: 80, bestMonths: [3,4,5,10,11], description: "Vibrant souks, palatial gardens, and Saharan desert adventures." },
  { id: "maldives", name: "Maldives", country: "Maldives", lat: 3.20, lon: 73.22, tags: ["beach", "wellness", "nature"], baseCost: 250, rating: 4.9, popularity: 88, bestMonths: [1,2,3,4,11,12], description: "Overwater villas, crystal-clear lagoons, and world-class diving." },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interests } = await req.json();
    const apiKey = Deno.env.get("OPENTRIPMAP_API_KEY");

    // Always return base destinations; enrich with OpenTripMap if key available
    let enrichedPlaces: any[] = [];

    if (apiKey && apiKey !== "placeholder") {
      try {
        // Fetch popular places for a sample of destination coordinates
        for (const dest of BASE_DESTINATIONS.slice(0, 3)) {
          const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${dest.lon}&lat=${dest.lat}&rate=3&limit=3&apikey=${apiKey}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.features) {
              enrichedPlaces.push({
                destinationId: dest.id,
                nearbyAttractions: data.features.map((f: any) => ({
                  name: f.properties?.name || "Unknown",
                  kinds: f.properties?.kinds || "",
                })).filter((a: any) => a.name !== "Unknown"),
              });
            }
          }
        }
      } catch (e) {
        console.warn("OpenTripMap enrichment failed:", e);
      }
    }

    return new Response(JSON.stringify({
      source: apiKey && apiKey !== "placeholder" ? "enriched" : "base",
      destinations: BASE_DESTINATIONS,
      nearbyAttractions: enrichedPlaces,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Destinations error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
