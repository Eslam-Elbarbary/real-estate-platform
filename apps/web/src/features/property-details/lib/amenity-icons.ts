import type { LucideIcon } from 'lucide-react';
import {
  AlarmSmoke,
  ArrowUpDown,
  Car,
  Droplets,
  Dumbbell,
  Fence,
  Flame,
  ParkingCircle,
  Phone,
  Shield,
  Snowflake,
  Trees,
  Waves,
} from 'lucide-react';

const amenityIconMap: Record<string, LucideIcon> = {
  أمن: Shield,
  'هاتف أرضي': Phone,
  مصعد: ArrowUpDown,
  'جراج مغطى': Car,
  شرفة: Fence,
  'عداد مياه': Droplets,
  'غاز طبيعي': Flame,
  'تكييف مركزي': Snowflake,
  'موقف سيارات': ParkingCircle,
  'نظام إنذار': AlarmSmoke,
  'حمام سباحة': Waves,
  جيم: Dumbbell,
  'حديقة خاصة': Trees,
  'بلكونة واسعة': Fence,
};

export function getAmenityIcon(label: string): LucideIcon {
  return amenityIconMap[label] ?? Shield;
}
