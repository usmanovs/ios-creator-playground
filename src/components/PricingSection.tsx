import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Clock, Tag, Zap, Star, MessageCircle } from 'lucide-react';
import mbankQr from '@/assets/mbank-qr.png';

const PricingSection = () => {
  const { t } = useLanguage();

  const tiers = [
    { key: 'early', icon: Tag, status: 'expired' },
    { key: 'current', icon: Zap, status: 'active' },
    { key: 'last', icon: Clock, status: 'upcoming' },
  ];

  const recordingsFeatures = [
    'plan.rec.f1', 'plan.rec.f2', 'plan.rec.f3', 'plan.rec.f4',
  ];

  const liveFeatures = [
    'plan.live.f1', 'plan.live.f2', 'plan.live.f3', 'plan.live.f4', 'plan.live.f5', 'plan.live.f6',
  ];

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
    <section id="pricing" className="py-20 px-4 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Price Timeline */}
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">
          {t('price.timeline.title')}
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          {t('price.timeline.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {tiers.map((tier) => {
            const isActive = tier.status === 'active';
            const isExpired = tier.status === 'expired';
            return (
              <div
                key={tier.key}
                className={`relative rounded-xl border p-6 text-center transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : isExpired
                    ? 'border-border/50 opacity-50'
                    : 'border-border'
                }`}
              >
                {isExpired && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-sm font-bold text-destructive bg-background/80 px-3 py-1 rounded-full border border-destructive/30">
                      {t('price.expired')}
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    {t('price.current')}
                  </div>
                )}
                <tier.icon className={`w-5 h-5 mx-auto mb-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-sm font-medium text-muted-foreground mb-1">{t(`price.tier.${tier.key}`)}</div>
                <div className={`text-3xl font-extrabold mb-1 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {t(`price.tier.${tier.key}.amount`)}
                </div>
                <div className="text-xs text-muted-foreground">{t(`price.tier.${tier.key}.when`)}</div>
                <div className="text-xs text-muted-foreground mt-1">{t(`price.tier.${tier.key}.dates`)}</div>
              </div>
            );
          })}
        </div>

        {/* Plans */}
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t('price.plans.title')}</h2>
        <p className="text-center text-muted-foreground mb-10">{t('price.plans.subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recordings Only */}
          <div className="glass-card p-8 border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">{t('plan.rec.title')}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t('plan.rec.desc')}</p>

            <div className="text-4xl font-extrabold text-foreground mb-1">$299</div>
            <p className="text-xs text-muted-foreground mb-6">{t('plan.oneTime')}</p>

            {/* QR */}
            <div className="bg-secondary/50 rounded-lg p-4 mb-4 text-center">
              <p className="text-xs text-muted-foreground mb-3">{t('plan.scanMbank')}</p>
              <img src={mbankQr} alt="Mbank QR Code" className="w-36 h-36 mx-auto rounded-lg" />
              <p className="text-xs text-muted-foreground mt-3">{t('plan.afterPayment')}</p>
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors mb-3"
            >
              <MessageCircle className="w-4 h-4" />
              {t('plan.confirmWhatsapp')}
            </a>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{t('plan.or')}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-lg border border-border text-center text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors mb-8"
            >
              {t('plan.payCard')}
            </a>

            {/* Value breakdown */}
            <div className="space-y-2 mb-4">
              {recordingsValue.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(item.label)}</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.totalValue')}</span>
                <span className="text-foreground font-semibold">$550</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.youPay')}</span>
                <span className="text-primary font-bold">$299</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.savings')}</span>
                <span className="text-green-400 font-bold">46%</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              {recordingsFeatures.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-foreground">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Sessions */}
          <div className="glass-card p-8 border-primary/30 relative">
            <div className="absolute -top-3 right-6 flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
              <Star className="w-3 h-3" />
              {t('plan.popular')}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{t('plan.live.title')}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t('plan.live.desc')}</p>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg text-muted-foreground line-through">$400</span>
              <span className="text-4xl font-extrabold text-foreground">$350</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">{t('plan.oneTime')}</p>

            {/* QR */}
            <div className="bg-secondary/50 rounded-lg p-4 mb-4 text-center">
              <p className="text-xs text-muted-foreground mb-3">{t('plan.scanMbank')}</p>
              <img src={mbankQr} alt="Mbank QR Code" className="w-36 h-36 mx-auto rounded-lg" />
              <p className="text-xs text-muted-foreground mt-3">{t('plan.afterPayment')}</p>
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors mb-3"
            >
              <MessageCircle className="w-4 h-4" />
              {t('plan.confirmWhatsapp')}
            </a>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{t('plan.or')}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <a
              href="https://wa.me/12024554575"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-lg border border-border text-center text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors mb-8"
            >
              {t('plan.payCard')}
            </a>

            {/* Value breakdown */}
            <div className="space-y-2 mb-4">
              {liveValue.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(item.label)}</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.totalValue')}</span>
                <span className="text-foreground font-semibold">$1,194</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.youPay')}</span>
                <span className="text-primary font-bold">$350</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('plan.savings')}</span>
                <span className="text-green-400 font-bold">71%</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              {liveFeatures.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-foreground">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          👤 {t('price.ageRec')}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
