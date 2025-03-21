"use client";

import PrivateRoute from "@/components/protected/PrivateRoute";
import SuperAdminSidebar from "@/components/superAdmin/SuperAdminSidebar";
import TopNavigation from "@/components/superAdmin/TopNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <PrivateRoute>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-full">
          <SuperAdminSidebar />
          <div className="flex-1 flex flex-col w-full">
            <TopNavigation onClick={() => setSidebarOpen((prev) => !prev)} />
            <main className="flex-1 p-4 bg-gray-100 overflow-y-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PrivateRoute>
  );
}
