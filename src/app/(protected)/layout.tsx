import React from "react";
import PrivateRoute from "@/components/protected/PrivateRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import Navbar from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <div className="w-full pb-16 md:pb-0 bg-[#F7F8FB]">
        <SidebarProvider>
          <div className="flex flex-1 gap-0 pr-2">
            <AppSidebar />
            <main className="flex-1 mt-2 rounded-md">
              <div className="flex justify-between sticky top-0 z-[100]">
                <Navbar />
              </div>
              <div>{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </PrivateRoute>
  );
}
