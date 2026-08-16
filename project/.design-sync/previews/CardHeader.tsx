import {
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "papkram";

export const TitleAndDescription = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
      <CardDescription>Beitragsservice ARD ZDF · 12 March 2026</CardDescription>
    </CardHeader>
  </Card>
);

export const TitleOnly = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Letters awaiting a reply</CardTitle>
    </CardHeader>
  </Card>
);

export const WithAction = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Finanzamt München</CardTitle>
      <CardDescription>Tax office · 4 March 2026</CardDescription>
      <CardAction>
        <Button variant="ghost" size="sm">
          Open
        </Button>
      </CardAction>
    </CardHeader>
  </Card>
);
