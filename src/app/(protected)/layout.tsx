"use client";

import React from "react";
import PrivateRoute from "@/components/protected/PrivateRoute";
import Navbar from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <div className="dashboard-layout">
        <Navbar />
        {/* You can add common dashboard elements here, like a sidebar or header */}
        <main>{children}</main>
      </div>
    </PrivateRoute>
  );
}
