import SettingsSidebar from "@/components/settings/SettingsSidebar";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F4F4F4] px-0 lg:px-10 py-6 min-h-screen">
      <div className="px-5 lg:px-0 lg:flex justify-between gap-3 items-start">
        <aside className="">
          <SettingsSidebar />
        </aside>
        <div className="flex flex-col min-h-[70vh] w-full mr-[9rem] rounded bg-[#FFFFFF]">
          {children}
        </div>
      </div>
    </div>
  );
}
