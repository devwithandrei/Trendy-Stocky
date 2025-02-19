import React from 'react';

interface MultipleButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MultipleButton: React.FC<MultipleButtonProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center border rounded-md">
      <button 
        onClick={onDecrease} 
        className="px-2 py-1 text-gray-500 hover:bg-gray-200 transition"
      >
        -
      </button>
      <span className="mx-2">{quantity}</span>
      <button 
        onClick={onIncrease} 
        className="px-2 py-1 text-gray-500 hover:bg-gray-200 transition"
      >
        +
      </button>
    </div>
  );
};

export default MultipleButton;