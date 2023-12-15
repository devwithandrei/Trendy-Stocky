import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const PrivacyPolicy = async () => {
  const billboard = await getBillboard("853279ee-70be-449e-8257-6687b82463a7");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />
        {/* Privacy Policy Content */}
        <div className="caligrafic-text" style={{ color: '#0066ff', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to the Privacy Policy of <strong>Trendy Stocky</strong>. This page outlines how we collect, use, and protect your personal information when you use our website.
          </p>
          <p style={{ fontSize: '1.2em' }}>
            We collect various types of information for different purposes to provide and improve our services to you.
          </p>
          <p style={{ fontSize: '1.2em' }}>
            The data we collect may include your name, email address, contact information, and browsing behavior. We use this information to personalize your experience, improve our products and services, and communicate with you about promotions and updates.
          </p>
          <p style={{ fontSize: '1.2em' }}>
            We prioritize the security of your data and take all necessary measures to protect it. We do not share your personal information with third parties without your consent, except as outlined in this Privacy Policy or required by law.
          </p>
          <p style={{ fontSize: '1.2em' }}>
            By using our website, you agree to the collection and use of information as described in this Privacy Policy. Please review this page regularly for any updates or changes.
          </p>
          <p style={{ fontSize: '1.2em' }}>
            If you have any questions or concerns about our Privacy Policy or data practices, please <a href="/contact-us" style={{ color: '#0066ff', textDecoration: 'underline' }}>contact us</a>. We are committed to ensuring your privacy and addressing any queries you may have.
          </p>
        </div>
        {/* End of Privacy Policy Content */}
      </div>
    </Container>
  );
};

export default PrivacyPolicy;
