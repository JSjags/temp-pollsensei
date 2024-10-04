"use client";

import React from "react";
import PrivateRoute from "@/components/protected/PrivateRoute";
import Navbar from "@/components/navbar/Navbar";
import MobileNavbar from "@/components/navbar/MobileNavbar";
// import { SocketProvider } from "@/contexts/SenseiContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      {/* <SocketProvider> */}
      <div className="dashboard-layout pb-16 md:pb-0">
        <Navbar />
        {/* You can add common dashboard elements here, like a sidebar or header */}
        <main>{children}</main>
        <MobileNavbar />
      </div>
      {/* </SocketProvider> */}
    </PrivateRoute>
  );
}
