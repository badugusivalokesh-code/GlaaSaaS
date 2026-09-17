import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {icon && <div className="mb-1 text-fg-tertiary">{icon}</div>}
      <p className="text-body-md font-medium text-fg-primary">{title}</p>
      {description && <p className="max-w-xs text-body-sm text-fg-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
