import {
  Landmark,
  ShieldCheck,
  Banknote,
  Building2,
  Zap,
  GraduationCap,
  Truck,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { SenderCategory } from "./types";

/** Shared between the dashboard letter card and the letter-detail sender section — one icon per category, never mixed with another icon set. */
export const SENDER_CATEGORY_ICONS: Record<SenderCategory, LucideIcon> = {
  authority: Landmark,
  insurer: ShieldCheck,
  bank: Banknote,
  landlord: Building2,
  utility: Zap,
  school: GraduationCap,
  delivery: Truck,
  other: FileText,
};
