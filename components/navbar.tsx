import React from 'react';
import MainNav from '@/components/main-nav';
import Container from '@/components/ui/container';
import NavbarActions from '@/components/navbar-actions';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link

const Navbar = () => {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 80;
  const isSmallDevice = screenWidth <= 640;
  const svgWidth = isSmallDevice ? 80 : 160; // Adjusted width for small and large devices
  const svgHeight = svgWidth;

  return (
    <div className="border-b sticky top-0 z-50 bg-[#DCD7D5] bg-opacity-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Use Link component to wrap the Image */}
          <Link href="/">
            <div className="ml-4 flex gap-x-2 cursor-pointer relative">
              {/* Image Logo */}
              <Image
                src="https://funsubstance.com/uploads/gif/215/215926.gif"
                alt="Logo"
                width={svgWidth}
                height={svgHeight}
              />
              {/* Trendy Stock Text */}
              <span className="absolute top-1/2 left-full transform -translate-y-1/2">
                <span className="text-[#3A5795] font-extrabold text-lg sm:text-xl">Trendy</span>{' '}
                <span className="text-[#3A5795] font-extrabold text-lg sm:text-xl">Stocky</span>{' '}
              </span>
            </div>
          </Link>
          {/* Render MainNav and NavbarActions */}
          <MainNav />
          <div className="ml-auto sm:ml-0 sm:mr-4">
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
