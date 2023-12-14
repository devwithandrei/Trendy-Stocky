import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("050761dc-4dd8-41bd-8235-9f5a60197533");

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