import NextLink from 'next/link'; // Import NextLink from next/link
import MainNav from '@/components/main-nav';
import Container from '@/components/ui/container';
import NavbarActions from '@/components/navbar-actions';
import categories from '@/actions/get-categories';
import Image from 'next/image';

const Navbar = async () => {
  const categoriesData = await categories();

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 80;
  const isSmallDevice = screenWidth <= 640;
  const svgWidth = isSmallDevice ? 40 : 80;
  const svgHeight = svgWidth;

  return (
    <div className="border-b sticky top-0 z-50 bg-white">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <NextLink href="/" passHref>
            {/* Use NextLink and passHref */}
            <div className="ml-4 flex gap-x-2">
              <Image
                src="https://th.bing.com/th/id/OIP.fUTQUCPKpQi4RI6G-KyfNgHaHa?rs=1&pid=ImgDetMain"
                alt="Logo"
                width={svgWidth}
                height={svgHeight}
              />
            </div>
          </NextLink>
          <MainNav data={categoriesData} />
          <div className="ml-auto sm:ml-0 sm:mr-4">
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
