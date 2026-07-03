import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Wrench, Sparkles, Code2, Zap, Palette, Rocket } from 'lucide-react';

const CurriculumSection = () => {
  const { t } = useLanguage();

  const chapters = [
    { key: 'week1', Icon: Wrench,    tools: ['Xcode', 'Apple Developer', 'Claude Code'] },
    { key: 'week2', Icon: Sparkles,  tools: ['Google Stitch', 'Prompting', 'UI Flows'] },
    { key: 'week3', Icon: Code2,     tools: ['SwiftUI', 'Claude Code', 'State'] },
    { key: 'week4', Icon: Zap,       tools: ['Claude Desktop', 'MCP', 'Automation'] },
    { key: 'week5', Icon: Palette,   tools: ['Icon', 'Screenshots', 'Onboarding'] },
    { key: 'week6', Icon: Rocket,    tools: ['App Store Connect', 'Review', 'Launch'] },
  ];

  return (
    <section id="curriculum" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Ambient aurora */}
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-foreground/20" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-foreground/50 font-medium">
              06 · {t('vibe.chapter') || 'Chapters'}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-5">
            {t('curr.title')}
          </h2>
          <p className="text-foreground/50 text-base md:text-lg leading-relaxed">
            {t('curr.subtitle')}
          </p>
        </div>

        {/* Editorial chapter grid */}
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent hidden sm:block" />

          <div className="space-y-5 md:space-y-6">
            {chapters.map((c, i) => {
              const { Icon } = c;
              const isAccent = i % 2 === 0;
              const num = String(i + 1).padStart(2, '0');
              return (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-start gap-5 md:gap-8"
                >
                  {/* Icon node */}
                  <div className="relative shrink-0 z-10">
                    <div
                      className={`w-14 h-14 md:w-[70px] md:h-[70px] rounded-2xl border border-foreground/10 bg-card/60 backdrop-blur-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-foreground/25 ${
                        isAccent
                          ? 'group-hover:shadow-[0_0_40px_-8px_hsl(var(--accent)/0.5)]'
                          : 'group-hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.5)]'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
                          isAccent ? 'text-accent' : 'text-primary'
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-grow relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white/[0.015] backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-foreground/20 hover:bg-white/[0.03] hover:-translate-y-0.5">
                    {/* Inner glow */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${
                        isAccent
                          ? 'bg-[radial-gradient(circle_at_100%_0%,hsl(var(--accent)/0.08),transparent_50%)]'
                          : 'bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.08),transparent_50%)]'
                      }`}
                    />

                    <div className="relative flex flex-col md:flex-row md:items-start md:gap-8">
                      <div className="flex-grow">
                        <div className="flex items-baseline gap-4 mb-3">
                          <span
                            className={`font-display font-bold text-3xl md:text-4xl tabular-nums tracking-tighter opacity-30 ${
                              isAccent ? 'text-accent' : 'text-primary'
                            }`}
                          >
                            {num}
                          </span>
                          <h3 className="font-display text-lg md:text-2xl font-bold text-foreground tracking-tight">
                            {t(`curr.${c.key}`)}
                          </h3>
                        </div>
                        <p className="text-sm md:text-base text-foreground/55 leading-relaxed md:pr-6">
                          {t(`curr.${c.key}.desc`)}
                        </p>
                      </div>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-2 mt-5 md:mt-1 md:flex-col md:items-end md:shrink-0 md:min-w-[160px]">
                        {c.tools.map((tool) => (
                          <span
                            key={tool}
                            className="text-[10px] uppercase tracking-[0.18em] font-medium text-foreground/45 px-2.5 py-1 rounded-full border border-foreground/10 bg-foreground/[0.02] whitespace-nowrap"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Outcome footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 md:mt-20 flex items-center justify-center gap-3 text-center"
        >
          <div className="h-px w-8 md:w-16 bg-foreground/15" />
          <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-foreground/40 font-medium">
            → App Store
          </span>
          <div className="h-px w-8 md:w-16 bg-foreground/15" />
        </motion.div>
      </div>
    </section>
  );
};

export default CurriculumSection;
