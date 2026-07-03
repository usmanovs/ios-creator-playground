import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarDays, Globe, Clock, MapPin } from 'lucide-react';

type Zone = {
  key: string;
  city: string;
  time: string;
  label: string;
  nextDay?: boolean;
  ianaZones: string[];
};

const ScheduleSection = () => {
  const { t } = useLanguage();

  const userZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return '';
    }
  }, []);

  const days = [t('sched.day.mon'), t('sched.day.wed'), t('sched.day.fri')];

  // Base: 8:00 PM EST (New York)
  const zones: Zone[] = [
    {
      key: 'ny',
      city: t('sched.city.ny'),
      time: '8:00 PM',
      label: 'EST',
      ianaZones: ['America/New_York', 'America/Detroit', 'America/Toronto'],
    },
    {
      key: 'moscow',
      city: t('sched.city.moscow'),
      time: '04:00',
      label: 'MSK',
      nextDay: true,
      ianaZones: ['Europe/Moscow'],
    },
    {
      key: 'berlin',
      city: t('sched.city.berlin'),
      time: '02:00',
      label: 'CET',
      nextDay: true,
      ianaZones: ['Europe/Berlin', 'Europe/Paris', 'Europe/Amsterdam', 'Europe/Madrid', 'Europe/Rome'],
    },
    {
      key: 'bishkek',
      city: t('sched.city.bishkek'),
      time: '07:00',
      label: 'UTC+6',
      nextDay: true,
      ianaZones: ['Asia/Bishkek', 'Asia/Almaty'],
    },
  ];

  const activeKey =
    zones.find((z) => z.ianaZones.includes(userZone))?.key ?? 'ny';

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
          Live sessions <span className="text-primary">{t('sched.titleAccent')}</span>
        </h2>
        <p className="text-center text-foreground/50 mb-14">{t('sched.subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Days */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{t('sched.daysTitle')}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {days.map((d) => (
                <span
                  key={d}
                  className="px-5 py-2.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-medium"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Time Zones */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{t('sched.zonesTitle')}</h3>
            </div>
            <div className="space-y-2">
              {zones.map((z) => {
                const isActive = z.key === activeKey;
                return (
                  <div
                    key={z.key}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition ${
                      isActive
                        ? 'bg-primary/10 border-primary/40'
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isActive && <MapPin className="w-4 h-4 text-primary shrink-0" />}
                      <span className={isActive ? 'text-primary font-medium' : 'text-foreground/70'}>
                        {z.city}
                      </span>
                      {isActive && (
                        <span className="text-primary/70 text-sm truncate">
                          ({t('sched.yourZone')})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-foreground/40'}`} />
                      <span className={`font-mono ${isActive ? 'text-primary' : 'text-foreground/80'}`}>
                        {z.time}
                      </span>
                      {z.nextDay && (
                        <span className="text-[10px] uppercase text-foreground/40">+1</span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded bg-foreground/10 text-foreground/60">
                        {z.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
