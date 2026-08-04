import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, ThumbsUp, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Note = { id: string; text: string };

type Col = 'well' | 'improve';

function Column({
  title,
  icon,
  accent,
  items,
  draft,
  setDraft,
  col,
  onAdd,
  onRemove,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  items: Note[];
  draft: string;
  setDraft: (v: string) => void;
  col: Col;
  onAdd: (col: Col, text: string, setter: (v: string) => void) => void;
  onRemove: (col: Col, id: string) => void;
}) {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="font-display text-lg font-black tracking-tight text-foreground">
          {title}
        </h2>
        <span className="ml-auto text-xs font-mono text-foreground/40 tabular-nums">
          {items.length}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd(col, draft, setDraft);
            }
          }}
          placeholder="Type and press Enter…"
          className="flex-1 rounded-xl border border-foreground/10 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50 transition"
        />
        <button
          onClick={() => onAdd(col, draft, setDraft)}
          className={`inline-flex items-center justify-center size-9 rounded-xl border transition shrink-0 ${accent}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-foreground/30 py-6 text-center">Nothing yet</p>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className="group flex items-start gap-2 rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 text-sm text-foreground/90"
          >
            <span className="flex-1 leading-relaxed">{n.text}</span>
            <button
              onClick={() => onRemove(col, n.id)}
              className="opacity-0 group-hover:opacity-100 transition text-foreground/40 hover:text-destructive shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const Retro = () => {
  const [well, setWell] = useState<Note[]>([]);
  const [improve, setImprove] = useState<Note[]>([]);
  const [wellDraft, setWellDraft] = useState('');
  const [improveDraft, setImproveDraft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('retro_items')
        .select('id, category, content')
        .order('created_at', { ascending: false });
      if (!active || error) {
        setLoading(false);
        return;
      }
      const rows = (data ?? []) as { id: string; category: string; content: string }[];
      setWell(rows.filter((r) => r.category === 'well').map((r) => ({ id: r.id, text: r.content })));
      setImprove(rows.filter((r) => r.category === 'improve').map((r) => ({ id: r.id, text: r.content })));
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const add = async (col: Col, text: string, setter: (v: string) => void) => {
    const t = text.trim();
    if (!t) return;
    setter('');
    const { data, error } = await supabase
      .from('retro_items')
      .insert({ category: col, content: t })
      .select('id')
      .single();
    if (error || !data) {
      setter(t); // restore draft on failure
      return;
    }
    const note = { id: data.id, text: t };
    if (col === 'well') setWell((p) => [note, ...p]);
    else setImprove((p) => [note, ...p]);
  };

  const remove = async (col: Col, id: string) => {
    if (col === 'well') setWell((p) => p.filter((n) => n.id !== id));
    else setImprove((p) => p.filter((n) => n.id !== id));
    await supabase.from('retro_items').delete().eq('id', id);
  };

  const stats = useMemo(() => {
    const wellCount = well.length;
    const improveCount = improve.length;
    const total = wellCount + improveCount;
    const wellPct = total ? (wellCount / total) * 100 : 0;
    const improvePct = total ? (improveCount / total) * 100 : 0;
    return { wellCount, improveCount, total, wellPct, improvePct };
  }, [well, improve]);

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="aurora-bg" aria-hidden />

      <div className="relative z-10">
        <header className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 backdrop-blur-2xl bg-background/70">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              Retro
            </span>
            <div className="w-16" />
          </div>
        </header>

        <section className="pt-24 px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-2">
              Sprint <span className="gradient-text">Retro</span>
            </h1>
            <p className="text-sm md:text-base text-foreground/60 mb-6">
              What went well · What to improve
            </p>

            {/* KPI strip — mirrors the two retro columns */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="glass-card px-4 py-3 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-2xl font-black tracking-tight text-foreground leading-none tabular-nums">
                    {stats.wellCount}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/40 mt-1">
                    What went well
                  </div>
                </div>
              </div>

              <div className="glass-card px-4 py-3 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-2xl font-black tracking-tight text-foreground leading-none tabular-nums">
                    {stats.improveCount}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/40 mt-1">
                    What to improve
                  </div>
                </div>
              </div>
            </div>

            {/* Split bar — well vs improve proportion */}
            <div className="glass-card px-4 py-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-accent shrink-0">well</span>
                <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-foreground/10">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-all duration-500"
                    style={{ width: `${stats.wellPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 bg-amber-400 transition-all duration-500"
                    style={{ left: `${stats.wellPct}%`, width: `${stats.improvePct}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-amber-300 shrink-0">improve</span>
                <span className="text-[11px] font-mono text-foreground/40 tabular-nums shrink-0">
                  {stats.wellCount}/{stats.improveCount}
                </span>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-foreground/40 py-10 text-center">Loading notes…</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Column
                title="What went well"
                icon={<ThumbsUp className="w-5 h-5 text-accent" />}
                accent="border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
                items={well}
                draft={wellDraft}
                setDraft={setWellDraft}
                col="well"
                onAdd={add}
                onRemove={remove}
              />
              <Column
                title="What to improve"
                icon={<Lightbulb className="w-5 h-5 text-amber-300" />}
                accent="border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                items={improve}
                draft={improveDraft}
                setDraft={setImproveDraft}
                col="improve"
                onAdd={add}
                onRemove={remove}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Retro;
