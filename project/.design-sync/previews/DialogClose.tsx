import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "papkram";

// DialogClose is headless — pass `render` to give it a shape.
export const AsOutlineButton = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive">Delete letter</Button>
        <DialogClose render={<Button variant="outline" />}>
          Keep it
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const AsGhostButton = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unlock unlimited letters</DialogTitle>
        <DialogDescription>€5.99 a year.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button>Continue to payment</Button>
        <DialogClose render={<Button variant="ghost" />}>
          Not now
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
