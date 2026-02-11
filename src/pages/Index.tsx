import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Globe, Zap, Shield, Brain } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Explainable AI', desc: 'Every recommendation includes a clear reasoning breakdown.' },
  { icon: Globe, title: 'Real-Time Data', desc: 'Live weather, flights, and popularity data power decisions.' },
  { icon: Zap, title: 'Instant Results', desc: 'Heuristic scoring delivers ranked results in milliseconds.' },
  { icon: Shield, title: 'Budget-Safe', desc: 'Constraint satisfaction ensures suggestions fit your wallet.' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 card-elevated border border-border group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
