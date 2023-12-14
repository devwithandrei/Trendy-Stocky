import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("853279ee-70be-449e-8257-6687b82463a7");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />
      </div>
    </Container>
  )
};

export default PrivacyPolicy;