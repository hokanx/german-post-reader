import { Card, CardDescription, CardHeader, CardTitle } from "papkram";

export const Default = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>AOK Bayern</CardTitle>
      <CardDescription>Health insurer · 28 February 2026</CardDescription>
    </CardHeader>
  </Card>
);

export const Longer = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
      <CardDescription>
        A quarterly broadcasting fee every household in Germany pays, whether or
        not you own a television.
      </CardDescription>
    </CardHeader>
  </Card>
);

export const WithLink = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Unlimited letters</CardTitle>
      <CardDescription>
        €5.99 a year. <a href="#">See what is included</a>
      </CardDescription>
    </CardHeader>
  </Card>
);
