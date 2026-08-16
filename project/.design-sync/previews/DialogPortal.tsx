import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "papkram";

// DialogPortal teleports its children out to the document body so the overlay
// and popup escape any parent overflow or stacking context. DialogContent
// wraps itself in one already — reach for DialogPortal directly only when
// composing a dialog by hand.
export const PortalledOverlay = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
    </DialogPortal>
  </Dialog>
);

export const UsedByDialogContent = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>
          This popup is portalled to the body — no wrapper needed.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
