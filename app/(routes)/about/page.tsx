import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import CrispChatScript from "@/components/ui/CrispChatScript";
import getBillboard from "@/actions/get-billboard";

export const revalidate = 0;

const AboutPage = async () => {
  const billboard = await getBillboard("09ab1c87-a596-4462-a29b-3babad69cd5b");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />
        {/* Updated About Us Content */}
        <div className="caligrafic-text" style={{ color: '#0066ff', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to the About Us of <strong>Trendy Stocky</strong>. This page provides information about our company and the services we offer.
          </p>
          {/* Other content here... */}
        </div>
        {/* Updated About Us Content */}
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default AboutPage;
