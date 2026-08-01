import { motion } from 'framer-motion';
import { Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import amanPhoto from '@/assets/aman.png.asset.json';

const StudentWorkSection = () => {
  const { t } = useLanguage();

  const works = [
    {
      video: '/student/aman-demo.mp4',
      poster: '/student/aman-poster.jpg',
      name: t('work.aman.name'),
      role: t('work.aman.role'),
      location: t('work.aman.location'),
      flag: '🇰🇷',
      photo: amanPhoto.url,
      before: '',
      app: t('work.aman.app'),
      desc: t('work.aman.desc'),
    },

    {
      video: '/student/elnura-demo.mp4',
      poster: '/student/elnura-poster.jpg',
      name: t('work.elnura.name'),
      role: t('work.elnura.role'),
      location: t('work.elnura.location'),
      flag: '🇺🇸',
      before: '',
      app: t('work.elnura.app'),
      desc: t('work.elnura.desc'),
    },
    {
      video: '/student/nurgul-demo.mp4',
      poster: '/student/nurgul-poster.jpg',
      name: t('work.nurgul.name'),
      role: t('work.nurgul.role'),
      location: t('work.nurgul.location'),
      flag: '🇰🇬',
      before: t('work.nurgul.before'),
      app: t('work.nurgul.app'),
      desc: t('work.nurgul.desc'),
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
              <div className="mt-5 w-full rounded-xl border border-primary/25 bg-primary/10 px-4 py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground">
                    {w.name.charAt(0)}
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs leading-none">
                      {w.flag}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-foreground leading-tight">{w.name}</p>
                    <p className="text-sm text-foreground/70 leading-snug">{w.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-foreground/80">
                    <MapPin className="h-3 w-3 text-primary" />
                    {w.location}
                  </span>
                  {w.before && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-foreground/80">
                      <GraduationCap className="h-3 w-3 text-primary" />
                      {w.before}
                    </span>
                  )}
                </div>
              </div>


            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentWorkSection;
