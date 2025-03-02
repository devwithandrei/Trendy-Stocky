import ProductList from '@/components/product-list'
import Info from '@/components/info';
import getProduct from '@/actions/get-product';
import getProducts from '@/actions/get-products';
import Container from '@/components/ui/container';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Outly.Shop',
}

// Force dynamic rendering and revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
  searchParams: {
    storeId?: string;
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params, searchParams }) => {
  // Use storeId from searchParams or fall back to env variable
  const storeId = searchParams.storeId || process.env.STORE_ID;

  // Log environment variables for debugging
  console.log("ProductPage - Environment STORE_ID:", process.env.STORE_ID);
  console.log("ProductPage - Using storeId:", storeId);
  console.log("ProductPage - Product ID:", params.productId);

  try {
    if (!storeId) {
      console.error('Store ID is not available');
      return notFound();
    }

    const product = await getProduct(params.productId, storeId);

    if (!product) {
      console.log("Product not found or invalid:", params.productId);
      return notFound();
    }

    // Validate required fields
    if (!product.name || !product.price) {
      console.error("Missing required product fields:", {
        name: !!product.name,
        price: !!product.price
      });
      return notFound();
    }
    
    console.log("ProductPage - Found product:", product.name);
    
    // Fetch related products based on category or brand
    const relatedProductsQuery = product.category 
      ? { categoryId: product.category.id, storeId }
      : product.brand 
        ? { brandId: product.brand.id, storeId }
        : { storeId };
        
    const relatedProducts = await getProducts(relatedProductsQuery);

    console.log(`ProductPage - Found ${relatedProducts.length} related products`);

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            {/* Full-width product layout */}
            <Info data={product} />
            <hr className="my-10" />
            <ProductList 
              title={product.category 
                ? `More from ${product.category.name}` 
                : product.brand 
                  ? `More from ${product.brand.name}` 
                  : "Related Items"} 
              items={relatedProducts.filter(item => item.id !== product.id).slice(0, 4)} 
            />
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return notFound();
  }
};

export default ProductPage;
