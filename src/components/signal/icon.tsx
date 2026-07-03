import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronRight,
  CircleDot,
  Code,
  Cpu,
  Download,
  ExternalLink,
  Folder,
  Github,
  Globe,
  GraduationCap,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Notebook,
  Phone,
  Plus,
  Shield,
  Sparkles,
  Star,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  "arrow-up-right": ArrowUpRight,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  "chevron-right": ChevronRight,
  "external-link": ExternalLink,
  globe: Globe,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  github: Github,
  linkedin: Linkedin,
  sparkles: Sparkles,
  cpu: Cpu,
  shield: Shield,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  star: Star,
  code: Code,
  download: Download,
  folder: Folder,
  sun: Sun,
  moon: Moon,
  menu: Menu,
  x: X,
  check: Check,
  plus: Plus,
  "circle-dot": CircleDot,
  notebook: Notebook,
  languages: Languages,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const C = ICONS[name];
  return (
    <C
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
      className={cn("shrink-0", className)}
    />
  );
}
