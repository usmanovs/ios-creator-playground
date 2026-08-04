import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, ThumbsUp, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Status = 'todo' | 'in_progress' | 'accomplished';

type Note = { id: string; text: string; status: Status };

type Col = 'well' | 'improve';

const STATUSES: { value: Status; label: string; cls: string }[] = [
  { value: 'todo', label: 'To do', cls: 'border-foreground/20 bg-foreground/5 text-foreground/60' },
  { value: 'in_progress', label: 'In progress', cls: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
  { value: 'accomplished', label: 'Accomplished', cls: 'border-accent/40 bg-accent/15 text-accent' },
];

function normalizeStatus(s: string | null): Status {
  return s === 'in_progress' || s === 'accomplished' ? s : 'todo';
}


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
  onStatus,
  onEdit,
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
  onStatus: (id: string, status: Status) => void;
  onEdit: (col: Col, id: string, text: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const startEdit = (n: Note) => {
    setEditingId(n.id);
    setEditDraft(n.text);
  };

  const commitEdit = (n: Note) => {
    const t = editDraft.trim();
    setEditingId(null);
    if (t && t !== n.text) onEdit(col, n.id, t);
  };

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
            className="group rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 text-sm text-foreground/90"
          >
            <div className="flex items-start gap-2">
              {editingId === n.id ? (
                <input
                  autoFocus
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onBlur={() => commitEdit(n)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      commitEdit(n);
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  className="flex-1 rounded-lg border border-accent/40 bg-background/60 px-2 py-1 text-sm text-foreground focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => startEdit(n)}
                  title="Click to edit"
                  className={`flex-1 text-left leading-relaxed ${
                    col === 'improve' && n.status === 'accomplished'
                      ? 'line-through text-foreground/40'
                      : ''
                  }`}
                >
                  {n.text}
                </button>
              )}
              <button
                onClick={() => onRemove(col, n.id)}
                className="opacity-0 group-hover:opacity-100 transition text-foreground/40 hover:text-destructive shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>


            {col === 'improve' && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onStatus(n.id, s.value)}
                    className={`px-2 py-0.5 rounded-full border text-[11px] font-medium transition ${
                      n.status === s.value
                        ? s.cls
                        : 'border-foreground/10 text-foreground/40 hover:text-foreground/70 hover:border-foreground/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
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
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      setAuthReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      setWell([]);
      setImprove([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('retro_items')
        .select('id, category, content, status')
        .order('created_at', { ascending: false });
      if (!active || error) {
        setLoading(false);
        return;
      }
      const rows = (data ?? []) as { id: string; category: string; content: string; status: string | null }[];
      const toNote = (r: typeof rows[number]): Note => ({
        id: r.id,
        text: r.content,
        status: normalizeStatus(r.status),
      });
      setWell(rows.filter((r) => r.category === 'well').map(toNote));
      setImprove(rows.filter((r) => r.category === 'improve').map(toNote));
      setLoading(false);
    })();
    return () => { active = false; };
  }, [authReady, userId]);

  const add = async (col: Col, text: string, setter: (v: string) => void) => {
    const t = text.trim();
    if (!t || !userId) return;
    setter('');
    const { data, error } = await supabase
      .from('retro_items')
      .insert({ category: col, content: t, status: 'todo', created_by: userId })
      .select('id')
      .single();
    if (error || !data) {
      setter(t); // restore draft on failure
      return;
    }
    const note: Note = { id: data.id, text: t, status: 'todo' };
    if (col === 'well') setWell((p) => [note, ...p]);
    else setImprove((p) => [note, ...p]);
  };

  const remove = async (col: Col, id: string) => {
    if (col === 'well') setWell((p) => p.filter((n) => n.id !== id));
    else setImprove((p) => p.filter((n) => n.id !== id));
    await supabase.from('retro_items').delete().eq('id', id);
  };

  const setStatus = async (id: string, status: Status) => {
    setImprove((p) => p.map((n) => (n.id === id ? { ...n, status } : n)));
    await supabase.from('retro_items').update({ status }).eq('id', id);
  };

  const editNote = async (col: Col, id: string, text: string) => {
    const setter = col === 'well' ? setWell : setImprove;
    setter((p) => p.map((n) => (n.id === id ? { ...n, text } : n)));
    await supabase.from('retro_items').update({ content: text }).eq('id', id);
  };


  const stats = useMemo(() => {
    const wellCount = well.length;
    const improveCount = improve.length;
    const total = wellCount + improveCount;
    const wellPct = total ? (wellCount / total) * 100 : 0;
    const improvePct = total ? (improveCount / total) * 100 : 0;
    const todo = improve.filter((n) => n.status === 'todo').length;
    const inProgress = improve.filter((n) => n.status === 'in_progress').length;
    const done = improve.filter((n) => n.status === 'accomplished').length;
    return { wellCount, improveCount, total, wellPct, improvePct, todo, inProgress, done };
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

              {/* Implementation tracking for improvement items */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-foreground/5">
                <span className="text-[11px] uppercase tracking-wider text-foreground/40 mr-1">
                  Implementation
                </span>
                <span className="px-2 py-0.5 rounded-full border border-foreground/20 bg-foreground/5 text-foreground/60 text-[11px] font-medium tabular-nums">
                  To do {stats.todo}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-[11px] font-medium tabular-nums">
                  In progress {stats.inProgress}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-accent/40 bg-accent/15 text-accent text-[11px] font-medium tabular-nums">
                  Accomplished {stats.done}
                </span>
                <span className="ml-auto text-[11px] font-mono text-foreground/40 tabular-nums">
                  {stats.improveCount ? Math.round((stats.done / stats.improveCount) * 100) : 0}% done
                </span>
              </div>
            </div>


            {!authReady || loading ? (
              <p className="text-sm text-foreground/40 py-10 text-center">Loading notes…</p>
            ) : !userId ? (
              <div className="glass-card p-8 text-center">
                <h2 className="font-display text-xl font-black tracking-tight text-foreground mb-2">
                  Sign in to view the retro board
                </h2>
                <p className="text-sm text-foreground/60 mb-5">
                  The board is shared with the class, so it's only visible to signed-in members.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20 transition"
                >
                  Sign in
                </Link>
              </div>
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
                onStatus={setStatus}
                onEdit={editNote}
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
                onStatus={setStatus}
                onEdit={editNote}

              />
            </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Retro;
