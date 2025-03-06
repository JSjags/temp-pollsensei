import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useIsLoggedIn } from "@/lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { pollsensei_new_logo } from "@/assets/images";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NavBar = ({
  scrollToSection,
}: {
  scrollToSection?: (id: string) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn } = useIsLoggedIn({ message: "", dispatch: dispatch });
  const state = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navItems = ["Benefits", "Features", "Pricing", "Resource Hub", "FAQs"];

  const handleLinkClick = (item: string) => {
    const isLandingPage = pathname === "/";
    if (item === "Features" || item === "FAQs" || item === "Benefits") {
      const sectionId = item.toLowerCase();
      if (isLandingPage) {
        scrollToSection?.(sectionId);
      } else {
        router.push(`/?section=${sectionId}`);
      }
    } else {
      router.push(`/${item.toLowerCase().replace(" ", "-")}`);
    }
    setIsSidebarOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? `bg-white/80 backdrop-blur-lg shadow-lg ${
              isSidebarOpen ? "h-screen" : "md:h-auto"
            }`
          : `bg-white ${isSidebarOpen && "h-screen"}`
      )}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={pollsensei_new_logo}
                  alt="Logo"
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.span
                  key={item}
                  onClick={() => handleLinkClick(item)}
                  className="relative cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gray-600 group-hover:text-[#5B03B2] transition-colors duration-300">
                    {item}
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#5B03B2]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(!isLoggedIn ||
              !state.user ||
              !state.access_token ||
              !state.token) && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-[#5B03B2] transition-colors duration-300"
                >
                  Login
                </Link>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Link
                href={
                  !isLoggedIn ||
                  !state.user ||
                  !state.access_token ||
                  !state.token
                    ? "/demo/create-survey"
                    : "/dashboard"
                }
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-6 py-2 rounded-full hover:bg-[#4A0291] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {!isLoggedIn ||
                !state.user ||
                !state.access_token ||
                !state.token
                  ? "Try for Free"
                  : "Dashboard"}
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2147483647] md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                <div className="flex flex-col space-y-6">
                  {navItems.map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        onClick={() => handleLinkClick(item)}
                        className="text-gray-600 hover:text-[#5B03B2] text-lg font-medium cursor-pointer"
                      >
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={
                        !isLoggedIn ||
                        !state.user ||
                        !state.access_token ||
                        !state.token
                          ? "/demo/create-survey"
                          : "/dashboard"
                      }
                      className="block w-full bg-[#5B03B2] text-white px-6 py-3 rounded-full text-center font-medium hover:bg-[#4A0291] transition-all duration-300 shadow-lg"
                    >
                      {!isLoggedIn ||
                      !state.user ||
                      !state.access_token ||
                      !state.token
                        ? "Try for Free"
                        : "Dashboard"}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavBar;
