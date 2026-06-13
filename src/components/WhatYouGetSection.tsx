import { useLanguage } from '@/contexts/LanguageContext';
import { Timer, DollarSign, Users, HeartHandshake } from 'lucide-react';

const WhatYouGetSection = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Timer, key: 'item1', tone: 'accent' as const },
    { icon: DollarSign, key: 'item2', tone: 'primary' as const },
    { icon: Users, key: 'item3', tone: 'accent' as const },
    { icon: HeartHandshake, key: 'item4', tone: 'primary' as const },
  ];

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-foreground mb-16 md:mb-20">
          {t('get.title')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ icon: Icon, key, tone }) => (
            <div key={key} className="glass-card glass-card-hover p-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${tone === 'accent' ? 'bg-accent/15' : 'bg-primary/15'}`}>
                <Icon className={`w-6 h-6 ${tone === 'accent' ? 'text-accent' : 'text-primary'}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{t(`get.${key}.title`)}</h3>
              <p className="text-sm md:text-base text-foreground/50 leading-relaxed">{t(`get.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
