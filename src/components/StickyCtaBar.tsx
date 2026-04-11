import { useLanguage } from '@/contexts/LanguageContext';
import { useCountdown } from '@/hooks/useCountdown';

const StickyCtaBar = () => {
  const { t } = useLanguage();
  const countdown = useCountdown('2026-05-01T00:00:00+06:00');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{t('sticky.text')}</span>
          <div className="flex gap-2 text-sm font-mono">
            <span className="text-primary font-bold">{countdown.days}d</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-primary font-bold">{String(countdown.hours).padStart(2, '0')}h</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-primary font-bold">{String(countdown.minutes).padStart(2, '0')}m</span>
          </div>
        </div>
        <a
          href="https://wa.me/12024554575"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-6 py-2.5 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all sm:ml-auto"
        >
          {t('sticky.cta')}
        </a>
      </div>
    </div>
  );
};

export default StickyCtaBar;
