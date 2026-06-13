import { useLanguage } from '@/contexts/LanguageContext';

const CurriculumSection = () => {
  const { t } = useLanguage();

  const weeks = ['week1', 'week2', 'week3', 'week4', 'week5', 'week6'];

  return (
    <section id="curriculum" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('curr.title')}
          </h2>
          <p className="text-foreground/50 text-base md:text-lg">{t('curr.subtitle')}</p>
        </div>

        <div>
          {weeks.map((week, i) => {
            const isAccent = i % 2 === 0;
            const isLast = i === weeks.length - 1;
            return (
              <div key={week} className="flex group">
                <div className="flex flex-col items-center mr-6 md:mr-8">
                  <div
                    className={`w-11 h-11 rounded-full bg-card/60 border flex items-center justify-center font-display font-bold transition-all group-hover:scale-110 ${
                      isAccent
                        ? 'text-accent group-hover:bg-accent group-hover:text-accent-foreground'
                        : 'text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {!isLast && <div className="w-px flex-grow bg-foreground/10 mt-2" />}
                </div>
                <div className={`flex-grow ${isLast ? '' : 'pb-6'}`}>
                  <div className="glass-card glass-card-hover p-7 md:p-8">
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">
                      {t(`curr.${week}`)}
                    </h3>
                    <p className="text-sm md:text-base text-foreground/50 leading-relaxed">
                      {t(`curr.${week}.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
