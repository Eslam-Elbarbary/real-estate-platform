import { Bath, BedDouble, Eye, Heart, Maximize2, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, formatPrice } from '../format';
import type { AdminPropertyDetails } from '../types';

interface PropertySummaryCardsProps {
  property: AdminPropertyDetails;
}

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  icon: typeof Wallet;
};

export function PropertySummaryCards({ property }: PropertySummaryCardsProps) {
  const items: SummaryItem[] = [];

  if (property.price != null) {
    items.push({
      id: 'price',
      label: 'السعر',
      value: formatPrice(property.price, property.currency),
      icon: Wallet,
    });
  }

  if (property.areaSqm != null) {
    items.push({
      id: 'area',
      label: 'المساحة',
      value: formatNumber(property.areaSqm, ' م²'),
      icon: Maximize2,
    });
  }

  if (property.bedrooms != null) {
    items.push({
      id: 'bedrooms',
      label: 'غرف النوم',
      value: formatNumber(property.bedrooms),
      icon: BedDouble,
    });
  }

  if (property.bathrooms != null) {
    items.push({
      id: 'bathrooms',
      label: 'الحمامات',
      value: formatNumber(property.bathrooms),
      icon: Bath,
    });
  }

  if (property.viewCount != null) {
    items.push({
      id: 'views',
      label: 'المشاهدات',
      value: formatNumber(property.viewCount),
      icon: Eye,
    });
  }

  if (property.favoritesCount != null) {
    items.push({
      id: 'favorites',
      label: 'المفضلة',
      value: formatNumber(property.favoritesCount),
      icon: Heart,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.id} className="shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-50 text-ink-500">
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-500">{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-ink-900">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
