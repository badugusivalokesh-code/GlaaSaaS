import { Button } from './Button';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-secondary bg-tips-danger px-4 py-8 text-center"
    >
      <p className="text-body-md font-medium text-system-danger">Something went wrong</p>
      <p className="max-w-xs text-body-sm text-fg-secondary">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
