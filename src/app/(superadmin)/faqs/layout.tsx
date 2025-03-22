//
"use client";

import FAQNavigation from "@/components/superadmin-faqs/FAQNavigation";

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
