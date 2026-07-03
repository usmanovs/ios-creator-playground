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
                { icon: Briefcase, val: '4', label: t('instructor.techLead') },
                { icon: Users, val: '500+', label: t('instructor.students') },
                { icon: Clock, val: '8+', label: t('instructor.experience') },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-foreground/10">
              <h4 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                {t('instructor.companiesHeadline')}
              </h4>
              <p className="text-accent text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
                {t('instructor.techLeadAt')}
              </p>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-5 items-stretch justify-center md:justify-start">
                {[
                  { name: 'Deloitte', domain: 'deloitte.com', revenue: '$67B' },
                  { name: 'Accenture', domain: 'accenture.com', revenue: '$70B' },
                  { name: 'General Dynamics IT', domain: 'gdit.com', revenue: '$8B' },
                  { name: 'Koniag Government Services', domain: 'koniag-gs.com', revenue: '$1B' },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="group flex flex-col items-center justify-center gap-2 min-h-[5.5rem] md:min-w-[9rem] px-5 py-4 rounded-2xl bg-foreground/[0.04] border border-foreground/15 hover:border-accent/40 hover:bg-foreground/[0.07] transition-all duration-300"
                    title={c.name}
                  >
                    <img
                      src={`https://img.logo.dev/${c.domain}?token=${import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY}&size=200&format=png&theme=dark`}
                      alt={`${c.name} logo`}
                      className="max-h-11 md:max-h-12 max-w-full w-auto object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/35">
                      {c.revenue} {t('instructor.revenue')}
                    </span>
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
