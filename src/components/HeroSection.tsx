import { useLanguage } from '@/contexts/LanguageContext';
import { useCountdown } from '@/hooks/useCountdown';
import { Users, Calendar, Target, GraduationCap, Presentation } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  const countdown = useCountdown('2026-05-01T00:00:00+06:00');

  return (
    <section className="pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8">
          {t('hero.badge')}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="text-foreground">{t('hero.title1')}</span>
          <br />
          <span className="text-foreground">{t('hero.title2')} </span>
          <span className="gradient-text">{t('hero.title3')}</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">{t('countdown.starts')}</p>
          <div className="flex justify-center gap-3">
            {[
              { val: countdown.days, label: t('countdown.days') },
              { val: countdown.hours, label: t('countdown.hours') },
              { val: countdown.minutes, label: t('countdown.minutes') },
              { val: countdown.seconds, label: t('countdown.seconds') },
            ].map((item, i) => (
              <div key={i} className="glass-card px-4 py-3 min-w-[70px]">
                <div className="text-2xl font-bold text-foreground">{String(item.val).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/12024554575"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-8 py-4 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
        >
          {t('hero.cta')}
        </a>

        {/* Student count */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>47+ {t('hero.students')}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: Calendar, label: t('hero.startDate'), value: t('hero.startDateVal') },
            { icon: Target, label: t('hero.goal'), value: t('hero.goalVal') },
            { icon: GraduationCap, label: t('hero.instructor'), value: t('hero.instructorVal') },
            { icon: Presentation, label: t('hero.demo'), value: t('hero.demoVal') },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-sm font-semibold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
