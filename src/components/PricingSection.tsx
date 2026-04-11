import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const { t } = useLanguage();

  const items = ['price.item1', 'price.item2', 'price.item3', 'price.item4', 'price.item5', 'price.item6'];

  return (
    <section id="pricing" className="py-20 px-4 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t('price.title')}</h2>
        <p className="text-center text-muted-foreground mb-12">{t('price.subtitle')}</p>

        <div className="glass-card p-8 border-primary/30 text-center">
          <div className="text-5xl font-extrabold gradient-text mb-2">{t('price.amount')}</div>
          <p className="text-muted-foreground mb-8">{t('price.includes')}</p>

          <div className="text-left max-w-sm mx-auto space-y-3 mb-8">
            {items.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-sm text-foreground">{t(key)}</span>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/12024554575"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-4 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 mb-6"
          >
            {t('price.cta')}
          </a>

          <div className="border-t border-border pt-6">
            <p className="text-sm font-semibold text-foreground mb-2">{t('price.pay')}</p>
            <p className="text-xs text-muted-foreground">{t('price.payDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
