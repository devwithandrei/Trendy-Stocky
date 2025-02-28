import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  disabled,
  variant = "default",
  type = "button",
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={cn(
        `
        w-auto 
        rounded-full 
        border
        px-5 
        py-3 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        font-semibold
        transition
      `,
        variant === 'default' && `
          bg-black
          border-transparent
          text-white
          hover:opacity-75
        `,
        variant === 'outline' && `
          bg-transparent
          border-gray-200
          text-black
          hover:bg-gray-100
        `,
        variant === 'secondary' && `
          bg-gray-100
          border-transparent
          text-black
          hover:bg-gray-200
        `,
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
