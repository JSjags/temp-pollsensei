"use client";

import React from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  
        <div className="dashboard-layout flex h-screen overflow-hidden">
          <main>{children}</main>
        </div>
  );
}
