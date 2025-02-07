import emailjs from 'emailjs-com';

interface ProductDetails {
  name: string;
  price: string;
  selectedColor?: string;
  selectedSize?: string;
}

interface EmailContent {
  productDetails: ProductDetails[];
  totalPrice: string;
}

const sendEmail = async (emailContent: EmailContent) => {
  const { productDetails, totalPrice } = emailContent;

  try {
    let productsHTML = '<table><tr><th>Product Name</th><th>Product Price</th><th>Color</th><th>Size</th></tr>';

    productDetails.forEach(product => {
      productsHTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.selectedColor || ''}</td>
          <td>${product.selectedSize || ''}</td>
        </tr>`;
    });

    productsHTML += '</table>';

    const emailParams = {
      productsList: productsHTML,
      totalPrice: totalPrice,
    };

    const response = await emailjs.send(
      'service_jfn2j4k', // Replace with your EmailJS service ID
      'template_1fp3ibi', // Replace with your EmailJS template ID
      emailParams,
      'rEvkeF3_Ygg4pmLi4' // Replace with your EmailJS user ID
    );

    console.log('Email sent!', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;