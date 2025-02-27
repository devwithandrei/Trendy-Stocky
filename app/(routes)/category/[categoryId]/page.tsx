import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import { ProductCard } from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import CrispChatScript from '@/components/ui/CrispChatScript';

import getProducts from '@/actions/get-products';
import getBillboard from '@/actions/get-billboard';
import { Category, Product, Billboard as BillboardType } from '@/types';
import getCategories from '@/actions/get-categories';

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
  let storeId = searchParams.storeId;
  const queryParams = [];
  if (searchParams.colorId) queryParams.push(`colorId=${searchParams.colorId}`);
  if (searchParams.sizeId) queryParams.push(`sizeId=${searchParams.sizeId}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ``;

  try {
    if (!storeId) {
      // Extract store ID from API URL if not provided in query params
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const match = apiUrl.match(/\/api\/([^/]+)/);
      if (match) {
        storeId = match[1];
      } else {
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
    }

    // Fetch all categories for the store
    const categories = await getCategories(storeId);
    console.log("Categories fetched for store:", {
      storeId,
      count: categories.length,
      names: categories.map(c => c.name)
    });

    // Find the requested category by ID or name (case-insensitive)
    const category = categories.find(c => 
      c.id === categoryId || 
      c.name.toLowerCase() === categoryId.toLowerCase()
    );

    console.log("Category lookup result:", {
      searchTerm: categoryId,
      found: !!category,
      categoryName: category?.name
    });

    if (!category) {
      console.error(`Category not found. CategoryId: ${categoryId}, StoreId: ${storeId}`);
      return <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Category Not Found</h2>
          <p>The requested category could not be found.</p>
        </div>
      </div>;
    }

    console.log("Found category:", category?.name);

    // Fetch Products using the actual category ID
    const { colorId, sizeId } = searchParams;
    const products: Product[] = await getProducts({ 
      categoryId: category.id,
      storeId,
      colorId,
      sizeId
    });

    // Use billboard from category since it's already included in our query
    const billboard = category.billboard || null;
    
    console.log("Category data:", {
      name: category.name,
      billboardId: category.billboardId,
      billboard: billboard
    });
    console.log("Products:", products);

    return (
      <div className="bg-white">
        <Container>
          <div className="space-y-8 pb-10">
            {billboard && (
              <Billboard data={billboard} />
            )}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                {/* Add filters here if needed */}
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
    return <div className="flex items-center justify-center min-h-[400px] text-neutral-500">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>Something went wrong. Please try again later.</p>
      </div>
    </div>;
  }
};

export default CategoryPage;
