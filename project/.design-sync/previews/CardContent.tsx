import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "papkram";

export const Paragraph = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
      <CardDescription>Beitragsservice ARD ZDF · 12 March 2026</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        You are being asked to pay the broadcasting fee for January to March.
        The amount is €55.08, and the payment was due on 1 March.
      </p>
    </CardContent>
  </Card>
);

export const KeyFacts = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Key facts</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="flex flex-col gap-2">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium">€55.08</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Due</dt>
          <dd className="font-medium">1 March 2026</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="font-mono text-sm">448 291 663</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
);

export const ContentOnly = () => (
  <Card className="max-w-sm">
    <CardContent>
      <p className="text-muted-foreground">
        No letters yet. Upload a photo or PDF and Papkram will read it for you.
      </p>
    </CardContent>
  </Card>
);
