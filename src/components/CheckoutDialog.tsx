import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceId: string | null;
  title: string;
}

export function CheckoutDialog({ open, onOpenChange, priceId, title }: CheckoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <PaymentTestModeBanner />
        {open && priceId && <StripeEmbeddedCheckout priceId={priceId} />}
      </DialogContent>
    </Dialog>
  );
}
