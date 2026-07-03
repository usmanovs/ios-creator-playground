import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Check, Sparkles, Zap, Rocket, Brain } from 'lucide-react';

const VibCoderSection = () => {
  const { t } = useLanguage();

  const tradBullets = ['trad1', 'trad2', 'trad3', 'trad4'];
  const vibeBullets = ['vib1', 'vib2', 'vib3', 'vib4'];

  const features = [
    { icon: Brain, key: 'card1', span: 'md:col-span-2' },
    { icon: Zap, key: 'card2', span: 'md:col-span-1' },
    { icon: Rocket, key: 'card3', span: 'md:col-span-1' },
    { icon: Sparkles, key: 'card4', span: 'md:col-span-2' },
  ];

  return (
    <section className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Section aurora */}
      <div
        aria-hidden
        className="absolute top-1/3 -left-[10%] w-[45%] h-[45%] rounded-full pointer-events-none"
        style={{ background: 'hsl(263 70% 50% / 0.14)', filter: 'blur(140px)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'hsl(141 71% 58% / 0.10)', filter: 'blur(140px)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
            <span className="text-[10px] font-black tracking-[0.25em] text-foreground/50 uppercase">
              01 · {t('vibe.chapter')}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-5 leading-[1.05]">
            {t('vibe.title')}
          </h2>
          <p className="text-foreground/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t('vibe.subtitle')}
          </p>
        </motion.div>

        {/* Comparison diptych */}
        <div className="relative grid md:grid-cols-2 gap-4 mb-24">
          {/* VS badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-2xl">
              <span className="font-display text-xs font-black tracking-widest text-foreground/60">
                {t('vibe.vs')}
              </span>
            </div>
          </div>

          {/* Traditional (desaturated / dim) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative p-10 md:p-12 rounded-[2rem] bg-white/[0.015] border border-white/[0.06] backdrop-blur-xl"
            style={{ filter: 'grayscale(0.6)' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <X className="w-4 h-4 text-destructive/80" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-destructive/70 uppercase">
                {t('vibe.oldWay')}
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground/60 mb-8 tracking-tight">
              {t('vibe.traditional')}
            </h3>
            <ul className="space-y-4">
              {tradBullets.map((k, i) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4 text-foreground/45 py-3 border-b border-white/[0.04] last:border-0"
                >
                  <span className="font-mono text-[10px] font-bold text-foreground/25 tabular-nums mt-1.5 w-5 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed line-through decoration-destructive/30 decoration-1">
                    {t(`vibe.${k}`)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Vibe Coder (glowing winner) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="relative p-10 md:p-12 rounded-[2rem] overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, hsl(222 49% 17% / 0.85), hsl(240 28% 14% / 0.85))',
              border: '1px solid hsl(141 71% 58% / 0.35)',
              boxShadow: 'var(--shadow-glow-green)',
            }}
          >
            {/* Ambient aurora sweep */}
            <motion.div
              aria-hidden
              className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full pointer-events-none"
              style={{ background: 'hsl(141 71% 58% / 0.22)', filter: 'blur(80px)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center">
                <Check className="w-4 h-4 text-accent" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-accent uppercase">
                {t('vibe.newWay')}
              </span>
            </div>
            <h3 className="relative font-display text-2xl md:text-3xl font-bold mb-8 tracking-tight">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, hsl(160 84% 65%), hsl(174 84% 55%), hsl(190 90% 55%))',
                }}
              >
                {t('vibe.vibeCoder')}
              </span>
            </h3>
            <ul className="relative space-y-4">
              {vibeBullets.map((k, i) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-4 text-foreground/90 py-3 border-b border-white/[0.06] last:border-0"
                >
                  <span className="font-mono text-[10px] font-bold text-accent tabular-nums mt-1.5 w-5 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">
                    {t(`vibe.${k}`)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Feature bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, key, span }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-primary/30 hover:-translate-y-1 ${span}`}
            >
              {/* Inner glow on hover */}
              <div
                aria-hidden
                className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'hsl(252 92% 76% / 0.15)', filter: 'blur(60px)' }}
              />

              {/* Number */}
              <div className="relative flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-xs font-bold text-foreground/25 tabular-nums tracking-widest">
                  0{i + 1}
                </span>
              </div>

              <h3 className="relative font-display text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight leading-snug">
                {t(`vibe.${key}.title`)}
              </h3>
              <p className="relative text-sm md:text-base text-foreground/55 leading-relaxed">
                {t(`vibe.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VibCoderSection;
