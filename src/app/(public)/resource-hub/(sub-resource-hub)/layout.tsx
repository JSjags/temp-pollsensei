"use client";

import Footer from "@/components/blocks/Footer";
import NavBar from "@/components/blocks/NavBar";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
// import Navbar from "@/components/blocks/Navbar";

export default function ResoureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div className="dashboard-layout pb-16 md:pb-0">
          <div className="px-5 md:px-20 bg-gradient-to-r from-[#5b03b2] rounded-t-md to-[#9d50bb] text-white py-5 relative">
        <div className="md:flex justify-between items-center ">
          <ol className="flex gap-4 text-white">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="breadcrumb-item">
                {index < breadcrumbs.length - 1 ? (
                  <Link href={breadcrumb.to} className="font-semibold">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  breadcrumb.label
                )}
                {index < breadcrumbs.length - 1 && " > "}
              </li>
            ))}
          </ol>
          <form
            action=""
            className="bg-white mt-4 md:mt-0 lg:w-[27.5rem] px-10 rounded-full flex justify-between items-center"
          >
            <input
              type="text"
              placeholder="Search"
              className="border-none w-full py-2"
            />
            <FaSearch />
          </form>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
