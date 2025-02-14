import React from 'react';
import { Button } from '@/components/ui/button';

interface SizeSelectorProps {
  showSizes: boolean;
  isShoeCategory: boolean;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  setShowSizes: React.Dispatch<React.SetStateAction<boolean>>;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  showSizes,
  isShoeCategory,
  selectedSize,
  onSizeSelect,
  setShowSizes,
}) => {
  const shoeSizes = [39, 40, 41, 42, 43, 44, 45, 46];
  const otherSizes = ['X-Small', 'Small', 'Medium', 'Large', 'XL', 'XXL'];

  return (
    <div>
      <Button
        onClick={() => setShowSizes(!showSizes)}
        className={`cursor-pointer ${showSizes ? 'bg-blue-300' : 'bg-blue-200'} bg-opacity-50 text-blue-900`}
      >
        {selectedSize ? selectedSize : 'Select Size'}
      </Button>
      {showSizes && (
        <div className="absolute mt-2 py-1 w-24 bg-white border border-gray-300 shadow-lg z-10">
          {isShoeCategory ? (
            shoeSizes.map((sizeOption) => (
              <div
                key={sizeOption}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => onSizeSelect(String(sizeOption))}
              >
                {sizeOption}
              </div>
            ))
          ) : (
            otherSizes.map((sizeOption) => (
              <div
                key={sizeOption}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => onSizeSelect(sizeOption)}
              >
                {sizeOption}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SizeSelector;