import React from 'react';
import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import CrispChatScript from "@/components/ui/CrispChatScript";
import MapComponent from "@/components/GoogleMap";
import { Metadata } from 'next'

export const revalidate = 0;

const AboutPage = async () => {
  const billboard = await getBillboard("592f25d7-4316-48d6-a2de-7f99bdd466bd");
  const fastDeliveryBillboard = await getBillboard("592f25d7-4316-48d6-a2de-7f99bdd466bd");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />
        <div className="caligrafic-text" style={{ color: '#004d00', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to Pure Herbal Meds: Elevating Your Cannabis Experience. Pure Herbal Meds is your trusted online destination for premium-grade cannabis products. Based in Amsterdam, our platform is dedicated to delivering the highest quality cannabis while upholding the utmost professionalism.
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
            <hr style={{ margin: '10px 0' }} />
            <p>
              Q: Is cannabis legal in Amsterdam?<br />
              A: Yes, cannabis is legal for recreational use in Amsterdam for adults aged 18 and above.
            </p>
            <p>Q: How does your online cannabis store ensure fast delivery?
            <br />A: At Pure Herbal Meds , we prioritize prompt delivery by utilizing efficient logistics and shipping partners. Once an order is placed and processed, we expedite the packaging and dispatch process to ensure swift shipment to your doorstep. Our streamlined procedures and dedicated team work diligently to minimize delivery times.
            </p>
            {/* Continue adding other FAQ content */}
            {/* ... */}
          </div>
          
          <div className="billboard-container"> 
            <Billboard 
              data={fastDeliveryBillboard}
            />
          </div>
          
          <p>
            Thank you for choosing Pure Herbal Meds as your premier source for top-tier cannabis products.
          </p>
        </div>

        {/* Include the MapComponent */}
        <MapComponent />

        {/* Include the CrispChatScript component after existing content */}
        <CrispChatScript />
      </div>
    </Container>
  );
};

export default AboutPage;
