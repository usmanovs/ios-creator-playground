import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, Users, Clock } from 'lucide-react';
import instructorPhoto from '@/assets/instructor.jpg.asset.json';

const InstructorSection = () => {
  const { t } = useLanguage();

  return (
    <section id="program" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-10 md:p-16 flex flex-col md:flex-row gap-12 md:gap-16 items-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-4 opacity-30 blur-2xl rounded-full"
              style={{ background: 'var(--gradient-aurora)' }}
            />
            <img
              src={instructorPhoto.url}
              alt={t('instructor.name')}
              className="relative w-44 h-44 md:w-56 md:h-56 rounded-[2rem] object-cover border-2 border-foreground/20 shadow-2xl"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              {t('instructor.title')}
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('instructor.name')}
            </h3>
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed mb-10">
              {t('instructor.bio')}
            </p>
            <div className="grid grid-cols-3 gap-6 md:gap-8 mb-10">
              {[
                { icon: AppWindow, val: '10+', label: t('instructor.apps') },
                { icon: Users, val: '500+', label: t('instructor.students') },
                { icon: Clock, val: '8+', label: t('instructor.experience') },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-foreground/10">
              <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">
                {t('instructor.techLeadAt')}
              </div>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
                {[
                  { name: 'Deloitte', domain: 'deloitte.com' },
                  { name: 'Accenture', domain: 'accenture.com' },
                  { name: 'General Dynamics IT', domain: 'gdit.com' },
                  { name: 'Koniag Government Services', domain: 'koniag-gs.com' },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-center h-12 px-4 rounded-lg bg-foreground/5 border border-foreground/10"
                    title={c.name}
                  >
                    <img
                      src={`https://img.logo.dev/${c.domain}?token=${import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY}&size=120&format=png&theme=dark`}
                      alt={`${c.name} logo`}
                      className="max-h-8 w-auto object-contain opacity-90"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
