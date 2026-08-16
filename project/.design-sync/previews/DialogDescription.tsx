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
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unlock unlimited letters</DialogTitle>
        <DialogDescription>
          €5.99 a year. Cancel any time from your settings.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export const WithLink = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Before you send this</DialogTitle>
        <DialogDescription>
          The reply is written in German so it can be sent as-is. Read the
          translation first — <a href="#">how translations work</a>.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
