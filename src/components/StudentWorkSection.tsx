import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import amanVideo from '@/assets/aman-demo.mp4.asset.json';
import amanPoster from '@/assets/aman-poster.jpg.asset.json';
import elnuraVideo from '@/assets/elnura-demo.mp4.asset.json';
import elnuraPoster from '@/assets/elnura-poster.jpg.asset.json';

const StudentWorkSection = () => {
  const { t } = useLanguage();

  const works = [
    {
      video: amanVideo.url,
      poster: amanPoster.url,
      name: t('work.aman.name'),
      role: t('work.aman.role'),
      app: t('work.aman.app'),
      desc: t('work.aman.desc'),
    },
    {
      video: elnuraVideo.url,
      poster: elnuraPoster.url,
      name: t('work.elnura.name'),
      role: t('work.elnura.role'),
      app: t('work.elnura.app'),
      desc: t('work.elnura.desc'),
    },
  ];

  return (
    <section id="student-work" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            {t('work.badge')}
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-foreground">{t('work.title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('work.subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {works.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 flex flex-col items-center text-center"
            >
              <div className="relative rounded-[2rem] border border-border/60 bg-black/40 p-2 shadow-2xl">
                <video
                  className="w-[240px] aspect-[9/19] object-cover bg-black rounded-[1.6rem]"
                  src={w.video}
                  poster={w.poster}
                  controls
                  playsInline
                  muted
                  loop
                  preload="metadata"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{w.app}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
              <div className="mt-4 pt-4 border-t border-border/60 w-full">
                <p className="font-medium text-foreground">{w.name}</p>
                <p className="text-sm text-muted-foreground">{w.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentWorkSection;
