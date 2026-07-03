import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Laptop,
  Apple,
  Clock,
  Wifi,
  Wallet,
  Code2,
  Palette,
  BadgeDollarSign,
  Users,
  Smartphone,
  Check,
  Sparkles,
} from 'lucide-react';

const RequirementsSection = () => {
  const { t } = useLanguage();

  const needs = [
    { icon: Laptop, key: 'n1' },
    { icon: Apple, key: 'n2' },
    { icon: Clock, key: 'n3' },
    { icon: Wifi, key: 'n4' },
    { icon: Wallet, key: 'n5' },
  ];

  const skips = [
    { icon: Code2, key: 's1' },
    { icon: Palette, key: 's2' },
    { icon: BadgeDollarSign, key: 's3' },
    { icon: Users, key: 's4' },
    { icon: Smartphone, key: 's5' },
  ];

  return (
    <section id="requirements" className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Section aurora */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[45%] h-[55%] rounded-full pointer-events-none"
        style={{ background: 'hsl(141 71% 58% / 0.10)', filter: 'blur(140px)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[45%] h-[55%] rounded-full pointer-events-none"
        style={{ background: 'hsl(252 92% 76% / 0.10)', filter: 'blur(140px)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-[10px] font-black tracking-[0.25em] text-foreground/50 uppercase">
              {t('req.eyebrow')}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05] mb-5">
            {t('req.title')}
          </h2>
          <p className="text-base md:text-lg text-foreground/55 max-w-2xl mx-auto leading-relaxed">
            {t('req.subtitle')}
          </p>
        </motion.div>

        {/* Two columns: needs + reassurance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* You need */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[2.5rem] bg-white/[0.02] border backdrop-blur-2xl p-8 md:p-10 overflow-hidden"
            style={{ borderColor: 'hsl(141 71% 58% / 0.22)' }}
          >
            <div
              aria-hidden
              className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 rounded-full pointer-events-none"
              style={{ background: 'hsl(141 71% 58% / 0.14)', filter: 'blur(90px)' }}
            />
            <div className="relative flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center">
                <Check className="w-5 h-5 text-accent" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {t('req.needTitle')}
              </h3>
            </div>
            <ul className="relative space-y-6">
              {needs.map(({ icon: Icon, key }, i) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-display text-base md:text-lg font-bold text-foreground tracking-tight leading-snug">
                      {t(`req.${key}.title`)}
                    </p>
                    <p className="text-sm text-foreground/55 leading-relaxed mt-1">
                      {t(`req.${key}.desc`)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* You don't need */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[2.5rem] bg-white/[0.02] border backdrop-blur-2xl p-8 md:p-10 overflow-hidden"
            style={{ borderColor: 'hsl(252 92% 76% / 0.22)' }}
          >
            <div
              aria-hidden
              className="absolute -top-1/3 -left-1/3 w-2/3 h-2/3 rounded-full pointer-events-none"
              style={{ background: 'hsl(252 92% 76% / 0.14)', filter: 'blur(90px)' }}
            />
            <div className="relative flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {t('req.skipTitle')}
              </h3>
            </div>
            <ul className="relative space-y-6">
              {skips.map(({ icon: Icon, key }, i) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-display text-base md:text-lg font-bold text-foreground tracking-tight leading-snug">
                      {t(`req.${key}.title`)}
                    </p>
                    <p className="text-sm text-foreground/55 leading-relaxed mt-1">
                      {t(`req.${key}.desc`)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
