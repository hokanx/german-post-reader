/**
 * Email-safe translation of design-system/MASTER.md's tokens. Inline styles
 * only (React Email / most inboxes strip <style> blocks and all Tailwind
 * classes), and every value degrades gracefully in clients that ignore
 * border-radius or box-shadow (Outlook desktop) rather than breaking.
 */

export const color = {
  background: "#fff7ed",
  foreground: "#1a0a2e",
  card: "#ffffff",
  primary: "#7c3aed",
  primaryForeground: "#ffffff",
  accent: "#fb923c",
  accentForeground: "#1a0a2e",
  muted: "#fef3c7",
  mutedForeground: "#6b21a8",
  border: "#1a0a2e",
};

export const font = {
  heading:
    "'Bricolage Grotesque', 'Arial Black', Helvetica, Arial, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

export const styles = {
  body: {
    backgroundColor: color.background,
    fontFamily: font.body,
    padding: "32px 16px",
  },
  container: {
    backgroundColor: color.card,
    margin: "0 auto",
    maxWidth: "480px",
    border: `2px solid ${color.border}`,
    borderRadius: "22px",
    boxShadow: `6px 6px 0 0 ${color.border}`,
    overflow: "hidden",
  },
  header: {
    padding: "28px 32px 20px",
  },
  logoRow: {
    display: "flex" as const,
    alignItems: "center" as const,
  },
  logoImg: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    verticalAlign: "middle" as const,
  },
  wordmark: {
    color: color.foreground,
    fontFamily: font.heading,
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    verticalAlign: "middle" as const,
    paddingInlineStart: "10px",
  },
  body_section: {
    padding: "4px 32px 32px",
  },
  pill: {
    display: "inline-block" as const,
    backgroundColor: color.muted,
    color: color.mutedForeground,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    padding: "6px 14px",
    borderRadius: "999px",
    margin: "0 0 16px",
  },
  heading: {
    color: color.foreground,
    fontFamily: font.heading,
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
    margin: "0 0 16px",
  },
  text: {
    color: color.foreground,
    fontFamily: font.body,
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 16px",
  },
  muted: {
    color: color.mutedForeground,
    fontFamily: font.body,
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 16px",
  },
  featureCard: {
    backgroundColor: color.background,
    border: `1.5px solid ${color.border}`,
    borderRadius: "14px",
    padding: "12px 16px",
    margin: "0 0 10px",
  },
  featureLabel: {
    color: color.primary,
    fontFamily: font.heading,
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.02em",
    margin: "0 0 2px",
  },
  featureText: {
    color: color.foreground,
    fontFamily: font.body,
    fontSize: "14px",
    lineHeight: "20px",
    margin: 0,
  },
  button: {
    backgroundColor: color.primary,
    color: color.primaryForeground,
    fontFamily: font.body,
    fontSize: "16px",
    fontWeight: 700,
    textDecoration: "none",
    borderRadius: "14px",
    border: `2px solid ${color.border}`,
    boxShadow: `3px 3px 0 0 ${color.border}`,
    padding: "14px 28px",
    display: "inline-block" as const,
  },
  footer: {
    padding: "20px 32px 28px",
    borderTop: `1.5px solid ${color.muted}`,
  },
  footerText: {
    color: color.mutedForeground,
    fontFamily: font.body,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
};

export const LOGO_URL = "https://papkram.de/icon-512.png";
