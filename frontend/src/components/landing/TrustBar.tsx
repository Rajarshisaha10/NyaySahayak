import React from 'react';
import { ShieldCheck, Scale, Award, Building2, CheckCircle2 } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustBadges = [
    { text: "Supreme Court Bar Association Members", icon: "🏛️" },
    { text: "Featured in Times of India", icon: "📰" },
    { text: "Bar Council of Delhi Accredited Advocates", icon: "⚖️" },
    { text: "50,000+ Legal Queries Resolved", icon: "🛡️" },
    { text: "100% Data Privacy & Encryption", icon: "🔒" },
    { text: "High Court Advocates Guild", icon: "📜" },
    { text: "Featured in Economic Times Legal", icon: "💼" },
  ];

  // Duplicate list for infinite smooth CSS loop
  const marqueeItems = [...trustBadges, ...trustBadges];

  return (
    <div id="trust-bar" className="py-8 bg-[var(--color-bg-alt)] border-y border-[var(--color-border)] overflow-hidden relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <span className="text-xs font-semibold tracking-widest text-[var(--color-primary-light)] uppercase flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Trusted by 50,000+ Everyday Indians & Legal Professionals
        </span>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex overflow-hidden">
        
        {/* Left & Right Blur Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[var(--color-bg-alt)] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[var(--color-bg-alt)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-8 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/40 transition-all cursor-default whitespace-nowrap"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
