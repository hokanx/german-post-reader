import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "papkram";

export const SingleAction = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Rundfunkbeitrag</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        €55.08 was due on 1 March 2026.
      </p>
    </CardContent>
    <CardFooter>
      <Button size="sm">Draft a reply</Button>
    </CardFooter>
  </Card>
);

export const TwoActions = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Reply ready</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Written in German, with a translation underneath.
      </p>
    </CardContent>
    <CardFooter className="gap-2">
      <Button size="sm">Copy reply</Button>
      <Button size="sm" variant="outline">
        Edit
      </Button>
    </CardFooter>
  </Card>
);

export const SpacedApart = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Free trial</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">You have read 3 of 4 letters.</p>
    </CardContent>
    <CardFooter className="justify-between">
      <span className="text-muted-foreground">1 letter left</span>
      <Button size="sm">Unlock unlimited</Button>
    </CardFooter>
  </Card>
);
