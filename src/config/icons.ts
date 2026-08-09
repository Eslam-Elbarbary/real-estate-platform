import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  CircleDollarSign,
  FileSearch,
  Headphones,
  Languages,
  Lightbulb,
  MapPin,
  MessagesSquare,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  UserRound,
  UserRoundCheck,
  X,
  type LucideIcon,
} from 'lucide-react';

export const appIcons = {
  sale: BadgeDollarSign,
  rent: CircleDollarSign,
  compounds: Building2,
  know: MapPin,
  addProperty: Plus,
  account: UserRound,
  support: Headphones,
  language: Languages,
  location: MapPin,
  filter: SlidersHorizontal,
  close: X,
  reset: RotateCcw,
  search: Search,
  chevronDown: ChevronDown,
  section: ShoppingBag,
  valuation: BadgeDollarSign,
  propertyPrices: CircleDollarSign,
  askNeighborhood: MessagesSquare,
  knowMore: MapPin,
  compoundReview: Building2,
  agents: UserRoundCheck,
  exhibitions: CalendarDays,
  propertyIndex: ChartNoAxesColumnIncreasing,
  advice: Lightbulb,
  research: FileSearch,
} as const;

export type AppIconName = keyof typeof appIcons;

export function getAppIcon(name: AppIconName): LucideIcon {
  return appIcons[name];
}

export const ICON_SIZE_NAV = 18;
export const ICON_SIZE_UI = 16;
