"use client";

import React, { ReactNode } from "react";
import { AppSidebar } from "../nav/app-sidebar";
import Navbar from "../navbar/Navbar";
import { SidebarProvider } from "../ui/sidebar";

type Props = {
  children: ReactNode;
};

const AppLayout = (props: Props) => {
  return (
    <SidebarProvider>
      <div className="flex flex-1 gap-0 pr-2">
        <AppSidebar />
        <main className="flex-1 mt-2 rounded-md">
          <div className="flex justify-between">
            <Navbar />
          </div>
          <div className="mt-16">{props.children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
