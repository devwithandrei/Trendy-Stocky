import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import CrispChatScript from '@/components/ui/CrispChatScript';

import getCategory from '@/actions/get-category';
import getProducts from '@/actions/get-products';
import getBillboard from '@/actions/get-billboard';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    sizeId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ 
  params, 
  searchParams
}) => {
  const products = await getProducts({ 
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
  });
  const category = await getCategory(params.categoryId);

  if (!category) {
    return null;
  }

  console.log("Category:", category);

  // Fetch the billboard data
  const billboard = await getBillboard(category.billboardId);

  console.log("Billboard:", billboard);

  return (
    <div className="bg-white">
      <Container>
        {billboard && (
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <Billboard data={billboard} />
            <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {products.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((item) => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
      <CrispChatScript />
    </div>
  );
};

export default CategoryPage;