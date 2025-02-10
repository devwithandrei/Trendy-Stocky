import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import ProductList from "@/components/product-list";
import CategoriesList from "@/components/categories-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import ProductSearchBar from "@/components/ProductSearchBar";
import Image from 'next/image';

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true }); // Fetch featured products
  const categories = await getCategories({ isFeatured: true });

  const billboard = await getBillboard("592f25d7-4316-48d6-a2de-7f99bdd466bd");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
          textColor="#0073B2"
        />
        <div>
          <ProductList title="Featured Products" items={products} />
        </div>
        <div>
          <CategoriesList />
        </div>
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default HomePage;