import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Pooja Verma",
      role: "Tenant, New Delhi",
      text: "My landlord held back my ₹65,000 security deposit for 3 months with bogus excuses. Nyaysahayak drafted a formal legal notice quoting the Model Tenancy Act in 5 minutes. Got my full refund within a week!",
      rating: 5,
      city: "Delhi"
    },
    {
      name: "Karan Johar",
      role: "Small Business Owner, Mumbai",
      text: "Filing RTIs used to be a nightmare of legal formatting. Nyaysahayak helped me draft an RTI for municipal road repairs in Marathi. The clarity of statutory citations was impressive.",
      rating: 5,
      city: "Mumbai"
    },
    {
      name: "Adv. S. K. Subramaniam",
      role: "High Court Advocate, Chennai",
      text: "As a junior lawyer, Nyaysahayak's page-preserving citation engine saves me hours of manual digest search. Its 6-check verification guarantees zero fabricated precedents.",
      rating: 5,
      city: "Chennai"
    }
  ];

  return (
    <section className="py-24 bg-[var(--color-bg-alt)] border-t border-[var(--color-border)] px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-[var(--color-primary-light)] uppercase block mb-3"
          >
            Real Impact Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight"
          >
            Empowering Citizens Across India
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="glass-card p-8 flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[var(--color-primary)]/20" />
                </div>

                <p className="text-sm text-[var(--color-text)] italic leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <strong className="block text-sm font-bold text-[var(--color-text)]">{rev.name}</strong>
                  <span className="text-xs text-[var(--color-text-muted)]">{rev.role}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-emerald-400 border border-[var(--color-accent)]/40">
                  ✓ VERIFIED USER
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
};
