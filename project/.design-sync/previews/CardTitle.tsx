import { Card, CardDescription, CardHeader, CardTitle } from "papkram";

export const Default = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
    </CardHeader>
  </Card>
);

export const WithDescription = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>What this letter asks of you</CardTitle>
      <CardDescription>Three things, in order of urgency</CardDescription>
    </CardHeader>
  </Card>
);

export const Wrapping = () => (
  <Card className="max-w-xs">
    <CardHeader>
      <CardTitle>
        Beitragsservice von ARD, ZDF und Deutschlandradio
      </CardTitle>
    </CardHeader>
  </Card>
);

export const InCompactCard = () => (
  <Card size="sm" className="max-w-xs">
    <CardHeader>
      <CardTitle>Deadline</CardTitle>
      <CardDescription>1 March 2026</CardDescription>
    </CardHeader>
  </Card>
);
