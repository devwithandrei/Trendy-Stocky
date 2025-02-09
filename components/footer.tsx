import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t" style={{ backgroundColor: '#202020' }}>
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg font-bold">
          <a
            href="/"
            className="text-[#3A5795] hover:text-green-600 hover:underline transition-colors duration-300"
          >
            Trendy Stocky
          </a>
        </p>
      </div>
      <div className="mx-auto py-4 flex flex-wrap justify-center">
        <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
          <a
            href="/about"
            className="text-[#3A5795] hover:text-green-600 hover:underline transition-colors duration-300"
          >
            About Us
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
          <a
            href="/privacy-policy"
            className="text-[#3A5795] hover:text-green-600 hover:underline transition-colors duration-300"
          >
            Privacy & Policy
          </a>
        </p>
        <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
          <a
            href="/return-policies"
            className="text-[#3A5795] hover:text-green-600 hover:underline transition-colors duration-300"
          >
            Return Policies
          </a>
        </p>
      </div>
      <div className="mx-auto py-3">
        <p className="text-center text-sm md:text-lg text-[#3A5795]">
          &copy; {new Date().getFullYear()} Trendy Stocky, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
