import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("85e08ca3-a8b0-4155-aa8f-4f8b516c6ed4");

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