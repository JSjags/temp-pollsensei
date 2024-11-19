"use client";

import PrivateRoute from "@/components/protected/PrivateRoute";
import SuperAdminSidebar from "@/components/superAdmin/SuperAdminSidebar";
import TopNavigation from "@/components/superAdmin/TopNavigation";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <PrivateRoute>
      <div className="dashboard-layout flex h-screen overflow-hidden">
        <SuperAdminSidebar
          isSidebarOpen={isSidebarOpen}
          onClose={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="flex-1 flex flex-col">
          <TopNavigation onClick={() => setSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
