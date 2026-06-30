import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

type Entry = {
  id: string;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_label: string | null;
  created_at: string;
};

const PAGE = 20;

export default function ActivityLogPanel() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const load = async (p: number) => {
    const from = p * PAGE;
    const to = from + PAGE;
    const { data } = await supabase
      .from("activity_log")
      .select("id,actor_email,action,entity_type,entity_label,created_at")
      .order("created_at", { ascending: false })
      .range(from, to);
    const rows = (data as Entry[]) || [];
    setHasMore(rows.length > PAGE);
    setEntries(rows.slice(0, PAGE));
  };

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Activity log</h2>
      </div>
      {entries.length === 0 ? (
        <p className="text-foreground/50 text-sm">No activity yet.</p>
      ) : (
        <div className="space-y-1.5">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-card/40">
              <span className="text-foreground/50 w-32 shrink-0 text-xs">
                {new Date(e.created_at).toLocaleString()}
              </span>
              <span className="text-foreground/80 truncate flex-1">
                <span className="text-primary">{e.actor_email || "system"}</span>{" "}
                <span className="text-foreground/60">{e.action}</span>{" "}
                <span className="text-foreground/60">{e.entity_type}</span>
                {e.entity_label && <span> · {e.entity_label}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </section>
  );
}
