import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
  disabled = false
}) => {
  return ( 
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full flex items-center justify-center bg-white border shadow-md p-2 transition',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110',
        className
      )}
    >
      {icon}
    </button>
   );
}

export default IconButton;
