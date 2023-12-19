import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg font-bold text-deminBlue">
          <a href="/" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Pure Herbal Meds
          </a>
        </p>
      </div>
      <div className="mx-auto py-4 flex flex-wrap justify-center">
        <p className="text-center text-sm md:text-lg text-black mr-8">
          <a href="/about" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            About Us
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-black mr-8">
          <a href="/privacy-policy" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Privacy & Policy
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-black mr-8">
          <a href="/return-policies" className="hover:underline hover:no-underline hover:text-blue-500 transition-colors duration-300">
            Return Policies
          </a>
        </p>
      </div>
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg text-black">
          &copy; {new Date().getFullYear()} Pure Herbal Meds, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
