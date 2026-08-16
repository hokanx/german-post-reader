import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "papkram";

export const Default = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

// Deliberately long enough to reach the popup's right edge — it should wrap
// clear of the close button, not run under it.
export const Longer = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          You have used all four letters in your free trial
        </DialogTitle>
        <DialogDescription>
          Unlock unlimited letters for €5.99 a year.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
