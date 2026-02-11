import { motion } from 'framer-motion';
import { Star, Thermometer, Wind, Droplets, ChevronDown, ChevronUp, Brain, Plane } from 'lucide-react';
import { useState } from 'react';
import type { ScoredDestination, ScoreExplanation } from '@/lib/aiEngine';

interface DestinationCardProps {
  destination: ScoredDestination;
  rank: number;
  onViewFlights: (destId: string) => void;
}

const getScoreClass = (score: number) => {
  if (score >= 70) return 'score-excellent';
  if (score >= 45) return 'score-good';
  return 'score-average';
};

const getBudgetLabel = (fit: ScoredDestination['budgetFit']) => {
  switch (fit) {
    case 'excellent': return { text: 'Great Value', cls: 'score-excellent' };
    case 'good': return { text: 'Within Budget', cls: 'score-good' };
    case 'stretch': return { text: 'Slight Stretch', cls: 'score-average' };
    case 'over': return { text: 'Over Budget', cls: 'bg-destructive/10 text-destructive' };
  }
};

const DEST_IMAGES: Record<string, string> = {
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
  queenstown: 'https://images.unsplash.com/photo-1589871973318-9ca1258faa7d?w=600&h=400&fit=crop',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
  cancun: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&h=400&fit=crop',
  'cape-town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop',
  iceland: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&h=400&fit=crop',
  marrakech: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
};

const DestinationCard = ({ destination, rank, onViewFlights }: DestinationCardProps) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const budgetInfo = getBudgetLabel(destination.budgetFit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-card rounded-2xl overflow-hidden card-elevated border border-border"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={DEST_IMAGES[destination.id] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-foreground/80 text-background text-xs font-bold">
            #{rank + 1}
          </span>
          <span className={`score-badge ${getScoreClass(destination.aiScore)}`}>
            <Brain className="w-3 h-3" />
            AI Score: {destination.aiScore}/100
          </span>
        </div>
        {destination.weather && (
          <div className="absolute top-3 right-3 glass-panel rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
            <span className="text-base">{destination.weather.icon}</span>
            <span className="text-foreground">{destination.weather.temp}°C</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">{destination.name}</h3>
            <p className="text-sm text-muted-foreground">{destination.country}</p>
          </div>
          <div className="flex items-center gap-1 text-secondary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">{destination.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{destination.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {destination.matchedInterests.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
              {tag}
            </span>
          ))}
          <span className={`score-badge text-xs ${budgetInfo.cls}`}>{budgetInfo.text}</span>
        </div>

        {/* Weather details */}
        {destination.weather && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 py-2 border-t border-border">
            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{destination.weather.temp}°C</span>
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{destination.weather.humidity}%</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{destination.weather.windSpeed} km/h</span>
            <span className="ml-auto">{destination.weather.description}</span>
          </div>
        )}

        {/* AI Explanation Toggle */}
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-primary hover:text-primary/80 transition"
        >
          <span className="flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            Why this was recommended
          </span>
          {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 pt-2"
          >
            {destination.explanations.map((exp, i) => (
              <ExplanationRow key={i} explanation={exp} />
            ))}
          </motion.div>
        )}

        {/* View Flights */}
        <button
          onClick={() => onViewFlights(destination.id)}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plane className="w-4 h-4" />
          View Flights
        </button>
      </div>
    </motion.div>
  );
};

const ExplanationRow = ({ explanation }: { explanation: ScoreExplanation }) => {
  const pct = (explanation.score / explanation.maxScore) * 100;
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-semibold text-foreground">{explanation.factor}</span>
        <span className="text-muted-foreground">{explanation.score}/{explanation.maxScore}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{explanation.reason}</p>
    </div>
  );
};

export default DestinationCard;
