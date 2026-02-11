import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import DestinationCard from '@/components/DestinationCard';
import FlightCard from '@/components/FlightCard';
import {
  scoreDestinations,
  scoreFlights,
  generateFlights,
  generateWeather,
  DESTINATIONS,
  type TravelPreferences,
  type ScoredDestination,
  type FlightOption,
} from '@/lib/aiEngine';

const Explore = () => {
  const [results, setResults] = useState<ScoredDestination[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState<
    (FlightOption & { flightScore: number; flightReason: string })[] | null
  >(null);
  const [flightDestName, setFlightDestName] = useState('');
  const [currentPrefs, setCurrentPrefs] = useState<TravelPreferences | null>(null);

  const handleSearch = useCallback((prefs: TravelPreferences) => {
    setIsLoading(true);
    setSelectedFlights(null);
    setCurrentPrefs(prefs);

    // Simulate API delay for realism
    setTimeout(() => {
      // Attach simulated weather to each destination
      const withWeather = DESTINATIONS.map(d => ({
        ...d,
        weather: generateWeather(d),
      }));

      const scored = scoreDestinations(withWeather, prefs);
      setResults(scored);
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleViewFlights = useCallback((destId: string) => {
    const dest = results?.find(d => d.id === destId);
    if (!dest || !currentPrefs) return;

    const rawFlights = generateFlights(destId, currentPrefs.travelDate);
    const scored = scoreFlights(rawFlights, currentPrefs.budget);
    setSelectedFlights(scored);
    setFlightDestName(dest.name);
  }, [results, currentPrefs]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Explore Destinations
          </h1>
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
