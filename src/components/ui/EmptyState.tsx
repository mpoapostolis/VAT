import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title,
  description,
  children,
  className,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-muted p-3 mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}