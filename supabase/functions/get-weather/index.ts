import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, destinationId } = await req.json();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

    // If no API key, return simulated weather
    if (!apiKey || apiKey === "placeholder") {
      console.log("No OpenWeather API key — returning simulated weather for", destinationId);
      const conditions = ["Clear sky", "Partly cloudy", "Light rain", "Sunny", "Overcast", "Scattered clouds", "Warm and humid"];
      const seed = (lat || 0) * 100 + (lon || 0);
      const baseTemp = Math.abs(lat) < 25 ? 28 : Math.abs(lat) < 45 ? 18 : 8;
      const variation = Math.sin(seed) * 8;

      return new Response(JSON.stringify({
        source: "simulated",
        data: {
          temp: Math.round(baseTemp + variation),
          description: conditions[Math.abs(Math.round(seed)) % conditions.length],
          icon: baseTemp > 22 ? "☀️" : baseTemp > 10 ? "⛅" : "❄️",
          humidity: 40 + Math.abs(Math.round(Math.sin(seed) * 40)),
          windSpeed: 5 + Math.abs(Math.round(Math.cos(seed) * 15)),
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Real API call
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "OpenWeather API error");
    }

    return new Response(JSON.stringify({
      source: "live",
      data: {
        temp: Math.round(json.main.temp),
        description: json.weather?.[0]?.description || "Unknown",
        icon: json.main.temp > 22 ? "☀️" : json.main.temp > 10 ? "⛅" : "❄️",
        humidity: json.main.humidity,
        windSpeed: Math.round(json.wind.speed * 3.6),
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Weather error:", error);
    return new Response(JSON.stringify({ error: error.message, source: "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
