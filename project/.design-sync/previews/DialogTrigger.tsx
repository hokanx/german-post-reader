import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "papkram";

// DialogTrigger is headless — it renders whatever you pass to `render`. Both
// cells show the trigger with the dialog it controls already open.
export const AsButton = () => (
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

export const AsPrimaryButton = () => (
  <Dialog open>
    <DialogTrigger render={<Button />}>Unlock unlimited</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unlock unlimited letters</DialogTitle>
        <DialogDescription>€5.99 a year.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
