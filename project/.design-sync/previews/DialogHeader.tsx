import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "papkram";

export const TitleAndDescription = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>
      Change language
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Change your language</DialogTitle>
        <DialogDescription>
          Summaries and reply translations will switch to the language you pick.
          Your existing letters are re-translated automatically.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export const TitleOnly = () => (
  <Dialog open>
    <DialogTrigger render={<Button variant="outline" />}>Sign out</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign out of Papkram?</DialogTitle>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
