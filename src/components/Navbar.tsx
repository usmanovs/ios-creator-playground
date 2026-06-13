import { useLanguage } from '@/contexts/LanguageContext';
import { Smartphone } from 'lucide-react';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-foreground/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">iOS Vibe Coding</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '#program', label: t('nav.program') },
            { href: '#curriculum', label: t('nav.curriculum') },
            { href: '#pricing', label: t('nav.pricing') },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="px-3 py-1.5 text-xs font-bold rounded-full border border-foreground/10 bg-card/40 text-foreground/70 hover:bg-card/60 transition-colors"
          >
            {lang === 'en' ? 'RU' : 'EN'}
          </button>
          <a
            href="#pricing"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            {t('nav.enroll')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
