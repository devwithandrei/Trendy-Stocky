import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import getBillboard from "@/actions/get-billboard";
import CrispChatScript from "@/components/ui/CrispChatScript";

export const revalidate = 0;

const returnpolicies = async () => {
  const billboard = await getBillboard("050761dc-4dd8-41bd-8235-9f5a60197533");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
          textColor="#2B07FF" // Adding the textColor prop with the desired color
        />
        {/* Updated Return Policies Content */}
        <div className="caligrafic-text" style={{ color: '#0066ff', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to the Return Policies of <strong>Trendy Stocky</strong>. This section outlines our return policies for purchases made through our website.
          </p>
          {/* Other return policies content here... */}
        </div>
        {/* End of Updated Return Policies Content */}
        
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default returnpolicies;
