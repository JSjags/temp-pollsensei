import SettingsSidebar from "@/components/settings/SettingsSidebar";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-0 py-6 sm:py-6 min-h-screen max-w-[1400px] mx-auto">
      <div className="lg:flex justify-between gap-3 items-start">
        <aside className="">
          <SettingsSidebar />
        </aside>
        <div className="flex flex-1 flex-col min-h-[70vh] w-full max-w-[1000px] mr-4 rounded lg:bg-[#FFFFFF]">
          {children}
        </div>
      </div>
    </div>
  );
}
