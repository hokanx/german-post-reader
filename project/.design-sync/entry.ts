// Design-system entry point for the claude.ai/design sync.
//
// Papkram is a Next.js app, not a published component library, so there is no
// dist/ to bundle. This barrel is the library surface instead: the UI
// primitives, which are the only components that render standalone (no
// routing, no Supabase, no server actions).
//
// Anything added here ships to the design agent, so keep it to components
// that are genuinely portable.
export * from "../src/components/ui/button";
export * from "../src/components/ui/card";
export * from "../src/components/ui/dialog";
export * from "../src/components/ui/input";
export * from "../src/components/ui/label";
export * from "../src/components/ui/skeleton";
export * from "../src/components/ui/sonner";
