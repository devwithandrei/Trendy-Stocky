"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

interface CurrencyProps {
  value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({
  value = 0
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use optional chaining to safely handle value conversion
  const formattedValue = formatter.format(Number(value)) || '';

  if (!isMounted) {
    return null;
  }

  return ( 
    <div className="font-semibold">
      {formattedValue}
    </div>
  );
}

export default Currency;
