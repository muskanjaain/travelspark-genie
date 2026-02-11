import { motion } from 'framer-motion';
import { Search, Brain, BarChart3, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Set Preferences', desc: 'Choose your budget, travel dates, and interests.' },
  { icon: Brain, title: 'AI Analysis', desc: 'Rule-based engine scores destinations using real-time data.' },
  { icon: BarChart3, title: 'Smart Ranking', desc: 'Heuristic scoring ranks every option with explanations.' },
  { icon: CheckCircle, title: 'Book With Confidence', desc: 'See exactly WHY each destination was recommended.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          How <span className="text-primary">VoyagerAI</span> Works
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          No black-box ML — every recommendation is transparent and explainable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-2xl p-6 text-center card-elevated border border-border"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">
              {i + 1}
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
