import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Sparkles, CheckCircle2 } from 'lucide-react';

export const MultilingualShowcase: React.FC = () => {
  const languages = [
    {
      code: "en",
      name: "English",
      script: "English",
      heading: "Know Your Rights & Get Legal Drafts Instantaneously",
      description: "Ask legal questions in plain words. Get exact statutory sections and Supreme Court rulings translated into actionable advice.",
      sampleQuery: "What is the notice period for tenant eviction in Delhi?",
      sampleAnswer: "Under Delhi Rent Control Law, landlords must issue a minimum 30-day written notice specifying valid grounds before initiating eviction."
    },
    {
      code: "hi",
      name: "Hindi",
      script: "हिन्दी",
      heading: "अपने कानूनी अधिकार समझें और तुरंत ड्राफ्ट प्राप्त करें",
      description: "अपनी समस्या सरल भाषा में पूछें। भारतीय कानूनों, धाराओं और सुप्रीम कोर्ट के फैसलों की सटीक जानकारी हिंदी में प्राप्त करें।",
      sampleQuery: "यदि मकान मालिक सुरक्षा जमा (Deposit) वापस न करे तो क्या करें?",
      sampleAnswer: "मॉडल किरायेदारी कानून के तहत मकान मालिक को 30 दिनों के भीतर डिपाजिट वापस करना अनिवार्य है। आप लीगल नोटिस भेज सकते हैं।"
    },
    {
      code: "ta",
      name: "Tamil",
      script: "தமிழ்",
      heading: "உங்கள் சட்ட உரிமைகளை எளிமையாக புரிந்து கொள்ளுங்கள்",
      description: "உங்கள் பிரச்சனையை எளிய தமிழில் கேளுங்கள். உச்ச நீதிமன்ற மற்றும் உயர் நீதிமன்ற தீர்ப்புகளின் அடிப்படையில் துல்லியமான சட்ட ஆலோசனையைப் பெறுங்கள்.",
      sampleQuery: "நிலச்சுவாந்தார் வைப்புத்தொகையைத் திருப்பிக் தர மறுத்தால் என்ன செய்வது?",
      sampleAnswer: "வாடகைச் சட்டத்தின் கீழ் 30 நாட்களுக்குள் வைப்புத்தொகையைத் திரும்பத் தர வேண்டும். வழக்கறிஞர் அறிவிப்பு அனுப்பலாம்."
    },
    {
      code: "mr",
      name: "Marathi",
      script: "मराठी",
      heading: "तुमचे कायदेशीर हक्क सोप्या भाषेत समजून घ्या",
      description: "तुमची कायदेशीर समस्या मराठीत मांडा. सर्वोच्च न्यायालय आणि उच्च न्यायालयाच्या निर्णयांवर आधारित त्वरित सल्ला मिळवा.",
      sampleQuery: "घरमालकाने डिपॉझिट परत केले नाही तर काय कायदेशीर पर्याय आहेत?",
      sampleAnswer: "महाराष्ट्र भाडे नियंत्रण कायद्यानुसार घरमालकाने ३० दिवसांत डिपॉझिट परत करणे बंधनकारक आहे."
    },
    {
      code: "bn",
      name: "Bengali",
      script: "বাংলা",
      heading: "আপনার আইনি অধিকার জানুন এবং তাৎক্ষণিক সহায়তা পান",
      description: "সহজ বাংলায় আপনার আইনি প্রশ্ন জিজ্ঞাসা করুন। ভারতীয় আইন ও আদালতের রায়ের উপর ভিত্তি করে উত্তর পান।",
      sampleQuery: "বাড়িওয়ালা সিকিউরিটি ডিপোজিট ফেরত না দিলে করণীয় কি?",
      sampleAnswer: "ভাড়াটিয়া আইন অনুযায়ী ৩০ দিনের মধ্যে ডিপোজিট ফেরত দেওয়া বাধ্যতামূলক।"
    }
  ];

  const [activeLang, setActiveLang] = useState("hi");
  const selectedObj = languages.find(l => l.code === activeLang) || languages[0];

  return (
    <section id="languages" className="py-24 bg-[var(--color-bg-alt)] border-t border-[var(--color-border)] px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-[var(--color-primary-light)] uppercase block mb-3 flex items-center justify-center gap-2"
          >
            <Globe className="w-3.5 h-3.5" /> Built for All 1.4 Billion Indians
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight"
          >
            Justice Belongs to Every Language
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)]"
          >
            Nyaysahayak translates complex legal statutes into your native tongue without losing legal precision.
          </motion.p>
        </div>

        {/* Language Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeLang === lang.code
                  ? "bg-[var(--color-primary)] text-slate-950 shadow-lg scale-105"
                  : "bg-[var(--color-card-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)]"
              }`}
            >
              <span>{lang.name}</span>
              <span className="ml-2 font-serif text-xs opacity-75">({lang.script})</span>
            </button>
          ))}
        </div>

        {/* Language Display Window */}
        <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 border border-[var(--color-border)] rounded-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedObj.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="inline-block px-3 py-1 rounded bg-[var(--color-accent)]/20 text-emerald-400 text-xs font-mono border border-[var(--color-accent)]/40">
                ✓ Native Script Ingestion Active
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-text)] leading-snug">
                "{selectedObj.heading}"
              </h3>

              <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                {selectedObj.description}
              </p>

              {/* Sample Native Query & Advice Pair */}
              <div className="pt-6 border-t border-[var(--color-border)] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="bg-[#0B0F14]/70 p-4 rounded-xl border border-[var(--color-border)]">
                  <span className="text-[10px] font-mono text-[var(--color-primary-light)] block mb-1">SAMPLE QUERY ({selectedObj.name})</span>
                  <p className="font-medium text-slate-200">"{selectedObj.sampleQuery}"</p>
                </div>

                <div className="bg-[#0B0F14]/70 p-4 rounded-xl border border-[var(--color-border)]">
                  <span className="text-[10px] font-mono text-emerald-400 block mb-1">GROUNDED AI ADVICE ({selectedObj.name})</span>
                  <p className="font-medium text-slate-200">"{selectedObj.sampleAnswer}"</p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </section>
  );
};
