import type { ReactNode } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export function MobileDrawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useBodyScrollLock(isOpen);

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`glass-surface absolute inset-y-0 left-0 w-72 max-w-[85vw] rounded-none transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--background-primary)' }}
      >
        {children}
      </div>
    </div>
  );
}
