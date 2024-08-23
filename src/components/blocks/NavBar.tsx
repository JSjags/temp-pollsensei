import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/auth/logo.svg"; // Adjust the path as needed
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image src={logo} alt="Logo" className="h-8 w-auto" />
          <h2 className="text-lg text-[#5B03B2] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-semibold">
            PollSensei
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Pricing", "About Us", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-600 hover:text-[#5B03B2] relative group"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#5B03B2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="bg-[#5B03B2] text-white px-4 py-2 hover:bg-[#4A0291] transition-colors duration-300 rounded-full"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={toggleSidebar}
            ></motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href={"/"} className="flex items-center gap-2">
                    <Image src={logo} alt="Logo" className="h-8 w-auto" />
                    <h2 className="text-lg text-[#5B03B2] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-semibold">
                      PollSensei
                    </h2>
                  </Link>
                  <button className="rounded-full" onClick={toggleSidebar}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col space-y-4">
                  {["Features", "Pricing", "About Us", "Contact"].map(
                    (item) => (
                      <Link
                        key={item}
                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="text-gray-600 hover:text-[#5B03B2] py-2 relative group w-fit"
                        onClick={toggleSidebar}
                      >
                        {item}
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#5B03B2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      </Link>
                    )
                  )}
                  <Link
                    href="/login"
                    className="bg-[#5B03B2] text-white px-4 py-2 rounded-full hover:bg-[#4A0291] transition-colors duration-300 text-center"
                    onClick={toggleSidebar}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
