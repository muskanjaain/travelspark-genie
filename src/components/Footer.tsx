import { Plane } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          <span className="text-lg font-display font-bold text-background">
            Voyager<span className="text-primary">AI</span>
          </span>
        </div>
        <p className="text-sm text-background/50">
          Smart Travel Recommendations • AI-Powered • Rule-Based Reasoning
        </p>
        <p className="text-xs text-background/30">
          © 2026 VoyagerAI — College Major Project
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
