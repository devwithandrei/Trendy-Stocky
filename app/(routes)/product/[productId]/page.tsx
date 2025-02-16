import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import getProducts from '@/actions/get-products';
import Container from '@/components/ui/container';
import CrispChatScript from '@/components/ui/CrispChatScript';
import type { Metadata } from 'next'

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
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  try {
    // Fetch all products
    const products = await getProducts();
    
    // Find the specific product
    const product = products.find(p => p.id === params.productId);

    if (!product) {
      return (
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: Product not found</strong>
              <p className="mt-2 text-sm">
                The product you&apos;re looking for could not be found. It may have been removed or is temporarily unavailable.
              </p>
            </div>
          </div>
        </Container>
      );
    }

    // Get related products from the same category
    const suggestedProducts = products
      .filter(p => p.category?.id === product.category?.id && p.id !== product.id)
      .slice(0, 4);

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <Gallery images={product.images} />
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info data={product} />
              </div>
            </div>
            <hr className="my-10" />
            <ProductList title="Related Items" items={suggestedProducts} />
          </div>
        </Container>
        <CrispChatScript />
      </div>
    );
  } catch (error) {
    console.error('[ProductPage]', error);
    return (
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error loading product</strong>
            <p className="mt-2 text-sm">
              There was an error loading this product. Please try again later.
            </p>
          </div>
        </div>
      </Container>
    );
  }
};

export default ProductPage;