import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t" style={{ backgroundColor: '#202020' }}>
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg font-bold text-green-600" style={{ color: '#228b22' }}>
          <a href="/" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Trendy Stocky
          </a>
        </p>
      </div>
      <div className="mx-auto py-4 flex flex-wrap justify-center">
        <p className="text-center text-sm md:text-lg text-green-600 mr-8" style={{ color: '#228b22' }}>
          <a href="/about" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            About Us
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-green-600 mr-8" style={{ color: '#228b22' }}>
          <a href="/privacy-policy" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Privacy & Policy
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-green-600 mr-8" style={{ color: '#228b22' }}>
          <a href="/return-policies" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Return Policies
          </a>
        </p>
      </div>
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg text-green-600" style={{ color: '#228b22' }}>
          &copy; {new Date().getFullYear()} Pure Herbal Meds, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;