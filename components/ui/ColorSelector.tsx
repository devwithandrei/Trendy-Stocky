import React from 'react';
import { Button } from '@/components/ui/button';

interface ColorSelectorProps {
  showColors: boolean;
  onColorSelect: (color: string) => void;
  setShowColors: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColor: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  showColors,
  onColorSelect,
  setShowColors,
  selectedColor,
}) => {
  return (
    <div>
      <Button
        onClick={() => setShowColors(!showColors)}
        className={`cursor-pointer ${showColors ? 'bg-blue-300' : 'bg-blue-200'} bg-opacity-50 text-blue-900`}
      >
        {selectedColor ? (
          <div className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: selectedColor }} />
        ) : (
          'Select Color'
        )}
      </Button>
      {showColors && (
        <div className="absolute mt-2 py-1 w-24 bg-white border border-gray-300 shadow-lg z-10">
          {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].map((colorOption) => (
            <div
              key={colorOption}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => onColorSelect(colorOption.toLowerCase())}
              style={{ backgroundColor: colorOption.toLowerCase() }}
            >
              {colorOption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
