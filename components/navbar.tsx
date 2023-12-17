import Link from "next/link";
import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";

const Navbar = async () => {
  const categories = await getCategories();

  return ( 
    <div className="border-b sticky top-0 z-50 bg-white">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="ml-4 flex gap-x-2">
            <p className="font-bold text-sm md:text-xl"> {/* Set different font size for mobile and larger screens */}
              <span style={{ color: '#C12800' }}>T</span>{" "}
              <span style={{ color: '#0056AB' }}>S</span>
            </p>
          </Link>
          <div className="flex-grow"></div> {/* Empty div to push NavbarActions to the right */}
          <div className="mr-4"> {/* Give some right margin to NavbarActions */}
            <NavbarActions />
          </div>
          <MainNav data={categories} />
        </div>
      </Container>
    </div>
  );
};
 
export default Navbar;
