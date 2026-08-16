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

// A title long enough to reach the popup's right edge runs under the floating
// close button, so this cell turns the close button off. See NOTES.md.
export const Longer = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent showCloseButton={false}>
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
