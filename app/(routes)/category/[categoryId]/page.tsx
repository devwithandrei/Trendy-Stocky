import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import { ProductCard } from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';

import getProducts from '@/actions/get-products';
import getCategory from '@/actions/get-category';
import { Product } from '@/types';

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    sizeId: string;
    storeId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {
  const categoryId = params.categoryId;
  // Use storeId from searchParams or fall back to env variable
  const storeId = searchParams.storeId || process.env.STORE_ID;

  // Log environment variables for debugging
  console.log("CategoryPage - Environment STORE_ID:", process.env.STORE_ID);
  console.log("CategoryPage - Using storeId:", storeId);
  console.log("CategoryPage - Category ID:", categoryId);

  try {
    if (!storeId) {
      console.error('Store ID is not available');
      return (
        <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Store Not Found</h2>
            <p>Please make sure you have selected a valid store.</p>
          </div>
        </div>
      );
    }

    // Fetch the category directly by ID or name
    const category = await getCategory(categoryId, storeId);

    if (!category) {
      console.error(`Category not found. CategoryId: ${categoryId}, StoreId: ${storeId}`);
      return (
        <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Category Not Found</h2>
            <p>The requested category could not be found.</p>
          </div>
        </div>
      );
    }

    console.log("CategoryPage - Found category:", category.name);

    // Fetch Products using the category ID
    const { colorId, sizeId } = searchParams;
    const products: Product[] = await getProducts({ 
      categoryId: category.id,
      storeId,
      colorId,
      sizeId
    });

    console.log(`CategoryPage - Found ${products.length} products in category ${category.name}`);

    // Use billboard from category
    const billboard = category.billboard;
    
    return (
      <div className="bg-white">
        <Container>
          <div className="space-y-8 pb-10">
            {billboard && (
              <Billboard data={billboard} />
            )}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                <div className="mt-6 lg:col-span-5">
                  {products.length === 0 ? (
                    <NoResults />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.map((item) => (
                        <ProductCard key={item.id} data={item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );

  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>Something went wrong. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default CategoryPage;
