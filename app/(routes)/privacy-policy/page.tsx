import React from 'react';
import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("853279ee-70be-449e-8257-6687b82463a7");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
          textColor="#0073B2" // Adding the textColor prop with the desired color
        />
        {/* Updated Privacy Policy Content */}
        <div className="caligrafic-text" style={{ color: '#0066ff', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to the Privacy Policy of <strong>Trendy Stocky</strong>. This page outlines how we collect, use, and protect your personal information when you use our website.
          </p>
          {/* Other privacy policy content here... */}
        </div>
        {/* End of Updated Privacy Policy Content */}
        
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default PrivacyPolicy;
