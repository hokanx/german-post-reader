import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "papkram";

// The dialog is held open so the card shows the real overlay. The trigger is
// kept in the composition so the card also shows what opens it — and so the
// mount root is never empty when the popup portals out.
export const Confirmation = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>
          The letter and its analysis will be removed from your history. This
          cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter showCloseButton>
        <Button variant="destructive">Delete letter</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
