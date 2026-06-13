import { useLanguage } from '@/contexts/LanguageContext';
import { Video, CalendarDays, Clock, PlayCircle } from 'lucide-react';

const ScheduleSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
          {t('sched.title')}
        </h2>
        <p className="text-center text-foreground/50 mb-16">{t('sched.subtitle')}</p>

        <div className="glass-card p-8 md:p-12">
          <div className="divide-y divide-foreground/5">
            {[
              { icon: Video, text: t('sched.format') },
              { icon: CalendarDays, text: t('sched.days') },
              { icon: Clock, text: t('sched.time') },
              { icon: Clock, text: t('sched.duration') },
              { icon: PlayCircle, text: t('sched.recorded') },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-5 py-4 first:pt-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground/90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
