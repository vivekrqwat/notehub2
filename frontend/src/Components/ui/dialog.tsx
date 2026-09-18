import * as React from "react";
import { cn } from "cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl",
        )}
        role="dialog"
      >
        {children}
      </div>
    </div>
  );
}