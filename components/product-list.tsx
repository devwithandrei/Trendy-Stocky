"use client"

import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import { ProductCard } from "@/components/ui/product-card";

interface ProductListProps {
  title?: string;
  items: Product[];
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items,
  loading
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-500">
      {title && (
        <h3 className="font-bold text-2xl sm:text-3xl animate-in slide-in-from-left-4 duration-300">{title}</h3>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-[350px] rounded-xl"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="animate-in fade-in zoom-in-50 duration-300" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
