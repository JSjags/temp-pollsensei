import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      // <ThemeProvider
      //   attribute="class"
      //   defaultTheme="system"
      //   enableSystem
      //   disableTransitionOnChange
      // >
    <section className="">
        {children}
    </section>
      // </ThemeProvider>
  );
}
