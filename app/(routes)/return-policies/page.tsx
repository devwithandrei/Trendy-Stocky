import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import getBillboard from "@/actions/get-billboard";
import CrispChatScript from "@/components/ui/CrispChatScript";
import { Metadata } from 'next'

export const revalidate = 0;

const returnpolicies = async () => {
  return (
    <Container>
      <div className="space-y-10 pb-10">
        {/* Updated Return Policies Content */}
        {/* Updated About Us Content */}
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default returnpolicies;
