import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Star, MessageCircle } from 'lucide-react';
import mbankQr from '@/assets/mbank-qr.png';

const PricingSection = () => {
  const { t } = useLanguage();


  const recordingsFeatures = ['plan.rec.f1', 'plan.rec.f2', 'plan.rec.f3', 'plan.rec.f4'];
  const liveFeatures = ['plan.live.f1', 'plan.live.f2', 'plan.live.f3', 'plan.live.f4', 'plan.live.f5', 'plan.live.f6'];

  const recordingsValue = [
    { label: 'plan.rec.v1', value: '$400' },
    { label: 'plan.rec.v2', value: '$150' },
  ];
  const liveValue = [
    { label: 'plan.live.v1', value: '$494' },
    { label: 'plan.live.v2', value: '$400' },
    { label: 'plan.live.v3', value: '$300' },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Plans */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('price.plans.title')}
          </h2>
          <p className="text-foreground/50 text-base md:text-lg">{t('price.plans.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recordings Only */}
          <div className="glass-card p-8 md:p-10 flex flex-col">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">{t('plan.rec.title')}</h3>
            <p className="text-sm text-foreground/50 leading-relaxed mb-8">{t('plan.rec.desc')}</p>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-display text-5xl font-bold text-foreground">$299</span>
              <span className="text-foreground/30 line-through text-lg">$550</span>
            </div>
            <p className="text-xs text-foreground/40 mb-8">{t('plan.oneTime')}</p>

            {/* QR */}
            <div className="rounded-2xl bg-background/60 border border-foreground/5 p-5 mb-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-3">{t('plan.scanMbank')}</p>
              <img src={mbankQr} alt="Mbank QR Code" className="w-32 h-32 mx-auto rounded-lg" />
              <p className="text-xs text-foreground/40 mt-3">{t('plan.afterPayment')}</p>
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold transition-all hover:brightness-110 mb-3"
              style={{ boxShadow: 'var(--shadow-glow-green)' }}
            >
              <MessageCircle className="w-4 h-4" />
              {t('plan.confirmWhatsapp')}
            </a>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-foreground/10" />
              <span className="text-[10px] uppercase tracking-widest text-foreground/40">{t('plan.or')}</span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-2xl border border-foreground/10 text-center text-sm font-bold text-foreground/80 hover:bg-card/60 transition-colors mb-8"
            >
              {t('plan.payCard')}
            </a>

            {/* Value breakdown */}
            <div className="space-y-2 mb-6">
              {recordingsValue.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-foreground/50">{t(item.label)}</span>
                  <span className="text-foreground/80">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-foreground/10 pt-2 flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.totalValue')}</span>
                <span className="text-foreground font-semibold">$550</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.youPay')}</span>
                <span className="text-primary font-bold">$299</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.savings')}</span>
                <span className="text-accent font-bold">46%</span>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-6 space-y-3 mt-auto">
              {recordingsFeatures.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground/80">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Sessions — featured */}
          <div
            className="relative rounded-[2rem] p-8 md:p-10 flex flex-col backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(180deg, hsl(222 49% 17% / 0.7), hsl(240 28% 14% / 0.6))',
              border: '2px solid hsl(252 92% 76% / 0.6)',
              boxShadow: 'var(--shadow-glow-violet)',
            }}
          >
            <div className="absolute -top-3 right-8 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-1.5 rounded-full">
              <Star className="w-3 h-3" />
              {t('plan.popular')}
            </div>

            <h3 className="font-display text-2xl font-bold text-primary mb-2">{t('plan.live.title')}</h3>
            <p className="text-sm text-foreground/50 leading-relaxed mb-8">{t('plan.live.desc')}</p>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-display text-5xl font-bold text-foreground">$349</span>
              <span className="text-foreground/30 line-through text-lg">$550</span>
            </div>
            <p className="text-xs text-foreground/40 mb-8">{t('plan.oneTime')}</p>

            {/* QR */}
            <div className="rounded-2xl bg-background/60 border border-primary/20 p-5 mb-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">{t('plan.scanMbank')}</p>
              <img src={mbankQr} alt="Mbank QR Code" className="w-32 h-32 mx-auto rounded-lg" />
              <p className="text-xs text-foreground/40 mt-3">{t('plan.afterPayment')}</p>
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold transition-all hover:brightness-110 mb-3"
              style={{ boxShadow: 'var(--shadow-glow-green)' }}
            >
              <MessageCircle className="w-4 h-4" />
              {t('plan.confirmWhatsapp')}
            </a>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-foreground/10" />
              <span className="text-[10px] uppercase tracking-widest text-foreground/40">{t('plan.or')}</span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-2xl border border-foreground/10 text-center text-sm font-bold text-foreground/80 hover:bg-card/60 transition-colors mb-8"
            >
              {t('plan.payCard')}
            </a>

            {/* Value breakdown */}
            <div className="space-y-2 mb-6">
              {liveValue.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-foreground/50">{t(item.label)}</span>
                  <span className="text-foreground/80">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-foreground/10 pt-2 flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.totalValue')}</span>
                <span className="text-foreground font-semibold">$1,194</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.youPay')}</span>
                <span className="text-primary font-bold">$349</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50">{t('plan.savings')}</span>
                <span className="text-accent font-bold">37%</span>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-6 space-y-3 mt-auto">
              {liveFeatures.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground/80">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-foreground/40 mt-10">
          👤 {t('price.ageRec')}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
