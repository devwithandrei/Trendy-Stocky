'use client';

import { useState } from 'react';
import { Product, Size, Color } from '@/types';

interface ProductVariationsProps {
  product: Product;
  onVariationSelectAction: (sizeId: string, colorId: string, stock: number) => void;
}

export const ProductVariations: React.FC<ProductVariationsProps> = ({
  product,
  onVariationSelectAction,
}) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  // Get available stock for current selection
  const getAvailableStock = (sizeId: string | undefined, colorId: string | undefined) => {
    if ((!product.sizes || !product.sizes.length) && (!product.colors || !product.colors.length)) {
      // If product has no variations, return base stock
      return product.stock || 0;
    }

    if (product.sizes?.length && !product.colors?.length) {
      // If product only has sizes
      const size = product.sizes.find(s => s.id === sizeId);
      return size?.stock || 0;
    }

    if (!product.sizes?.length && product.colors?.length) {
      // If product only has colors
      const color = product.colors.find(c => c.id === colorId);
      return color?.stock || 0;
    }

    // If product has both sizes and colors
    const size = product.sizes.find(s => s.id === sizeId);
    const color = product.colors.find(c => c.id === colorId);
    if (!size || !color) return 0;
    return Math.min(size.stock, color.stock);
  };

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSizeId(sizeId);
    if (selectedColorId) {
      const stock = getAvailableStock(sizeId, selectedColorId);
      onVariationSelectAction(sizeId, selectedColorId, stock);
    }
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColorId(colorId);
    if (selectedSizeId) {
      const stock = getAvailableStock(selectedSizeId, colorId);
      onVariationSelectAction(selectedSizeId, colorId, stock);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Select Size:</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeSelect(size.id)}
                className={`
                  px-4 py-2 border rounded-md
                  ${selectedSizeId === size.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }
                  ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={size.stock === 0}
              >
                {size.name}
                {size.stock === 0 && ' (Out of Stock)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Select Color:</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color.id)}
                className={`
                  px-4 py-2 border rounded-md
                  ${selectedColorId === color.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }
                  ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={color.stock === 0}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                  {color.stock === 0 && ' (Out of Stock)'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Display */}
      {(!product.sizes?.length && !product.colors?.length) ? (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Available Stock: {product.stock || 0}
          </p>
        </div>
      ) : (
        (product.sizes?.length === 0 || selectedSizeId) && 
        (product.colors?.length === 0 || selectedColorId) && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Available Stock: {getAvailableStock(selectedSizeId, selectedColorId)}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ProductVariations;
