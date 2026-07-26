import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  ArrowBigUp,
  Share2,
  Check,
  Rocket,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

type RetroStatus = 'open' | 'planned' | 'in_progress' | 'done';

type RetroItem = {
  id: string;
  category: 'well' | 'improve';
  content: string;
  author: string | null;
  created_at: string;
  status: RetroStatus;
};

const STATUS_ORDER: RetroStatus[] = ['open', 'planned', 'in_progress', 'done'];

const STATUS_STYLES: Record<RetroStatus, string> = {
  open: 'border-foreground/20 bg-foreground/5 text-muted-foreground',
  planned: 'border-sky-400/50 bg-sky-400/10 text-sky-300',
  in_progress: 'border-amber-400/50 bg-amber-400/10 text-amber-300',
  done: 'border-accent/60 bg-accent/15 text-accent',
};

function getVoterId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'retro_voter_id';
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id =
      (window.crypto?.randomUUID?.() as string) ||
      `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

function ShareButton({ variant = 'icon' }: { variant?: 'icon' | 'button' }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/retro`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t('retro.share.title'), url });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/60 backdrop-blur-xl px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/10 transition"
      >
        {copied ? <Check className="w-4 h-4 text-accent" /> : <Share2 className="w-4 h-4" />}
        <span>{copied ? t('retro.share.copied') : t('retro.share')}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={t('retro.share')}
      className="inline-flex items-center justify-center size-9 rounded-lg border border-accent/40 bg-card/60 text-accent hover:bg-accent/10 transition"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
    </button>
  );
}

function RetroInner() {
  const { t, lang, setLang } = useLanguage();
  const [items, setItems] = useState<RetroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [voterId, setVoterId] = useState('');
  const [pendingVote, setPendingVote] = useState<string | null>(null);

  const [category, setCategory] = useState<'well' | 'improve'>('well');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('retro_items')
      .select('id,category,content,author,created_at,status')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && data) setItems(data as RetroItem[]);
    setLoading(false);
  };

  const loadVotes = async (vid: string) => {
    const { data } = await supabase.from('retro_votes').select('item_id,voter_id');
    if (!data) return;
    const counts: Record<string, number> = {};
    const mine = new Set<string>();
    for (const row of data as { item_id: string; voter_id: string }[]) {
      counts[row.item_id] = (counts[row.item_id] || 0) + 1;
      if (row.voter_id === vid) mine.add(row.item_id);
    }
    setVoteCounts(counts);
    setMyVotes(mine);
  };

  useEffect(() => {
    const vid = getVoterId();
    setVoterId(vid);
    loadItems();
    loadVotes(vid);
  }, []);

  const onVote = async (itemId: string) => {
    if (!voterId || myVotes.has(itemId) || pendingVote) return;
    setPendingVote(itemId);
    setMyVotes((s) => new Set(s).add(itemId));
    setVoteCounts((c) => ({ ...c, [itemId]: (c[itemId] || 0) + 1 }));
    const { error } = await supabase
      .from('retro_votes')
      .insert({ item_id: itemId, voter_id: voterId });
    if (error) {
      setMyVotes((s) => {
        const n = new Set(s);
        n.delete(itemId);
        return n;
      });
      setVoteCounts((c) => ({ ...c, [itemId]: Math.max(0, (c[itemId] || 1) - 1) }));
    }
    setPendingVote(null);
  };

  const onStatusChange = async (itemId: string, status: RetroStatus) => {
    const prev = items;
    setItems((list) => list.map((i) => (i.id === itemId ? { ...i, status } : i)));
    const { error } = await supabase.from('retro_items').update({ status }).eq('id', itemId);
    if (error) setItems(prev);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const trimmed = content.trim();
    if (trimmed.length < 2) {
      setMsg({ kind: 'err', text: t('retro.form.err.empty') });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('retro_items').insert({
      category,
      content: trimmed.slice(0, 500),
      author: author.trim() ? author.trim().slice(0, 60) : null,
    });
    setSubmitting(false);
    if (error) {
      setMsg({ kind: 'err', text: t('retro.form.err') });
      return;
    }
    setContent('');
    setAuthor('');
    setMsg({ kind: 'ok', text: t('retro.form.success') });
    loadItems();
  };

  const sortByVotes = (a: RetroItem, b: RetroItem) =>
    (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0) ||
    +new Date(b.created_at) - +new Date(a.created_at);
  const well = items.filter((i) => i.category === 'well').sort(sortByVotes);
  const improve = items.filter((i) => i.category === 'improve').sort(sortByVotes);

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="aurora-bg" aria-hidden />
      <div className="relative z-10">
        <header className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 backdrop-blur-2xl bg-background/70">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('retro.back')}</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                {t('retro.brand')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton />
              <button
                onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
                className="px-3 py-1.5 text-xs font-bold rounded-full border border-foreground/10 bg-card/40 text-foreground/70 hover:bg-card/60 transition-colors"
              >
                {lang === 'en' ? 'RU' : 'EN'}
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-28 pb-10 px-6">
          <div className="relative max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-foreground/10 pb-8">
              <div>
                <p className="text-accent font-black tracking-[0.2em] text-[11px] uppercase mb-3 inline-flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('retro.badge')}
                </p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
                  {t('retro.title.a')} <span className="text-foreground/40">/</span>{' '}
                  <span className="gradient-text">{t('retro.title.b')}</span>
                  <Rocket className="inline-block w-6 h-6 md:w-8 md:h-8 ml-2 align-middle text-accent" />
                </h1>
                <p className="mt-4 text-sm md:text-base text-foreground/60 max-w-2xl leading-relaxed">
                  {t('retro.subtitle')}
                </p>
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-8">
              {[
                { n: items.length, l: t('retro.stat.ideas'), amber: false },
                { n: well.length, l: t('retro.stat.wins'), amber: false },
                { n: improve.length, l: t('retro.stat.improvements'), amber: true },
              ].map((s, i) => (
                <div
                  key={i}
                  className="glass-card glass-card-hover p-4 md:p-5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display text-3xl md:text-5xl font-black leading-none tabular-nums ${s.amber ? 'text-amber-300' : 'text-foreground'}`}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full self-start mt-2 ${s.amber ? 'bg-amber-300' : 'bg-accent'}`}
                      style={{
                        boxShadow: s.amber
                          ? '0 0 10px hsl(45 93% 60%)'
                          : '0 0 10px hsl(141 71% 58%)',
                      }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] md:text-xs uppercase tracking-widest font-black text-foreground/50">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-primary-foreground uppercase tracking-wider transition hover:brightness-110"
                style={{ background: 'var(--gradient-violet)', boxShadow: 'var(--shadow-glow-violet)' }}
              >
                <Send className="w-4 h-4" />
                {t('retro.cta.share')}
              </a>
              <ShareButton variant="button" />
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="form" className="relative px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="glass-card p-6 md:p-8 space-y-5">
              <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {t('retro.form.title')}
              </h2>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground/60 mb-2">
                  {t('retro.form.category')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['well', 'improve'] as const).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        category === c
                          ? 'border-accent bg-accent/10 text-foreground'
                          : 'border-foreground/10 bg-card/40 text-foreground/60 hover:border-foreground/25'
                      }`}
                    >
                      {t(`retro.form.cat.${c}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground/60 mb-2">
                  {t('retro.form.author')}
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={60}
                  placeholder={t('retro.form.author.ph')}
                  className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground/60 mb-2">
                  {t('retro.form.content')}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder={t('retro.form.content.ph')}
                  className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent transition resize-none"
                />
                <div className="mt-1 text-right text-xs text-foreground/50 font-mono tabular-nums">
                  {content.length}/500
                </div>
              </div>

              {msg && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.kind === 'ok'
                      ? 'border border-accent/40 bg-accent/10 text-accent'
                      : 'border border-destructive/40 bg-destructive/10 text-destructive'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                style={{ background: 'var(--gradient-violet)', boxShadow: 'var(--shadow-glow-violet)' }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('retro.form.sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('retro.form.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Lists */}
        <section className="relative px-6 pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RetroColumn
              title={t('retro.well.title')}
              icon={<ThumbsUp className="w-4 h-4 text-accent" />}
              accent="accent"
              items={well}
              loading={loading}
              emptyText={t('retro.empty.well')}
              anon={t('retro.anon')}
              voteCounts={voteCounts}
              myVotes={myVotes}
              pendingVote={pendingVote}
              onVote={onVote}
              voteLabel={t('retro.vote')}
              votedLabel={t('retro.voted')}
              votesLabel={t('retro.votes')}
            />
            <RetroColumn
              title={t('retro.improve.title')}
              icon={<Lightbulb className="w-4 h-4 text-amber-300" />}
              accent="amber"
              items={improve}
              loading={loading}
              emptyText={t('retro.empty.improve')}
              anon={t('retro.anon')}
              voteCounts={voteCounts}
              myVotes={myVotes}
              pendingVote={pendingVote}
              onVote={onVote}
              voteLabel={t('retro.vote')}
              votedLabel={t('retro.voted')}
              votesLabel={t('retro.votes')}
              showStatus
              statusLabel={t('retro.status.label')}
              statusLabels={{
                open: t('retro.status.open'),
                planned: t('retro.status.planned'),
                in_progress: t('retro.status.in_progress'),
                done: t('retro.status.done'),
              }}
              onStatusChange={onStatusChange}
            />
          </div>
        </section>

        <footer className="border-t border-foreground/5 px-6 py-8">
          <div className="max-w-6xl mx-auto text-center text-sm text-foreground/60">
            {t('retro.footer')}
          </div>
        </footer>
      </div>
    </main>
  );
}

function RetroColumn({
  title,
  icon,
  accent,
  items,
  loading,
  emptyText,
  anon,
  voteCounts,
  myVotes,
  pendingVote,
  onVote,
  voteLabel,
  votedLabel,
  votesLabel,
  showStatus,
  statusLabel,
  statusLabels,
  onStatusChange,
}: {
  title: string;
  icon: React.ReactNode;
  accent: 'accent' | 'amber';
  items: RetroItem[];
  loading: boolean;
  emptyText: string;
  anon: string;
  voteCounts: Record<string, number>;
  myVotes: Set<string>;
  pendingVote: string | null;
  onVote: (id: string) => void;
  voteLabel: string;
  votedLabel: string;
  votesLabel: string;
  showStatus?: boolean;
  statusLabel?: string;
  statusLabels?: Record<RetroStatus, string>;
  onStatusChange?: (id: string, status: RetroStatus) => void;
}) {
  const iconBg =
    accent === 'accent'
      ? 'bg-accent/10 border-accent/30'
      : 'bg-amber-400/10 border-amber-400/30';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className={`flex items-center justify-center size-9 rounded-lg border ${iconBg}`}>
          {icon}
        </div>
        <h2 className="font-display text-xl md:text-2xl font-black tracking-tight text-foreground">
          {title}
        </h2>
        <span className="ml-auto text-[11px] font-mono uppercase tracking-widest text-foreground/50 tabular-nums">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="glass-card p-6 text-center text-sm text-foreground/60">
            <Loader2 className="w-5 h-5 animate-spin inline" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-card/30 p-8 text-center text-sm text-foreground/60">
            {emptyText}
          </div>
        ) : (
          items.map((it) => {
            const count = voteCounts[it.id] || 0;
            const voted = myVotes.has(it.id);
            const busy = pendingVote === it.id;
            const status = (it.status || 'open') as RetroStatus;
            return (
              <div
                key={it.id}
                className="glass-card glass-card-hover p-5 flex gap-4"
              >
                <button
                  type="button"
                  onClick={() => onVote(it.id)}
                  disabled={voted || busy}
                  aria-label={voted ? votedLabel : voteLabel}
                  title={voted ? votedLabel : voteLabel}
                  className={`shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-2 min-w-[56px] transition ${
                    voted
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-foreground/10 bg-background/40 text-foreground/60 hover:border-accent/60 hover:text-foreground'
                  } disabled:cursor-not-allowed`}
                >
                  <ArrowBigUp className={`w-5 h-5 ${voted ? 'fill-current' : ''}`} />
                  <span className="text-sm font-mono font-black tabular-nums">{count}</span>
                </button>
                <div className="flex-1 min-w-0">
                  {showStatus && statusLabels && (
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider ${STATUS_STYLES[status]}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            status === 'done'
                              ? 'bg-accent'
                              : status === 'in_progress'
                                ? 'bg-amber-300'
                                : status === 'planned'
                                  ? 'bg-sky-300'
                                  : 'bg-foreground/50'
                          }`}
                        />
                        {statusLabels[status]}
                      </span>
                      {onStatusChange && (
                        <label className="relative inline-flex items-center">
                          <span className="sr-only">{statusLabel}</span>
                          <select
                            value={status}
                            onChange={(e) =>
                              onStatusChange(it.id, e.target.value as RetroStatus)
                            }
                            aria-label={statusLabel}
                            className="rounded-full border border-foreground/10 bg-background/60 text-[11px] font-mono uppercase tracking-wider text-foreground/70 hover:text-foreground hover:border-foreground/30 px-2.5 py-1 pr-6 appearance-none cursor-pointer transition focus:outline-none focus:border-accent"
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {statusLabels[s]}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-2 text-foreground/50 text-[10px]">
                            ▾
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                  <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {it.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-foreground/50 font-mono">
                    <span>— {it.author || anon}</span>
                    <span>·</span>
                    <span>{new Date(it.created_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>
                      {count} {votesLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const Retro = () => (
  <LanguageProvider>
    <RetroInner />
  </LanguageProvider>
);

export default Retro;
