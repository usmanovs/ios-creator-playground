import { useLanguage } from '@/contexts/LanguageContext';

const CurriculumSection = () => {
  const { t } = useLanguage();

  const weeks = ['week1', 'week2', 'week3', 'week4', 'week5', 'week6'];

  return (
    <section id="curriculum" className="py-20 px-4 relative">
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t('curr.title')}</h2>
        <p className="text-center text-muted-foreground mb-12">{t('curr.subtitle')}</p>

        <div className="space-y-4">
          {weeks.map((week, i) => (
            <div key={week} className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t(`curr.${week}`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`curr.${week}.desc`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
