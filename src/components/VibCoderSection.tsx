import { useLanguage } from '@/contexts/LanguageContext';
import { X, Check, Sparkles, Zap, Rocket, Brain } from 'lucide-react';

const VibCoderSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t('vibe.title')}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{t('vibe.subtitle')}</p>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">{t('vibe.traditional')}</h3>
            {['trad1', 'trad2', 'trad3', 'trad4'].map((k) => (
              <div key={k} className="flex items-center gap-3 mb-3 text-muted-foreground">
                <X className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-sm">{t(`vibe.${k}`)}</span>
              </div>
            ))}
          </div>
          <div className="glass-card p-6 border-primary/30">
            <h3 className="text-lg font-semibold text-primary mb-4">{t('vibe.vibeCoder')}</h3>
            {['vib1', 'vib2', 'vib3', 'vib4'].map((k) => (
              <div key={k} className="flex items-center gap-3 mb-3 text-foreground">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-sm">{t(`vibe.${k}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: Brain, key: 'card1' },
            { icon: Zap, key: 'card2' },
            { icon: Rocket, key: 'card3' },
            { icon: Sparkles, key: 'card4' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="glass-card p-6 hover:border-primary/30 transition-colors">
              <Icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(`vibe.${key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`vibe.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VibCoderSection;
