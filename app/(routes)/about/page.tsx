import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import CrispChatScript from "@/components/ui/CrispChatScript";
import getBillboard from "@/actions/get-billboard";

export const revalidate = 0;

const AboutPage = async () => {
  const billboard = await getBillboard("216aaceb-4c9b-45c4-8265-fb5b0bef4240");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />
        {/* Updated About Us Content */}
        <div className="caligrafic-text" style={{ color: '#004d00', fontFamily: 'cursive', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em' }}>
            Welcome to Pure Herbal Meds: Elevating Your Cannabis Experience. Pure Herbal Meds is your trusted online destination for premium-grade cannabis products. Based in Amsterdam, our platform is dedicated to delivering the highest quality cannabis while upholding the utmost professionalism.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Unrivaled Quality
          </p>
          <p>
            We meticulously source our cannabis strains from esteemed cultivators known for their dedication to excellence. Every product in our collection undergoes stringent testing to ensure uncompromised quality, potency, and purity. Our commitment to offering only the finest cannabis sets us apart, providing an unparalleled experience for enthusiasts and connoisseurs alike.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Professional Excellence
          </p>
          <p>
            At Pure Herbal Meds, professionalism is ingrained in our operations. Our user-friendly online platform is designed to provide a seamless and secure shopping experience. From discreet packaging to prompt delivery, professionalism is at the core of everything we do, ensuring a hassle-free and confidential transaction for our customers.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Customer-Centric Service
          </p>
          <p>
            Our team is devoted to your satisfaction. We prioritize your needs and queries, offering responsive and attentive customer support. Each member of our professional team brings expertise and passion to provide guidance and assistance, ensuring your experience with Pure Herbal Meds is nothing short of exceptional.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Meet Our Professional Team
          </p>
          <p>
            Behind Pure Herbal Meds is a team of seasoned professionals deeply passionate about cannabis. Our experts bring a wealth of knowledge and experience in the industry, enabling us to curate a collection that reflects our commitment to excellence and innovation. From cultivation experts to dedicated customer service representatives, every team member contributes to our mission of providing top-tier cannabis products and outstanding service.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Benefits of Our Products
          </p>
          <p>
            Experience a wide range of benefits with our premium cannabis products. Whether seeking relaxation, pain relief, creativity, or stress reduction, our carefully curated selection caters to diverse preferences and needs. From high-quality flowers to expertly crafted edibles and concentrates, each product is designed to elevate your cannabis experience.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Frequently Asked Questions (FAQ)
          </p>
          <p>
            Q: Is cannabis legal in Amsterdam? <br />
            A: Yes, cannabis is legal for recreational use in Amsterdam for adults aged 18 and above.
          </p>
          <p>
            Q: How do you ensure the quality of your products? <br />
            A: We source our cannabis strains from trusted cultivators known for their dedication to quality. All products undergo rigorous testing to ensure they meet our standards for purity, potency, and consistency.
          </p>
          <p>
            Q: How is my order shipped? <br />
            A: We ensure discreet packaging and use reliable shipping methods to deliver your order promptly and securely to your doorstep.
          </p>
          <p>
            Q: Is there a minimum order requirement? <br />
            A: No, we do not have a minimum order requirement. You can purchase products according to your preferences and needs.
          </p>
          <p>
            Q: What payment methods do you accept? <br />
            A: We accept various payment methods, including credit/debit cards and other secure online payment options.
          </p>
          <p>
            Experience Premium Cannabis, Professionally Delivered <br />
            Discover the pinnacle of cannabis quality and professionalism with Pure Herbal Meds. Explore our collection and indulge in a superior cannabis experience that mirrors our unwavering dedication to excellence.
          </p>
          <p>
            Thank you for choosing Pure Herbal Meds as your premier source for top-tier cannabis products.
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
