import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import CrispChatScript from '@/components/ui/CrispChatScript';

import getProducts from '@/actions/get-products';
import getBillboard from '@/actions/get-billboard';
import { Category, Product, Billboard as BillboardType } from '@/types';
import axios from 'axios';

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
  const storeId = searchParams.storeId;
  const queryParams = [];
  if (searchParams.colorId) queryParams.push(`colorId=${searchParams.colorId}`);
  if (searchParams.sizeId) queryParams.push(`sizeId=${searchParams.sizeId}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ``;

  try {
    // Fetch all categories
    const allCategoriesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    if (allCategoriesRes.status !== 200) {
      console.error(`Error fetching all categories: ${allCategoriesRes.status} ${allCategoriesRes.statusText}`);
      throw new Error(`Error fetching all categories: ${allCategoriesRes.statusText}`);
    }
    const allCategories: Category[] = allCategoriesRes.data;

    // Find the requested category
    const category = allCategories.find((c) => c.id === categoryId);

    if (!category) {
      return <div>Category not found</div>; // Or redirect to a different page
    }

    // Log the API response
    console.log("Category:", category);

    // Fetch Products
    const products: Product[] = await getProducts({ categoryId, storeId });

    // Fetch Billboard
    let billboard: BillboardType | null = null;
    if (category?.billboardId && category) {
      billboard = await getBillboard(category.billboardId);
    }

    console.log("Products:", products);
    console.log("Billboard:", billboard);

    return (
      <div className="bg-white">
        <Container>
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            {billboard && <Billboard data={billboard} />}
            <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {products.length === 0 ? <NoResults /> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((item: Product) => (
                      <ProductCard key={item.id} data={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
        <CrispChatScript />
      </div>
    );
  } catch (error) {
    console.error('Error fetching category:', error);
    return <div>Error fetching category</div>;
  }
};

export default CategoryPage;
