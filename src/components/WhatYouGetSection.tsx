import { useLanguage } from '@/contexts/LanguageContext';
import { Timer, DollarSign, Users, HeartHandshake } from 'lucide-react';

const WhatYouGetSection = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Timer, key: 'item1' },
    { icon: DollarSign, key: 'item2' },
    { icon: Users, key: 'item3' },
    { icon: HeartHandshake, key: 'item4' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('get.title')}</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map(({ icon: Icon, key }) => (
            <div key={key} className="glass-card p-6 hover:border-primary/30 transition-colors">
              <Icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(`get.${key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`get.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
