import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("bc02fec3-88b2-4379-bd0a-0643d42ccea0");

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