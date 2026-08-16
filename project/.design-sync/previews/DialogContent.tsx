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

export const Default = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Unlock unlimited
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unlock unlimited letters</DialogTitle>
        <DialogDescription>
          €5.99 a year. Cancel any time from your settings.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter showCloseButton>
        <Button>Continue to payment</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const WithoutCloseButton = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Reading your letter</DialogTitle>
        <DialogDescription>
          This usually takes about twenty seconds. You can leave this open.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export const WithBody = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      View reply
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Your reply, in German</DialogTitle>
        <DialogDescription>
          This is the text that will be sent. A translation follows underneath.
        </DialogDescription>
      </DialogHeader>
      <p className="text-muted-foreground">
        Sehr geehrte Damen und Herren, hiermit bestätige ich den Erhalt Ihres
        Schreibens vom 12. März 2026 und werde den Betrag von 55,08 € bis zum
        Monatsende überweisen.
      </p>
      <DialogFooter showCloseButton>
        <Button>Copy reply</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
