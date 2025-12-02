import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        className={
          (cn(
            "inline-flex items-center justify-center rounded-lg font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            {
              "bg-accent text-white hover:bg-accent-hover":
                variant === "primary",
              "bg-bg-secondary text-text-primary hover:bg-bg-tertiary":
                variant === "secondary",
              "border border-border bg-transparent hover:bg-bg-secondary":
                variant === "outline",
              "hover:bg-bg-secondary": variant === "ghost",
              "h-8 px-3 text-sm": size === "sm",
              "h-10 px-4": size === "md",
              "h-12 px-6 text-lg": size === "lg",
            }
          ),
          className)
        }
        disabled={disabled || isLoading}>
        {isLoading ? <span className="mr-2">⏳</span> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
