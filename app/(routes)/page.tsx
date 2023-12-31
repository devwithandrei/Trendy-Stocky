import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories"; // Import getCategories function
import ProductList from "@/components/product-list";
import CategoriesList from "@/components/categories-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import CategoryCard from '@/components/ui/CategoryCard';
import Image from 'next/image'

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const categories = await getCategories({ isFeatured: true }); // Fetch categories

  const billboard = await getBillboard("bdc3ae6e-993e-4280-b0ae-5ba868c0e6ed");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
          textColor="#0073B2"
        />
        <div >
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