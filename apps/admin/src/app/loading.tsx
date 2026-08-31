import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardContent className="py-10 text-center">
          <p className="text-sm font-medium text-ink-700">جاري التحميل...</p>
        </CardContent>
      </Card>
    </div>
  );
}
