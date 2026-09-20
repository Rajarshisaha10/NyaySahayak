import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, ShieldCheck, BookOpen, Scale, ArrowRight } from 'lucide-react';

export const InteractiveAIChatDemo: React.FC = () => {
  const samplePrompts = [
    {
      label: "🏠 Landlord Deposit Dispute",
      prompt: "What are my legal rights if my landlord refuses to refund my ₹50,000 security deposit?",
      response: {
        rights: "Under Model Tenancy Act & State Rent Control Rules, landlords must refund security deposits within 30 days of vacating after valid deduction notice.",
        citations: ["Model Tenancy Act, Section 13", "Transfer of Property Act, 1882, Section 108"],
        action: "Send a formal 15-day Legal Notice demanding refund with 12% interest. If unfulfilled, file a claim before the local Rent Tribunal or Consumer Forum."
      }
    },
    {
      label: "📋 Filing an RTI for Road Repair",
      prompt: "How do I file an RTI application for delayed road construction in my locality?",
      response: {
        rights: "Under Right to Information Act 2005, Section 6(1), every citizen has the right to inspect municipal work orders, fund allocation, and contractor completion timelines.",
        citations: ["RTI Act 2005, Section 6(1)", "Article 19(1)(a) of the Constitution"],
        action: "Draft a ₹10 fee RTI addressed to the Public Information Officer (PIO) of your Municipal Corporation requesting contractor billing copies."
      }
    },
    {
      label: "🚔 FIR Refusal Rights",
      prompt: "Can a police officer refuse to register an FIR for a theft?",
      response: {
        rights: "Under Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC Section 154, registering an FIR for a cognizable offense is mandatory.",
        citations: ["Lalita Kumari v. Govt of UP (2014) 2 SCC 1", "BNSS 2023, Section 173"],
        action: "If refused, send the complaint directly to the Superintendent of Police (SP) by registered post, or file an application under BNSS before the Magistrate."
      }
    }
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [customAnswer, setCustomAnswer] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const activeDemo = customAnswer || samplePrompts[selectedIdx].response;
  const activePromptText = customInput.trim() || samplePrompts[selectedIdx].prompt;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setCustomAnswer({
        rights: "Under Indian Statutory Law, you have guaranteed legal protections. Our verified AI model retrieves exact statutory sections and precedent rulings.",
        citations: ["Constitution of India, Article 21", "Relevant State Judicial Rulings"],
        action: "You can issue a formal legal notice or approach the concerned forum/authority within the limitation period."
      });
      setLoading(false);
    }, 800);
  };

  return (
    <section id="ai-demo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[var(--color-primary-light)] uppercase block mb-3 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" /> Interactive Legal AI Demo
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight"
        >
          Try Nyaysahayak Right Now
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)]"
        >
          Select a common legal situation or type your own question to see instant, grounded legal guidance.
        </motion.p>
      </div>

      {/* Interactive Terminal Window */}
      <div className="max-w-4xl mx-auto glass-card border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="bg-[#0e141f] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 font-mono text-xs text-[var(--color-text-muted)]">Nyaysahayak Legal Intelligence v2.0</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--color-accent)]/30 text-emerald-400 border border-[var(--color-accent)]/50">
            ✓ 6-CHECK VERIFIED
          </span>
        </div>

        {/* Sample Prompt Selector Tabs */}
        <div className="bg-[#121926] p-4 border-b border-[var(--color-border)] flex items-center gap-3 overflow-x-auto">
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setCustomAnswer(null);
                setCustomInput('');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedIdx === idx && !customAnswer
                  ? "bg-[var(--color-primary)] text-slate-950 font-semibold shadow-md"
                  : "bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Content Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#0B0F14]/95 min-h-[380px]">
          
          {/* User Query Bubble */}
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs flex-shrink-0">
              YOU
            </div>
            <div className="bg-[#152030] border border-[#23334f] text-[var(--color-text)] p-4 rounded-2xl rounded-tl-none text-sm max-w-2xl leading-relaxed shadow-sm">
              {activePromptText}
            </div>
          </div>

          {/* AI Answer Bubble */}
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 flex items-center justify-center text-[var(--color-primary-light)] flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#101724] border border-[var(--color-border)] p-5 rounded-2xl rounded-tl-none text-xs text-[var(--color-primary-light)] font-mono flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
                    Searching Supreme Court Judgments & Bare Acts...
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedIdx + (customAnswer ? '-custom' : '')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#101724] border border-[#1e2e48] p-6 rounded-2xl rounded-tl-none space-y-4 shadow-md"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-[var(--color-primary-light)] uppercase tracking-wider block mb-1">Your Legal Rights</span>
                      <p className="text-sm text-slate-200 leading-relaxed font-normal">
                        {activeDemo.rights}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-border)]">
                      <span className="text-[11px] font-mono text-[var(--color-accent-light)] uppercase tracking-wider block mb-1">Grounded Statutory Citations</span>
                      <div className="flex flex-wrap gap-2">
                        {activeDemo.citations.map((c: string, ci: number) => (
                          <span key={ci} className="text-xs font-mono px-2.5 py-1 rounded bg-[#162338] text-[var(--color-primary-light)] border border-[#233758]">
                            📖 {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-border)]">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">Recommended Next Step</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeDemo.action}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Input Form Bar */}
        <form onSubmit={handleCustomSubmit} className="bg-[#0e141f] p-4 border-t border-[var(--color-border)] flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask any legal question in plain Hindi, English, Tamil..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 bg-[#151f30] border border-[#23334d] focus:border-[var(--color-primary)] text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm outline-none font-sans"
          />
          <button type="submit" className="btn-pill btn-primary-gold px-5 py-3 text-xs sm:text-sm font-semibold">
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </section>
  );
};
