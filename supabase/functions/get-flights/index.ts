import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// IATA codes for destinations
const DEST_IATA: Record<string, string> = {
  bali: "DPS", paris: "CDG", queenstown: "ZQN", kyoto: "KIX",
  cancun: "CUN", "cape-town": "CPT", bangkok: "BKK",
  iceland: "KEF", marrakech: "RAK", maldives: "MLE",
};

const ORIGIN_IATA: Record<string, string> = {
  "new delhi": "DEL", "mumbai": "BOM", "london": "LHR",
  "new york": "JFK", "los angeles": "LAX", "singapore": "SIN",
  "dubai": "DXB", "tokyo": "NRT", "sydney": "SYD",
};

function generateSimulatedFlights(destinationId: string, date: string) {
  const airlines = ["Emirates", "Singapore Airlines", "Qatar Airways", "Air India", "Lufthansa", "British Airways", "Thai Airways", "ANA"];
  const durations = ["4h 30m", "6h 15m", "8h 45m", "11h 20m", "14h 00m", "3h 50m", "7h 30m"];
  const seed = destinationId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const basePrice = 200 + (seed % 400);

  return Array.from({ length: 5 }, (_, i) => ({
    id: `${destinationId}-flight-${i}`,
    airline: airlines[(seed + i) % airlines.length],
    departure: `${6 + i * 3}:${i % 2 === 0 ? "00" : "30"}`,
    arrival: `${14 + i * 2}:${i % 2 === 0 ? "45" : "15"}`,
    duration: durations[(seed + i) % durations.length],
    price: Math.round(basePrice + i * 80 + Math.sin(seed + i) * 100),
    stops: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2,
    destinationId,
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destinationId, date, originCity } = await req.json();
    const apiKey = Deno.env.get("AMADEUS_API_KEY");
    const apiSecret = Deno.env.get("AMADEUS_API_SECRET");

    // Fallback to simulated
    if (!apiKey || !apiSecret || apiKey === "placeholder" || apiSecret === "placeholder") {
      console.log("No Amadeus API keys — returning simulated flights for", destinationId);
      return new Response(JSON.stringify({
        source: "simulated",
        flights: generateSimulatedFlights(destinationId, date),
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get Amadeus token
    const tokenRes = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
    });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || "Amadeus auth failed");
    }

    const destIata = DEST_IATA[destinationId] || "CDG";
    const originLower = (originCity || "new delhi").toLowerCase();
    const originIata = ORIGIN_IATA[originLower] || "DEL";
    const travelDate = date || new Date().toISOString().split("T")[0];

    const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originIata}&destinationLocationCode=${destIata}&departureDate=${travelDate}&adults=1&max=5&currencyCode=USD`;

    const flightRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const flightData = await flightRes.json();

    if (!flightRes.ok || !flightData.data) {
      console.warn("Amadeus search failed, falling back to simulated:", flightData);
      return new Response(JSON.stringify({
        source: "simulated",
        flights: generateSimulatedFlights(destinationId, date),
        warning: "Live API returned no results; showing simulated data.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const flights = flightData.data.map((offer: any, i: number) => {
      const seg = offer.itineraries[0]?.segments || [];
      const firstSeg = seg[0] || {};
      const lastSeg = seg[seg.length - 1] || {};
      return {
        id: offer.id || `live-${i}`,
        airline: firstSeg.carrierCode || "Unknown",
        departure: firstSeg.departure?.at?.slice(11, 16) || "N/A",
        arrival: lastSeg.arrival?.at?.slice(11, 16) || "N/A",
        duration: offer.itineraries[0]?.duration?.replace("PT", "").toLowerCase() || "N/A",
        price: parseFloat(offer.price?.total || "0"),
        stops: Math.max(0, seg.length - 1),
        destinationId,
      };
    });

    return new Response(JSON.stringify({
      source: "live",
      flights,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Flight error:", error);
    return new Response(JSON.stringify({ error: error.message, source: "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
