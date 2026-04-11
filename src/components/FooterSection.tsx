import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Instagram } from 'lucide-react';

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">{t('footer.title')}</h2>
        <p className="text-muted-foreground mb-8">{t('footer.question')}</p>

        <div className="flex justify-center gap-4 mb-12">
          <a
            href="https://wa.me/12024554575"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors border border-green-600/30"
          >
            <MessageCircle className="w-5 h-5" />
            {t('footer.whatsapp')}
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
          >
            <Send className="w-5 h-5" />
            {t('footer.telegram')}
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors border border-pink-500/30"
          >
            <Instagram className="w-5 h-5" />
            {t('footer.instagram')}
          </a>
        </div>

        <p className="text-xs text-muted-foreground">{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default FooterSection;
