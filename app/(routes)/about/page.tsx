import React from 'react';
import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import MapComponent from "@/components/GoogleMap";
import { Metadata } from 'next'
 
export const revalidate = 0;

const AboutPage = async () => {

  return (
    <Container>
      <div className="space-y-10 pb-10">
        {/* Update About Us Content */}

        {/* Include the MapComponent */}
        <MapComponent />

        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default AboutPage;
