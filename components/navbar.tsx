import Link from "next/link";
import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";

interface CustomSVGProps {
  width: number;
  height: number;
}

const CustomSVG: React.FC<CustomSVGProps> = ({ width, height }) => (
  <svg
    width={width} // Dynamic width
    height={height} // Dynamic height
    viewBox="0 0 80 80" // Define the viewBox to fit the content
    fill="none" // No fill color
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle parameters for the background */}
    <circle cx="40" cy="40" r="30" fill="#0056AB" />
    {/* Text for T.S */}
    <text
      x="50%" // Center the text horizontally
      y="50%" // Center the text vertically
      textAnchor="middle" // Set text anchor to the middle
      dominantBaseline="middle" // Set dominant baseline to middle
      fontSize="16px" // Font size of the text
      fontFamily="Arial, sans-serif" // Font family of the text
      fontWeight="bold" // Font weight of the text
      fill="#FFD700" // Text color (yellow)
    >
      T.S {/* Text content */}
    </text>
  </svg>
);

const Navbar = async () => {
  const categories = await getCategories();

  // Calculate dynamic SVG size based on screen width for small devices
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 80; // Fallback width
  const isSmallDevice = screenWidth <= 640; // Define small device breakpoint
  const svgWidth: number = isSmallDevice ? 40 : 80; // Adjust width for small devices
  const svgHeight: number = svgWidth;

  return (
    <div className="border-b sticky top-0 z-50 bg-white">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="ml-4 flex gap-x-2">
            {/* Show the SVG with dynamic width and height */}
            <CustomSVG width={svgWidth} height={svgHeight} />
          </Link>
          <MainNav data={categories} />
          <div className="ml-auto sm:ml-0 sm:mr-4"> {/* Keep the original margin on larger screens */}
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
