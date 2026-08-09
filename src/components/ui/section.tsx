import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Container } from './container';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  contained?: boolean;
  children?: ReactNode;
}

export function Section({
  className,
  title,
  description,
  contained = true,
  children,
  ...props
}: SectionProps) {
  const content = (
    <>
      {title || description ? (
        <div className="mb-6 flex flex-col gap-2">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950">
              {title}
            </h2>
          ) : null}
          {description ? <p className="max-w-2xl text-ink-600">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </>
  );

  return (
    <section className={cn('py-10 sm:py-14', className)} {...props}>
      {contained ? <Container>{content}</Container> : content}
    </section>
  );
}
