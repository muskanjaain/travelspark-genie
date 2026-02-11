import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, DollarSign, Calendar, MapPin, Compass } from 'lucide-react';
import type { Interest, TravelPreferences } from '@/lib/aiEngine';

const INTEREST_OPTIONS: { value: Interest; label: string; emoji: string }[] = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'city', label: 'City', emoji: '🌆' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🎉' },
  { value: 'wellness', label: 'Wellness', emoji: '🧘' },
];

interface SearchFormProps {
  onSearch: (prefs: TravelPreferences) => void;
  isLoading?: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [budget, setBudget] = useState(1500);
  const [travelDate, setTravelDate] = useState('');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [originCity, setOriginCity] = useState('New Delhi');

  const toggleInterest = (interest: Interest) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      budget,
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      interests,
      originCity,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl p-6 md:p-8 card-elevated border border-border"
    >
      <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
        <Compass className="w-6 h-6 text-primary" />
        Tell Us Your Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            From
          </label>
          <input
            type="text"
            value={originCity}
            onChange={e => setOriginCity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Your city"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
            Budget (USD)
          </label>
          <input
            type="range"
            min={200}
            max={10000}
            step={100}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full accent-primary mt-2"
          />
          <span className="text-lg font-bold text-foreground">${budget.toLocaleString()}</span>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />
            Travel Date
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={e => setTravelDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block">Your Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleInterest(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                interests.includes(opt.value)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Search className="w-5 h-5" />
            Find My Perfect Destinations
          </>
        )}
      </button>
    </motion.form>
  );
};

export default SearchForm;
