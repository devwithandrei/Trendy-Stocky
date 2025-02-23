import React from 'react';

interface MultipleButtonProps {
  quantity: number;
  maxQuantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MultipleButton: React.FC<MultipleButtonProps> = ({ 
  quantity, 
  maxQuantity = Infinity,
  onIncrease, 
  onDecrease 
}) => {
  return (
    <div className="flex items-center border rounded-md">
      <button 
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={`px-2 py-1 text-gray-500 transition ${
          quantity <= 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-200'
        }`}
      >
        -
      </button>
      <span className="mx-2 min-w-[20px] text-center">{quantity}</span>
      <button 
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className={`px-2 py-1 text-gray-500 transition ${
          quantity >= maxQuantity 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-200'
        }`}
      >
        +
      </button>
    </div>
  );
};

export default MultipleButton;
