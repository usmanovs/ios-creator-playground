import { useLanguage } from '@/contexts/LanguageContext';
import { useCountdown } from '@/hooks/useCountdown';
import { DollarSign, Users, Rocket, Calendar, Code2 } from 'lucide-react';
import avatar1 from '@/assets/avatar1.jpg';
import avatar2 from '@/assets/avatar2.jpg';
import avatar3 from '@/assets/avatar3.jpg';
import avatar4 from '@/assets/avatar4.jpg';

const HeroSection = () => {
  const { t } = useLanguage();
  const countdown = useCountdown('2026-05-01T00:00:00+06:00');

  const stats = [
    { icon: Users, val: t('hero.stat1.val'), label: t('hero.stat1.label') },
    { icon: Rocket, val: t('hero.stat2.val'), label: t('hero.stat2.label') },
    { icon: Calendar, val: t('hero.stat3.val'), label: t('hero.stat3.label') },
    { icon: Code2, val: t('hero.stat4.val'), label: t('hero.stat4.label') },
  ];

  const countdownItems = [
    { val: countdown.days, label: t('countdown.days') },
    { val: countdown.hours, label: t('countdown.hours') },
    { val: countdown.minutes, label: t('countdown.minutes') },
    { val: countdown.seconds, label: t('countdown.seconds') },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-xl mb-10 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-medium text-accent">
            {t('hero.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 animate-slide-up">
          <span className="text-foreground">{t('hero.title1')} </span>
          <span className="text-foreground">{t('hero.title2')} </span>
          <span className="gradient-text drop-shadow-[0_0_30px_hsl(252_92%_76%/0.4)]">
            {t('hero.title3')}
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-3 animate-slide-up"
          style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}
        >
          {t('hero.subtitle')}
        </p>
        <p
          className="text-lg md:text-xl font-semibold text-accent max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          {t('hero.subtitleAccent')}
        </p>

        {/* Social proof */}
        <div
          className="flex justify-center mb-8 animate-fade-in"
          style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          <div className="inline-flex items-center gap-4 pl-3 pr-6 py-2.5 rounded-full bg-card/40 border backdrop-blur-xl">
            <div className="flex -space-x-3">
              {[avatar1, avatar2, avatar3, avatar4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                />
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-background bg-accent text-accent-foreground flex items-center justify-center text-[11px] font-bold">
                +300
              </div>
            </div>
            <p className="text-sm md:text-base font-semibold text-foreground">
              300+ <span className="text-foreground/50 font-normal">{t('hero.students')}</span>
            </p>
          </div>
        </div>

        {/* Revenue callout */}
        <div
          className="max-w-3xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm md:text-base text-foreground/80 text-left">
              {t('hero.revenue')}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 animate-slide-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          {stats.map(({ icon: Icon, val, label }, i) => (
            <div
              key={i}
              className="glass-card !rounded-2xl px-4 py-6 flex flex-col items-center text-center"
            >
              <Icon className="w-5 h-5 text-accent mb-3" />
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                {val}
              </div>
              <div className="text-xs text-foreground/50">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/12024554575"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-12 py-5 rounded-2xl font-bold text-lg md:text-xl text-primary-foreground transition-all hover:scale-105 active:scale-95 animate-slide-up mb-14"
          style={{
            background: 'var(--gradient-violet)',
            boxShadow: 'var(--shadow-glow-violet)',
            animationDelay: '0.45s',
            animationFillMode: 'backwards',
          }}
        >
          {t('hero.cta')}
        </a>

        {/* Countdown */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.55s', animationFillMode: 'backwards' }}
        >
          <div className="text-[11px] uppercase tracking-[0.25em] text-foreground/40 mb-5">
            {t('hero.countdownTitle')}
          </div>
          <div className="flex justify-center items-end gap-3 md:gap-5">
            {countdownItems.map((item, i, arr) => (
              <div key={i} className="flex items-end gap-3 md:gap-5">
                <div className="flex flex-col items-center">
                  <div className="glass-card !rounded-2xl px-5 md:px-7 py-4 min-w-[80px] md:min-w-[110px]">
                    <div className="font-display text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                      {String(item.val).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mt-2">
                    {item.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-3xl md:text-4xl font-bold text-foreground/20 leading-none pb-8">
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
