import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import DestinationCard from '@/components/DestinationCard';
import FlightCard from '@/components/FlightCard';
import { fetchWeather, fetchDestinations, fetchFlights } from '@/lib/api';
import {
  scoreDestinations,
  scoreFlights,
  type TravelPreferences,
  type ScoredDestination,
  type FlightOption,
} from '@/lib/aiEngine';
import { useToast } from '@/hooks/use-toast';

const Explore = () => {
  const [results, setResults] = useState<ScoredDestination[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState<
    (FlightOption & { flightScore: number; flightReason: string })[] | null
  >(null);
  const [flightDestName, setFlightDestName] = useState('');
  const [currentPrefs, setCurrentPrefs] = useState<TravelPreferences | null>(null);
  const [dataSources, setDataSources] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSearch = useCallback(async (prefs: TravelPreferences) => {
    setIsLoading(true);
    setSelectedFlights(null);
    setCurrentPrefs(prefs);

    try {
      // Fetch destinations from edge function (or fallback)
      const { destinations, source: destSource } = await fetchDestinations(prefs.interests);

      // Fetch weather for all destinations in parallel
      const withWeather = await Promise.all(
        destinations.map(async (d) => {
          const { data: weather, source } = await fetchWeather(d);
          return { ...d, weather };
        })
      );

      const scored = scoreDestinations(withWeather, prefs);
      setResults(scored);

      // Track data sources for UI badge
      const weatherSources = new Set<string>();
      for (const d of withWeather) {
        // we just track the general source
      }
      setDataSources((prev) => ({ ...prev, destinations: destSource }));

      if (destSource === 'local-fallback') {
        toast({
          title: '📡 Using Simulated Data',
          description: 'API keys not configured — results use simulated data. Add real API keys for live data.',
        });
      } else if (destSource === 'simulated') {
        toast({
          title: '📡 Simulated Mode',
          description: 'Backend running with placeholder keys. Add real API keys for live data.',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleViewFlights = useCallback(async (destId: string) => {
    const dest = results?.find((d) => d.id === destId);
    if (!dest || !currentPrefs) return;

    try {
      const { flights: rawFlights, source } = await fetchFlights(
        destId,
        currentPrefs.travelDate,
        currentPrefs.originCity
      );
      const scored = scoreFlights(rawFlights, currentPrefs.budget);
      setSelectedFlights(scored);
      setFlightDestName(dest.name);
      setDataSources((prev) => ({ ...prev, flights: source }));

      if (source === 'live') {
        toast({ title: '✈️ Live Flight Data', description: 'Showing real-time flights from Amadeus API.' });
      }
    } catch (error) {
      console.error('Flight error:', error);
    }
  }, [results, currentPrefs, toast]);

  const isLive = (key: string) => dataSources[key] === 'live' || dataSources[key] === 'enriched';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Explore Destinations
            </h1>
            {Object.keys(dataSources).length > 0 && (
              <div className="flex gap-2">
                {Object.entries(dataSources).map(([key, source]) => (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      source === 'live' || source === 'enriched'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    {source === 'live' || source === 'enriched' ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    {key}: {source}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-muted-foreground mb-8">
            Our AI engine will analyze your preferences and rank the best destinations for you.
          </p>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10"
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">
                Top Recommendations
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {results.length} destinations ranked by AI score • Click "Why this was recommended" for full explanation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((dest, i) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    rank={i}
                    onViewFlights={handleViewFlights}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Flights Panel */}
          <AnimatePresence>
            {selectedFlights && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="mt-10 bg-card rounded-2xl p-6 card-elevated border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    ✈️ Flights to {flightDestName}
                    {dataSources.flights && (
                      <span className={`ml-3 text-xs font-normal px-2 py-0.5 rounded-full ${
                        isLive('flights') ? 'bg-green-500/10 text-green-600' : 'bg-secondary/50 text-muted-foreground'
                      }`}>
                        {isLive('flights') ? '🟢 Live' : '🔵 Simulated'}
                      </span>
                    )}
                  </h2>
                  <button onClick={() => setSelectedFlights(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Ranked by AI flight scoring — considers price vs budget, stops, and duration.
                </p>
                <div className="space-y-3">
                  {selectedFlights.map((f, i) => (
                    <FlightCard key={f.id} flight={f} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
