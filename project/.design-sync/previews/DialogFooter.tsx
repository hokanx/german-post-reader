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

export const WithCloseButton = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Delete letter
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this letter?</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter showCloseButton>
        <Button variant="destructive">Delete letter</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const SingleAction = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unlock unlimited letters</DialogTitle>
        <DialogDescription>€5.99 a year.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button>Continue to payment</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
