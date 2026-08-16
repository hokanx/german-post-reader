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

// DialogContent already renders a DialogOverlay for you. These cells show the
// backdrop on its own, and then in the composition you normally get.
export const BackdropAlone = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    {/* Portalled the way DialogContent does it — an unportalled backdrop
        stays inside the trigger's box and collapses to a thin strip. */}
    <DialogPortal>
      <DialogOverlay />
    </DialogPortal>
  </Dialog>
);

export const BehindADialog = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>
          The blurred scrim behind this popup is the overlay.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
