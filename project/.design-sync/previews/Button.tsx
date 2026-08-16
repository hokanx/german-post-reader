import { Button } from "papkram";
import { ArrowRight, Trash2, Upload } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Read this letter</Button>
    <Button variant="outline">Upload another</Button>
    <Button variant="secondary">Save draft</Button>
    <Button variant="ghost">Skip for now</Button>
    <Button variant="destructive">Delete letter</Button>
    <Button variant="link">What happens next?</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>
      <Upload /> Upload a letter
    </Button>
    <Button variant="outline">
      Continue <ArrowRight />
    </Button>
    <Button variant="secondary" size="sm">
      <Upload /> Add another
    </Button>
  </div>
);

export const IconOnly = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="icon-xs" aria-label="Upload a letter">
      <Upload />
    </Button>
    <Button size="icon-sm" variant="outline" aria-label="Upload a letter">
      <Upload />
    </Button>
    <Button size="icon" variant="ghost" aria-label="Upload a letter">
      <Upload />
    </Button>
    <Button size="icon-lg" variant="destructive" aria-label="Delete letter">
      <Trash2 />
    </Button>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button disabled>Read this letter</Button>
    <Button variant="outline" disabled>
      Upload another
    </Button>
    <Button variant="destructive" disabled>
      Delete letter
    </Button>
  </div>
);
