import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { COURSE_ID } from "@/pages/Course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const shareUrl = `https://ios.getforce.org${window.location.pathname}`;

  const redirectAfterAuth = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) navigate("/admin");
    else navigate(`/course/${COURSE_ID}`);
  }, [navigate]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) redirectAfterAuth(data.user.id);
    });
  }, [redirectAfterAuth]);

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) await redirectAfterAuth(userData.user.id);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) await redirectAfterAuth(data.user.id);
      }
    } catch (err: any) {
      toast.error(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-6 py-12">
      {/* Animated aurora background */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="backdrop-blur-3xl bg-foreground/[0.03] border border-foreground/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Motivational header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 p-0.5 mb-6 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-background rounded-[0.9rem] flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
              Become{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                21st-Century Ready
              </span>
            </h1>
            <p className="text-foreground/50 text-sm leading-relaxed">
              Join the next generation of AI & iOS developers. Your journey to innovation starts here.
            </p>
          </div>

          {/* Google sign in */}
          <Button
            type="button"
            variant="outline"
            className="w-full py-3.5 rounded-2xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300"
            onClick={signInWithGoogle}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center my-8 gap-4">
            <div className="h-px bg-foreground/10 flex-1" />
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Or email</span>
            <div className="h-px bg-foreground/10 flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground/50 uppercase tracking-widest ml-1">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-5 py-4 h-auto bg-foreground/5 border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground/50 uppercase tracking-widest ml-1">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-5 py-4 h-auto bg-foreground/5 border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 h-auto rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all mt-2 border-0"
            >
              {loading ? "…" : mode === "signin" ? "Enter the Classroom" : "Start Learning"}
            </Button>
          </form>

          {/* Mode toggle + share */}
          <div className="mt-10 text-center">
            <button
              type="button"
              className="text-sm text-foreground/50 hover:text-foreground transition-colors"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? (
                <>Don't have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign up for free</span></>
              ) : (
                <>Already have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign in</span></>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-foreground/5">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard?.writeText(shareUrl);
                    toast.success("Link copied: " + shareUrl);
                  } catch {
                    const ta = document.createElement("textarea");
                    ta.value = shareUrl;
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand("copy"); toast.success("Link copied: " + shareUrl); }
                    catch { toast.error("Copy failed — " + shareUrl); }
                    document.body.removeChild(ta);
                  }
                }}
                className="group inline-flex items-center gap-2.5 text-xs font-semibold text-foreground/40 hover:text-foreground transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-4 h-4 text-foreground/50 group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
                Share the future of learning
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-foreground/30 text-[10px] uppercase tracking-[0.2em]">
          Empowering the next billion developers
        </p>
      </div>
    </div>
  );
}
