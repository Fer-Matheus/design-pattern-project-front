"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "success" | "error";
    onClose?: () => void;
  }
>(({ className, variant = "default", onClose, children, ...props }, ref) => {
  const variants = {
    default: "border bg-background text-foreground",
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-4 right-4 z-50 flex w-full max-w-md items-center justify-between space-x-4 rounded-lg border p-4 pr-6 shadow-lg transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-black/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

Toast.displayName = "Toast";

export { Toast };
