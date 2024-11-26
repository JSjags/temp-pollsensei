// 

import TutorialNavigation from "@/components/super-admin-tutorial/TutorialNavigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen bg-gray-100">
      <TutorialNavigation />
      {children}
      </section>
  );
}
