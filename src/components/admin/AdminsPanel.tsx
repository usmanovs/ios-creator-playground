import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, ShieldCheck, MailPlus } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import EmptyState from "./EmptyState";

type Admin = { user_id: string; email: string; created_at: string };
type Invite = { id: string; email: string; accepted_at: string | null; created_at: string };

export default function AdminsPanel({ currentUserId }: { currentUserId: string }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [revoking, setRevoking] = useState<Admin | null>(null);

  const load = async () => {
    const { data: a, error: ae } = await supabase.rpc("list_admins");
    if (ae) toast.error(ae.message);
    setAdmins((a as Admin[]) || []);
    const { data: i } = await supabase
      .from("admin_invites")
      .select("*")
      .order("created_at", { ascending: false });
    setInvites((i as Invite[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const invite = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) return toast.error("Enter a valid email");
    const { error } = await supabase
      .from("admin_invites")
      .insert({ email: trimmed, invited_by: currentUserId });
    if (error) return toast.error(error.message);
    await supabase.rpc("log_activity", {
      _action: "role_grant",
      _entity_type: "role",
      _entity_id: null as any,
      _entity_label: trimmed,
      _metadata: { type: "invite" },
    });
    toast.success("Invite created");
    setEmail("");
    load();
  };

  const cancelInvite = async (id: string) => {
    const { error } = await supabase.from("admin_invites").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const revoke = async (a: Admin) => {
    const { error } = await supabase.rpc("revoke_admin", { target_user_id: a.user_id });
    if (error) return toast.error(error.message);
    toast.success(`Revoked ${a.email}`);
    setRevoking(null);
    load();
  };

  return (
    <section className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Admins</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
        <div className="flex-1 space-y-2">
          <Label>Invite by email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="person@example.com"
            onKeyDown={(e) => e.key === "Enter" && invite()}
          />
        </div>
        <Button onClick={invite}>
          <MailPlus className="w-4 h-4 mr-2" /> Invite
        </Button>
      </div>
      <p className="text-xs text-foreground/50">
        They become admin automatically the first time they sign up with this email.
      </p>

      <div className="space-y-2">
        <div className="text-sm uppercase tracking-wide text-foreground/50">Current admins</div>
        {admins.length === 0 ? (
          <EmptyState title="No admins" />
        ) : (
          admins.map((a) => (
            <div key={a.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border">
              <div className="flex-1">
                <div className="font-medium">{a.email}</div>
                <div className="text-xs text-foreground/50">
                  added {new Date(a.created_at).toLocaleDateString()}
                </div>
              </div>
              {a.user_id === currentUserId ? (
                <span className="text-xs text-foreground/50">you</span>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setRevoking(a)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {invites.filter((i) => !i.accepted_at).length > 0 && (
        <div className="space-y-2">
          <div className="text-sm uppercase tracking-wide text-foreground/50">Pending invites</div>
          {invites
            .filter((i) => !i.accepted_at)
            .map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border">
                <div className="flex-1">
                  <div className="font-medium">{i.email}</div>
                  <div className="text-xs text-foreground/50">
                    invited {new Date(i.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => cancelInvite(i.id)}>
                  Cancel
                </Button>
              </div>
            ))}
        </div>
      )}

      <ConfirmDialog
        open={!!revoking}
        onOpenChange={(o) => !o && setRevoking(null)}
        title={`Revoke admin from ${revoking?.email}?`}
        description="They will lose admin access immediately."
        confirmLabel="Revoke"
        destructive
        onConfirm={() => revoking && revoke(revoking)}
      />
    </section>
  );
}
