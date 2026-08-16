// Merged onto window.Papkram via cfg.extraEntries so preview compositions can
// actually fire a toast at the bundled <Toaster />. Only `toast` is re-exported
// — a bare `export * from "sonner"` would shadow the design system's own styled
// Toaster with sonner's unstyled one.
export { toast } from "sonner";
