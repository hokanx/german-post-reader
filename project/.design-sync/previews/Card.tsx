import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "papkram";

export const LetterSummary = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
      <CardDescription>Beitragsservice ARD ZDF · 12 March 2026</CardDescription>
      <CardAction>
        <Button variant="ghost" size="sm">
          Open
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        You are being asked to pay the broadcasting fee for January to March.
        The amount is €55.08, and the payment was due on 1 March.
      </p>
    </CardContent>
    <CardFooter>
      <Button size="sm">Draft a reply</Button>
    </CardFooter>
  </Card>
);

export const WithoutFooter = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>What this letter asks of you</CardTitle>
      <CardDescription>Three things, in order of urgency</CardDescription>
    </CardHeader>
    <CardContent>
      <ol className="flex flex-col gap-2 text-muted-foreground">
        <li>Pay €55.08 to the account named in the letter.</li>
        <li>Quote your Beitragsnummer 448 291 663 as the reference.</li>
        <li>Keep the confirmation — you may be asked for it later.</li>
      </ol>
    </CardContent>
  </Card>
);

export const CompactSize = () => (
  <Card size="sm" className="max-w-xs">
    <CardHeader>
      <CardTitle>Deadline</CardTitle>
      <CardDescription>1 March 2026</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Already passed. Reply as soon as you can.
      </p>
    </CardContent>
  </Card>
);

export const InAGrid = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Finanzamt München</CardTitle>
        <CardDescription>Tax office · 4 March 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A request for your 2025 income declaration.
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>AOK Bayern</CardTitle>
        <CardDescription>Health insurer · 28 February 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Confirmation that your coverage has started.
        </p>
      </CardContent>
    </Card>
  </div>
);
