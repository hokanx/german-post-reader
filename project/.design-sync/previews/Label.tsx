import { Input, Label } from "papkram";

export const WithInput = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="sender">Who sent the letter?</Label>
    <Input id="sender" placeholder="Finanzamt München" />
  </div>
);

export const WithHelpText = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="beitrag">Beitragsnummer</Label>
    <Input id="beitrag" placeholder="448 291 663" />
    <p className="text-sm text-muted-foreground">
      Printed in the top-right corner of the letter.
    </p>
  </div>
);

export const WithCheckbox = () => (
  <Label htmlFor="remind">
    <input
      id="remind"
      type="checkbox"
      defaultChecked
      className="size-4 accent-primary"
    />
    Remind me before the deadline
  </Label>
);

export const Disabled = () => (
  <div className="group flex max-w-xs flex-col gap-2" data-disabled="true">
    <Label htmlFor="locked">Account language</Label>
    <Input id="locked" defaultValue="English" disabled />
  </div>
);
