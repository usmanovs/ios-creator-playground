import { useLanguage } from '@/contexts/LanguageContext';
import { AppWindow, Users, Clock } from 'lucide-react';

const InstructorSection = () => {
  const { t } = useLanguage();

  return (
    <section id="program" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('instructor.title')}</h2>
        <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
            <span className="text-4xl">👨‍💻</span>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-2">{t('instructor.name')}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{t('instructor.bio')}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {[
                { icon: AppWindow, val: '10+', label: t('instructor.apps') },
                { icon: Users, val: '500+', label: t('instructor.students') },
                { icon: Clock, val: '8+', label: t('instructor.experience') },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground">{s.val}</span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
