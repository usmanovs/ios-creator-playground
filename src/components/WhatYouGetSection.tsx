import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Timer, DollarSign, Users, HeartHandshake } from 'lucide-react';

const WhatYouGetSection = () => {
  const { t } = useLanguage();

  const items = [
    { icon: DollarSign, key: 'item2', bigStat: '$10K', unit: '/mo', tone: 'primary' as const },
    { icon: Users, key: 'item3', bigStat: '300+', unit: '', tone: 'accent' as const },
    { icon: HeartHandshake, key: 'item4', bigStat: '1:1', unit: '', tone: 'primary' as const },
  ];

  return (
    <section className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Section aurora */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[40%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'hsl(252 92% 76% / 0.10)', filter: 'blur(140px)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[40%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'hsl(141 71% 58% / 0.08)', filter: 'blur(140px)' }}
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
              02 · {t('vibe.chapter')}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
            {t('get.title')}
          </h2>
        </motion.div>

        {/* Featured hero card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden mb-4 border"
          style={{
            background:
              'linear-gradient(135deg, hsl(222 49% 17% / 0.9), hsl(240 28% 14% / 0.9))',
            borderColor: 'hsl(141 71% 58% / 0.3)',
            boxShadow: 'var(--shadow-glow-green)',
          }}
        >
          {/* Aurora sweep */}
          <motion.div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-[60%] h-[120%] rounded-full pointer-events-none"
            style={{ background: 'hsl(141 71% 58% / 0.22)', filter: 'blur(100px)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative grid md:grid-cols-5 gap-8 p-10 md:p-14 items-center">
            {/* Big number */}
            <div className="md:col-span-2 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-accent" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black tracking-[0.25em] text-accent uppercase">
                  01 · Featured
                </span>
              </div>
              <div className="flex items-end gap-2 leading-none">
                <span
                  className="font-display text-[8rem] md:text-[11rem] font-black tracking-tighter text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, hsl(160 84% 65%), hsl(174 84% 55%), hsl(190 90% 55%))',
                    lineHeight: 0.85,
                  }}
                >
                  15
                </span>
                <span className="font-display text-3xl md:text-4xl font-bold text-foreground/60 pb-3">
                  days
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="md:col-span-3">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                {t('get.item1.title')}
              </h3>
              <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-lg">
                {t('get.item1.desc')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Row of 3 smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(({ icon: Icon, key, bigStat, unit, tone }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:-translate-y-1"
              style={{
                borderColor:
                  tone === 'accent' ? 'hsl(141 71% 58% / 0.15)' : 'hsl(252 92% 76% / 0.15)',
              }}
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    tone === 'accent'
                      ? 'hsl(141 71% 58% / 0.18)'
                      : 'hsl(252 92% 76% / 0.18)',
                  filter: 'blur(60px)',
                }}
              />

              <div className="relative flex items-start justify-between mb-6">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
                    tone === 'accent'
                      ? 'bg-accent/15 border-accent/25'
                      : 'bg-primary/15 border-primary/25'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${tone === 'accent' ? 'text-accent' : 'text-primary'}`}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-foreground/25 tabular-nums tracking-widest">
                  0{i + 2}
                </span>
              </div>

              {/* Big stat */}
              <div className="relative flex items-baseline gap-1 mb-4">
                <span
                  className={`font-display text-4xl md:text-5xl font-black tracking-tighter ${
                    tone === 'accent' ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {bigStat}
                </span>
                {unit && (
                  <span className="font-display text-lg font-bold text-foreground/40">
                    {unit}
                  </span>
                )}
              </div>

              <h3 className="relative font-display text-lg md:text-xl font-bold text-foreground mb-3 tracking-tight leading-snug">
                {t(`get.${key}.title`)}
              </h3>
              <p className="relative text-sm text-foreground/55 leading-relaxed">
                {t(`get.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
