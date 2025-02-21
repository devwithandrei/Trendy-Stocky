import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import getProduct from '@/actions/get-product';
import Container from '@/components/ui/container';
import CrispChatScript from '@/components/ui/CrispChatScript';
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
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  try {
    // Fetch the specific product
    const product = await getProduct(params.productId);

    if (!product) {
      return notFound();
    }

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
            <ProductList title="Related Items" items={[]} />
          </div>
        </Container>
        <CrispChatScript />
      </div>
    )
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return notFound();
  }
};

export default ProductPage;