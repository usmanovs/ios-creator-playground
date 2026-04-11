import { useLanguage } from '@/contexts/LanguageContext';
import { Smartphone } from 'lucide-react';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground">iOS Vibe Coding</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#program" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.program')}</a>
          <a href="#curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.curriculum')}</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.pricing')}</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            {lang === 'en' ? 'RU' : 'EN'}
          </button>
          <a
            href="#pricing"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('nav.enroll')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
