import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const ContactUs = async () => {
  const billboard = await getBillboard("85e08ca3-a8b0-4155-aa8f-4f8b516c6ed4");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={billboard}
        />

        <div className="contact-form center-content" style={{ textAlign: 'center' }}>
          <form style={{ display: 'inline-block', textAlign: 'left' }}>
            <div className="form-group" style={{ display: 'flex', gap: '20px' }}> {/* Increased gap to 20px */}
              <div className="inline-group" style={{ flex: 1 }}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Type your name" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px', width: '100%' }} />
              </div>
              <div className="inline-group" style={{ flex: 1 }}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Type your email" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px', width: '100%' }} />
              </div>
            </div>
            <div className="form-group">
              <textarea id="message" name="message" placeholder="Type your message" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '20px', height: '300px', width: 'calc(100% - 12px)' }}></textarea>
            </div>
            <div className="center">
              <button type="submit" style={{ background: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', display: 'block', margin: '0 auto' }}>Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default ContactUs;