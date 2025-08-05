"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SidebarProvider } from "@/components/ui/sidebar";

interface GlobalSidebarProviderProps {
  children: React.ReactNode;
}

export const GlobalSidebarProvider: React.FC<GlobalSidebarProviderProps> = ({
  children,
}) => {
  const user = useSelector((state: RootState) => state.user?.user);

  if (user) {
    return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>;
  }

  return <>{children}</>;
};
