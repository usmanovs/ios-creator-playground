import { useLanguage } from '@/contexts/LanguageContext';
import { X, Check, Sparkles, Zap, Rocket, Brain } from 'lucide-react';

const VibCoderSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('vibe.title')}
          </h2>
          <p className="text-foreground/50 max-w-2xl mx-auto text-base md:text-lg">
            {t('vibe.subtitle')}
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <div className="glass-card p-10 md:p-12">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-8">
              <X className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground/70 mb-8">
              {t('vibe.traditional')}
            </h3>
            <ul className="space-y-5">
              {['trad1', 'trad2', 'trad3', 'trad4'].map((k) => (
                <li key={k} className="flex items-start gap-4 text-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/40 mt-2.5 shrink-0" />
                  <span className="text-sm md:text-base">{t(`vibe.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="glass-card p-10 md:p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(222 49% 17% / 0.6), hsl(240 28% 14% / 0.6))',
              borderColor: 'hsl(141 71% 58% / 0.3)',
              boxShadow: 'var(--shadow-glow-green)',
            }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-8 relative">
              <Check className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-accent mb-8 relative">
              {t('vibe.vibeCoder')}
            </h3>
            <ul className="space-y-5 relative">
              {['vib1', 'vib2', 'vib3', 'vib4'].map((k) => (
                <li key={k} className="flex items-start gap-4 text-foreground/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                  <span className="text-sm md:text-base">{t(`vibe.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Brain, key: 'card1' },
            { icon: Zap, key: 'card2' },
            { icon: Rocket, key: 'card3' },
            { icon: Sparkles, key: 'card4' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="glass-card glass-card-hover p-8">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {t(`vibe.${key}.title`)}
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                {t(`vibe.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VibCoderSection;
