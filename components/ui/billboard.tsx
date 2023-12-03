"use client"

import React, { useEffect, useState } from 'react';
import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  const [displayText, setDisplayText] = useState('');
  const textToType = data.label;
  const maxLength = textToType.length;

  useEffect(() => {
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const animateText = () => {
      setDisplayText(textToType.substring(0, currentIndex));
      currentIndex = (currentIndex + 1) % (maxLength + 1);
      timeout = setTimeout(animateText, 200); // Adjust the speed here (milliseconds)
    };

    animateText();

    return () => clearTimeout(timeout);
  }, [textToType, maxLength]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div style={{ backgroundImage: `url(${data?.imageUrl})` }} className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover">
        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
          <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
            <div className="Typewriter" data-testid="typewriter-wrapper">
              <span className="Typewriter__wrapper">
                {displayText}
              </span>
              <span className="Typewriter__cursor">|</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
