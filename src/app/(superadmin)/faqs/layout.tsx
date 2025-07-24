"use client";

import FAQNavigation from "@/components/superadmin-faqs/FAQNavigation";
import { useAllFAQsQuery } from "@/services/superadmin.service";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen bg-gray-100 px-0">
      <FAQNavigation />
      {children}
    </section>
  );
}
