import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outly.Shop',
}

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: {
    categoryId?: string;
    brandId?: string;
    colorId?: string;
    sizeId?: string;
  }
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { categoryId, brandId, colorId, sizeId } = searchParams;

  const query = {
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(colorId && { colorId }),
    ...(sizeId && { sizeId }),
  };

  const products = await getProducts(query);

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;