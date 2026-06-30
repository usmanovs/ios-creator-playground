import { useLanguage } from '@/contexts/LanguageContext';
import { useCountdown } from '@/hooks/useCountdown';
import avatar1 from '@/assets/avatar1.jpg';
import avatar2 from '@/assets/avatar2.jpg';
import avatar3 from '@/assets/avatar3.jpg';
import avatar4 from '@/assets/avatar4.jpg';


const HeroSection = () => {
  const { t } = useLanguage();
  const countdown = useCountdown('2026-05-01T00:00:00+06:00');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="max-w-5xl mx-auto">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/40 border backdrop-blur-xl mb-10 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            {t('hero.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 animate-slide-up">
          <span className="text-foreground">{t('hero.title1')}</span>
          <br />
          <span className="text-foreground">{t('hero.title2')} </span>
          <span className="gradient-text drop-shadow-[0_0_30px_hsl(252_92%_76%/0.4)]">
            {t('hero.title3')}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-14 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
          {t('hero.subtitle')}
        </p>

        {/* Countdown */}
        <div className="flex justify-center items-end gap-6 md:gap-10 mb-10 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          {[
            { val: countdown.days, label: t('countdown.days') },
            { val: countdown.hours, label: t('countdown.hours') },
            { val: countdown.minutes, label: t('countdown.minutes') },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-end gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mt-1">
                  {item.label}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="text-4xl md:text-5xl font-bold text-foreground/20 leading-none pb-5">:</div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/12024554575"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-12 py-5 rounded-2xl font-bold text-lg md:text-xl text-primary-foreground transition-all hover:scale-105 active:scale-95 animate-slide-up"
          style={{
            background: 'var(--gradient-violet)',
            boxShadow: 'var(--shadow-glow-violet)',
            animationDelay: '0.45s',
            animationFillMode: 'backwards',
          }}
        >
          {t('hero.cta')}
        </a>

        {/* Social proof */}
        <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
          <div className="inline-flex items-center gap-4 pl-3 pr-6 py-2.5 rounded-full bg-card/40 border backdrop-blur-xl">
            <div className="flex -space-x-3">
              {[
                avatar1,
                avatar2,
                avatar3,
                avatar4,
              ].map((src, i) => (
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

      </div>
    </section>
  );
};

export default HeroSection;
