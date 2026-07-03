import { useLanguage } from '@/contexts/LanguageContext';
import instructorPhoto from '@/assets/instructor.jpg.asset.json';

const InstructorSection = () => {
  const { t } = useLanguage();

  const fullName = t('instructor.name');
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  const companies = [
    { name: 'Deloitte', domain: 'deloitte.com', revenue: '$67B' },
    { name: 'Accenture', domain: 'accenture.com', revenue: '$70B' },
    { name: 'General Dynamics IT', domain: 'gdit.com', revenue: '$8B' },
    { name: 'Koniag Government Services', domain: 'koniag-gs.com', revenue: '$1B' },
  ];

  return (
    <section id="program" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Ambient aurora glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch bg-card/40 backdrop-blur-2xl border border-foreground/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
            {/* Portrait */}
            <div className="relative w-full lg:w-2/5 shrink-0">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[360px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
                <img
                  src={instructorPhoto.url}
                  alt={fullName}
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" aria-hidden="true" />
              </div>

              {/* Floating stat — Tech Lead Roles */}
              <div className="absolute right-3 top-10 lg:-right-6 lg:top-12 p-3 md:p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-foreground/10 shadow-xl">
                <div className="font-display text-2xl font-bold text-foreground leading-none">4</div>
                <div className="mt-1 text-[10px] uppercase tracking-tight text-primary font-bold leading-tight">
                  {t('instructor.techLead')}
                </div>
              </div>

              {/* Floating stat — Students */}
              <div className="absolute left-3 bottom-12 lg:-left-4 lg:bottom-16 p-3 md:p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-foreground/10 shadow-xl">
                <div className="font-display text-2xl font-bold text-foreground leading-none">500+</div>
                <div className="mt-1 text-[10px] uppercase tracking-tight text-accent font-bold leading-tight">
                  {t('instructor.students')}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between w-full lg:w-3/5 space-y-8 lg:space-y-10">
              <div className="space-y-6">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10">
                  <span className="flex h-2 w-2 rounded-full bg-accent" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
                    {t('instructor.title')}
                  </span>
                </div>

                {/* Name + bio */}
                <div className="space-y-3">
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[0.95]">
                    {firstName}
                    {lastName && (
                      <>
                        {' '}
                        <span className="gradient-text">{lastName}</span>
                      </>
                    )}
                  </h3>
                  <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-xl">
                    {t('instructor.bio')}
                  </p>
                </div>

                {/* Experience + philosophy */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-center">
                  <div className="shrink-0">
                    <div className="font-display text-3xl font-bold text-foreground leading-none">8+</div>
                    <div className="mt-1 text-xs text-foreground/40 uppercase font-bold tracking-[0.18em]">
                      {t('instructor.experience')}
                    </div>
                  </div>
                  <div className="hidden sm:block h-12 w-px bg-foreground/10" />
                  <p className="text-sm text-foreground/50 italic max-w-[280px] leading-relaxed">
                    {t('instructor.philosophy')}
                  </p>
                </div>
              </div>

              {/* Company trust grid */}
              <div className="space-y-5 pt-6 border-t border-foreground/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
                  <p className="text-xs md:text-sm font-bold text-foreground/60 uppercase tracking-[0.18em]">
                    {t('instructor.companiesHeadline')}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {companies.map((c) => (
                    <div
                      key={c.name}
                      className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-foreground/[0.04] border border-foreground/10 hover:border-primary/30 hover:bg-foreground/[0.07] transition-all duration-300 min-h-[5rem]"
                      title={c.name}
                    >
                      <img
                        src={`https://img.logo.dev/${c.domain}?token=${import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY}&size=200&format=png&theme=dark`}
                        alt={`${c.name} logo`}
                        className="max-h-8 max-w-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                      />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wide">
                        {c.revenue} {t('instructor.revenue')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
