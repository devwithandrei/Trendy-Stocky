import { Metadata } from "next";
import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search results for products",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q;
  let products: Product[] = [];

  try {
    products = await getProducts({  
      search: query,
      limit: 20  // Limit to 20 search results
    });
  } catch (error) {
    console.error("Error searching products:", error);
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
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
      </Container>
    </div>
  );
};

export default SearchPage;
