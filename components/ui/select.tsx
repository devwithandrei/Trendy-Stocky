import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, value, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event.target.value);
    };

    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value}
        onChange={handleChange}
        ref={ref}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";
