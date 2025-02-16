import React from 'react';
import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import { Metadata } from 'next'

export const revalidate = 0;

const PrivacyPolicy = async () => {
  return (
    <Container>
      <div className="space-y-10 pb-10">
        {/* Update Privacy Policy Content */}
        
        {/* Updated About Us Content */}
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};


export default PrivacyPolicy;
