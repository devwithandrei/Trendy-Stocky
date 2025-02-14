"use client";

import React, { useEffect, useState } from 'react';

export interface CurrencyProps {
  value?: string | number;
  className?: string;
}

const Currency: React.FC<CurrencyProps> = ({ 
  value = 0,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Ensure value is a number
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Format the currency using EUR and European formatting
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className={`font-semibold ${className}`}>
      {formatter.format(numericValue)}
    </div>
  );
};

export default Currency;
