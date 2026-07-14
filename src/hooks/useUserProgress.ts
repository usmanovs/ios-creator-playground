import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "./useAuthUser";

export function useUserProgress() {
  const user = useAuthUser();

  const { data: completedIds = new Set<string>(), isLoading } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set<string>((data ?? []).map((r) => r.lesson_id));
    },
    enabled: !!user,
  });

  return { user, completedIds, isLoading };
}
