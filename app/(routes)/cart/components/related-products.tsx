"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Product } from "@/types";
import getProducts from "@/actions/get-products";
import { ProductCard } from "@/components/ui/product-card";

interface RelatedProductsProps {
  cartItems: Array<{
    id: string;
    categoryId?: string;
    brandId?: string;
  }>;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ cartItems }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'category' | 'brand'>('category');

  // Extract unique category and brand IDs from cart items
  const categoryIds = Array.from(new Set(cartItems.map(item => item.categoryId).filter(Boolean)));
  const brandIds = Array.from(new Set(cartItems.map(item => item.brandId).filter(Boolean)));

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      
      try {
        // Fetch products based on active tab (category or brand)
        const query = activeTab === 'category' 
          ? { categoryId: categoryIds[0] } 
          : { brandId: brandIds[0] };
          
        // Only fetch if we have valid IDs
        if ((activeTab === 'category' && categoryIds.length > 0) || 
            (activeTab === 'brand' && brandIds.length > 0)) {
          const products = await getProducts(query);
          
          // Filter out products that are already in the cart
          const cartProductIds = cartItems.map(item => item.id);
          const filteredProducts = products.filter(product => 
            !cartProductIds.includes(product.id)
          );
          
          setRelatedProducts(filteredProducts.slice(0, 8)); // Limit to 8 products
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [cartItems, activeTab, categoryIds, brandIds]);

  // Handle carousel navigation
  const nextSlide = () => {
    if (currentIndex < relatedProducts.length - 2) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(relatedProducts.length - 2); // Loop to end
    }
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (relatedProducts.length <= 2) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, relatedProducts.length]);

  if (relatedProducts.length === 0 && !loading) {
    return null; // Don't show anything if no related products
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6 animate-in fade-in duration-500">
      {/* Section Title with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">You might also like</h3>
        
        <div className="flex space-x-2">
          {categoryIds.length > 0 && (
            <button
              onClick={() => setActiveTab('category')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'category' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Similar Items
            </button>
          )}
          
          {brandIds.length > 0 && (
            <button
              onClick={() => setActiveTab('brand')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'brand' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Same Brand
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-[180px] rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Carousel Navigation Buttons */}
          {relatedProducts.length > 2 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Products Carousel */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex space-x-4"
              animate={{ x: -currentIndex * (180 + 16) }} // Card width + gap
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {relatedProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  className="flex-shrink-0 w-[180px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ProductCard data={product} compact />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;