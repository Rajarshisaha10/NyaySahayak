import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Cpu, UserCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenChat: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenChat }) => {
  const steps = [
    {
      number: "01",
      icon: <MessageSquareText className="w-6 h-6 text-[var(--color-primary-light)]" />,
      title: "Describe Your Issue in Plain Language",
      description: "Type or speak your legal situation naturally in Hindi, English, Tamil, or Marathi. No complex lawyer jargon needed.",
      tag: "Plain Language Input"
    },
    {
      number: "02",
      icon: <Cpu className="w-6 h-6 text-[var(--color-primary-light)]" />,
      title: "Get Instant AI Guidance & Law Citations",
      description: "Our legal AI analyzes relevant Acts, Supreme Court & High Court judgments, and drafts actionable step-by-step guidance & notices.",
      tag: "Grounded Citations"
    },
    {
      number: "03",
      icon: <UserCheck className="w-6 h-6 text-[var(--color-primary-light)]" />,
      title: "Connect with Verified Advocates",
      description: "If your matter requires representation, seamlessly match with Bar Council verified specialists in your city or High Court.",
      tag: "Bar-Certified Network"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[var(--color-primary-light)] uppercase block mb-3"
        >
          Simple 3-Step Process
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight"
        >
          From Legal Confusion to Total Clarity
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)]"
        >
          Navigating Indian law shouldn't take weeks or cost thousands. Here is how Nyaysahayak empowers you in minutes.
        </motion.p>
      </div>

      {/* 3-Step Cards Container with SVG Connecting Line */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* SVG Drawing Connecting Path (hidden on mobile) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-12 z-0 pointer-events-none px-12">
          <svg className="w-full h-8" viewBox="0 0 1000 30" fill="none">
            <motion.path
              d="M 50 15 L 950 15"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0.3 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 flex flex-col justify-between relative z-10 group"
          >
            <div>
              {/* Step Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="font-serif text-3xl font-bold text-[var(--color-primary-light)]/40 group-hover:text-[var(--color-primary-light)] transition-colors">
                  {step.number}
                </span>
              </div>

              {/* Tag */}
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary-light)] mb-3 inline-block">
                {step.tag}
              </span>

              {/* Content */}
              <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Step {step.number} of 03</span>
              <button onClick={onOpenChat} className="text-xs font-semibold text-[var(--color-primary-light)] hover:underline flex items-center gap-1">
                Try Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  );
};
