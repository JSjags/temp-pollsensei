"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { pollsensei_new_logo } from "@/assets/images";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="min-h-screen">
      <header className="sticky top-0 z-50 shadow-md bg-white">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={pollsensei_new_logo}
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-[#5B03B2] px-4 py-2 transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-[#5B03B2] text-white px-4 py-2 hover:bg-[#4A0291] transition-colors duration-300 rounded-md"
            >
              Sign Up
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
                  <button
                    className="self-end rounded-full p-2"
                    onClick={toggleSidebar}
                  >
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
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-[#5B03B2] py-2 text-center"
                      onClick={toggleSidebar}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-[#5B03B2] text-white px-4 py-2 rounded-md hover:bg-[#4A0291] transition-colors duration-300 text-center"
                      onClick={toggleSidebar}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {children}
    </section>
  );
}
