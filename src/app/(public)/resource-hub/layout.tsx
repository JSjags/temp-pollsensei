"use client";

import Footer from "@/components/blocks/Footer";
import NavBar from "@/components/blocks/NavBar";
// import Navbar from "@/components/blocks/Navbar";

export default function ResoureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout pb-16 md:pb-0">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
