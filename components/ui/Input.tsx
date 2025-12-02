import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            "w-full h-10 px-3 rounded-lg",
            "bg-bg-secondary text-text-primary",
            "border border-border",
            "focus:outline-none focus:ring-2 focus:ring-accent",
            "placeholder:text-text-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-error focus:ring-error",
            className
          )}
          {...props}
          ref={ref}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
