import {
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "papkram";
import { EllipsisVertical } from "lucide-react";

export const WithButton = () => (
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

export const WithIconButton = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>AOK Bayern</CardTitle>
      <CardDescription>Health insurer · 28 February 2026</CardDescription>
      <CardAction>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <EllipsisVertical />
        </Button>
      </CardAction>
    </CardHeader>
  </Card>
);

export const WithBadge = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
      <CardDescription>Beitragsservice ARD ZDF · 12 March 2026</CardDescription>
      <CardAction>
        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold uppercase text-destructive">
          Overdue
        </span>
      </CardAction>
    </CardHeader>
  </Card>
);
