import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
};

export default function EmptyState({ icon, title, description, ctaLabel, onCta }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
      {icon && <div className="mx-auto w-10 h-10 text-foreground/40 flex items-center justify-center">{icon}</div>}
      <div className="font-display font-bold">{title}</div>
      {description && <p className="text-sm text-foreground/60">{description}</p>}
      {ctaLabel && onCta && (
        <Button onClick={onCta} variant="outline" size="sm">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
