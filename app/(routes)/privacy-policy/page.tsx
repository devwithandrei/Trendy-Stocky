import React from 'react';
import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import { Metadata } from 'next'

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("dbdc3ee6-7813-4b23-b1fc-68c0ebe1bd41");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
          textColor="#0073B2" // Adding the textColor prop with the desired color
        />
        {/* Update Privacy Policy Content */}
        <div className="caligrafic-text" style={{ color: '#004d00', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
          Welcome to the Privacy Policy of Pure Herbal Meds. This page outlines how we collect, use, and protect your personal information when you use our website.
          </p>
          {/* Separator */}
          <hr style={{ margin: '20px 0' }} />
          </div>
 {/* Update About Us Content */}
 <div className="caligrafic-text" style={{ color: '#004d00', fontFamily: 'cursive', textAlign: 'center', display: 'grid', gap: '20px' }}>
          {/* Text in Box 1 */}
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <p style={{ fontSize: '1.1em' }}>
              Unrivaled Quality
            </p>
            <hr style={{ margin: '10px 0' }} />
            <p>
              We meticulously source our cannabis strains from esteemed cultivators known for their dedication to excellence. Every product in our collection undergoes stringent testing to ensure uncompromised quality, potency, and purity. Our commitment to offering only the finest cannabis sets us apart, providing an unparalleled experience for enthusiasts and connoisseurs alike.
            </p>
            <hr style={{ margin: '10px 0' }} />
            <p style={{ fontSize: '1.1em', marginTop: '20px' }}>
              Professional Excellence
            </p>
            <hr style={{ margin: '10px 0' }} />
            <p>
              At Pure Herbal Meds, professionalism is ingrained in our operations. Our user-friendly online platform is designed to provide a seamless and secure shopping experience. From discreet packaging to prompt delivery, professionalism is at the core of everything we do, ensuring a hassle-free and confidential transaction for our customers.
            </p>
            {/* Add more content if needed */}
          </div>
          
          {/* Text in Box 2 */}
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <p style={{ fontSize: '1.1em' }}>
                Frequently Asked Questions (FAQ)
            </p>
             <hr style={{ margin: '10px 0' }} /> {/* Adding a horizontal line as a separator */}
            <p>
              Q: Is cannabis legal in Amsterdam?<br />
              A: Yes, cannabis is legal for recreational use in Amsterdam for adults aged 18 and above.
            </p>
                {/* Add more FAQ content */}
          </div>
            <p>
              Thank you for choosing Pure Herbal Meds as your premier source for top-tier cannabis products.
            </p>
        </div>
        {/* Updated About Us Content */}
        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};


export default PrivacyPolicy;
