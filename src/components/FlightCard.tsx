import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight, Brain } from 'lucide-react';
import type { FlightOption } from '@/lib/aiEngine';

interface FlightCardProps {
  flight: FlightOption & { flightScore: number; flightReason: string };
  index: number;
}

const FlightCard = ({ flight, index }: FlightCardProps) => {
  const scoreClass = flight.flightScore >= 120 ? 'score-excellent' : flight.flightScore >= 90 ? 'score-good' : 'score-average';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-xl p-4 card-elevated border border-border flex flex-col md:flex-row items-start md:items-center gap-4"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Plane className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{flight.airline}</p>
          <p className="text-xs text-muted-foreground">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm flex-1">
        <span className="font-medium text-foreground">{flight.departure}</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <div className="w-8 h-px bg-border" />
          <Clock className="w-3 h-3" />
          <span className="text-xs">{flight.duration}</span>
          <div className="w-8 h-px bg-border" />
        </div>
        <span className="font-medium text-foreground">{flight.arrival}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className={`score-badge ${scoreClass}`}>
          <Brain className="w-3 h-3" />
          {flight.flightScore}
        </span>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">${flight.price}</p>
          <p className="text-xs text-muted-foreground max-w-[160px]">{flight.flightReason}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
