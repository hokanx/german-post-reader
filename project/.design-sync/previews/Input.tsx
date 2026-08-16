import { Input, Label } from "papkram";

export const WithLabel = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="email">Email address</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
);

export const Filled = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="ref">Reference number</Label>
    <Input id="ref" defaultValue="448 291 663" />
  </div>
);

export const Invalid = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="bad-email">Email address</Label>
    <Input id="bad-email" defaultValue="saeed@" aria-invalid />
    <p className="text-sm text-destructive">
      That address looks incomplete.
    </p>
  </div>
);

export const Disabled = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <Label htmlFor="plan">Current plan</Label>
    <Input id="plan" defaultValue="Free — 4 letters" disabled />
  </div>
);

export const Types = () => (
  <div className="flex max-w-xs flex-col gap-3">
    <Input type="text" placeholder="Sender, e.g. Finanzamt" />
    <Input type="password" defaultValue="correcthorse" />
    <Input type="date" defaultValue="2026-03-01" />
  </div>
);
