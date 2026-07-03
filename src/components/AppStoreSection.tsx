import { Check, Star, Signal, Wifi, BatteryFull, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AppStoreSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: iPhone mockup */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative animate-float">
              {/* Ambient glow */}
              <div className="absolute -inset-10 bg-gradient-violet opacity-30 blur-3xl rounded-full pointer-events-none" />

              {/* iPhone frame */}
              <div className="relative w-[300px] h-[620px] bg-neutral-900 rounded-[3rem] p-[10px] shadow-glow-violet ring-1 ring-white/10">
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-1 text-black text-[11px] font-semibold z-10 relative">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Signal className="w-3 h-3" strokeWidth={2.5} />
                      <Wifi className="w-3 h-3" strokeWidth={2.5} />
                      <BatteryFull className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* App Store content */}
                  <div className="px-4 pt-8 pb-4 overflow-hidden h-full">
                    {/* App header */}
                    <div className="flex items-start gap-3">
                      <div className="w-[68px] h-[68px] rounded-[16px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 flex items-center justify-center shadow-lg shrink-0">
                        <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-black text-[15px] font-semibold leading-tight truncate">
                          {t('as.appName')}
                        </h3>
                        <p className="text-neutral-500 text-[11px] leading-tight mt-0.5 truncate">
                          {t('as.appDev')}
                        </p>
                        <p className="text-neutral-500 text-[11px] leading-tight truncate">
                          {t('as.appTagline')}
                        </p>
                        <div className="mt-2">
                          <button className="bg-[#0071e3] text-white text-[11px] font-bold px-4 py-1 rounded-full">
                            {t('as.get')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ratings strip */}
                    <div className="mt-4 grid grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200 py-2">
                      <div className="text-center">
                        <div className="text-black text-[13px] font-bold">4.8</div>
                        <div className="flex items-center justify-center gap-[1px] mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2 h-2 fill-neutral-500 text-neutral-500" />
                          ))}
                        </div>
                        <div className="text-neutral-400 text-[8px] mt-0.5">{t('as.ratings')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-black text-[13px] font-bold">#12</div>
                        <div className="text-neutral-400 text-[8px] mt-1">Productivity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-black text-[13px] font-bold">4+</div>
                        <div className="text-neutral-400 text-[8px] mt-1">Age</div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-3">
                      <div className="text-black text-[12px] font-semibold mb-2">{t('as.preview')}</div>
                      <div className="flex gap-2 overflow-hidden">
                        <MiniScreen tone="violet" icon={<Target className="w-5 h-5" />} title="Focus" value="87%" />
                        <MiniScreen tone="teal" icon={<TrendingUp className="w-5 h-5" />} title="Streak" value="42d" />
                        <MiniScreen tone="orange" icon={<Sparkles className="w-5 h-5" />} title="Goals" value="12/15" />
                      </div>
                    </div>

                    {/* What's New */}
                    <div className="mt-3 border-t border-neutral-200 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="text-black text-[12px] font-semibold">{t('as.whatsNew')}</div>
                        <div className="text-[#0071e3] text-[10px] font-medium">Version History</div>
                      </div>
                      <div className="text-neutral-400 text-[9px] mt-0.5">{t('as.version')}</div>
                      <div className="text-neutral-700 text-[10px] mt-1 leading-snug">
                        {t('as.changelog')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t('as.eyebrow')}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              {t('as.title1')}
              <br />
              {t('as.title2')}{' '}
              <span className="gradient-text">{t('as.title3')}</span>.
            </h2>

            <p className="text-lg text-foreground/60 mb-8 max-w-lg">
              {t('as.subtitle')}
            </p>

            <ul className="space-y-4">
              {['as.check1', 'as.check2', 'as.check3', 'as.check4'].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                  </span>
                  <span className="text-base md:text-lg text-foreground/90">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const toneMap = {
  violet: 'from-violet-500 to-fuchsia-500',
  teal: 'from-teal-400 to-emerald-500',
  orange: 'from-orange-400 to-rose-500',
} as const;

const MiniScreen = ({
  tone,
  icon,
  title,
  value,
}: {
  tone: keyof typeof toneMap;
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="w-[84px] h-[150px] rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 flex flex-col">
    <div className={`h-[60px] bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center text-white`}>
      {icon}
    </div>
    <div className="flex-1 p-2 flex flex-col justify-between">
      <div>
        <div className="text-neutral-400 text-[8px] uppercase tracking-wide">{title}</div>
        <div className="text-black text-[14px] font-bold mt-0.5">{value}</div>
      </div>
      <div className="space-y-1">
        <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
          <div className={`h-full w-3/4 bg-gradient-to-r ${toneMap[tone]}`} />
        </div>
        <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
          <div className={`h-full w-1/2 bg-gradient-to-r ${toneMap[tone]}`} />
        </div>
      </div>
    </div>
  </div>
);

export default AppStoreSection;
