import { useLanguage } from '@/contexts/LanguageContext';
import { Video, CalendarDays, Clock, PlayCircle } from 'lucide-react';

const ScheduleSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t('sched.title')}</h2>
        <p className="text-center text-muted-foreground mb-12">{t('sched.subtitle')}</p>

        <div className="glass-card p-8">
          <div className="space-y-5">
            {[
              { icon: Video, text: t('sched.format') },
              { icon: CalendarDays, text: t('sched.days') },
              { icon: Clock, text: t('sched.time') },
              { icon: Clock, text: t('sched.duration') },
              { icon: PlayCircle, text: t('sched.recorded') },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-4">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
