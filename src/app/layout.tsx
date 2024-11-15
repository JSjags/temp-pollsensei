import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ReduxContext from "@/contexts/ReduxContext";
import { cn } from "@/lib/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AOSInit } from "@/components/ui/Aos";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieConsent } from "@/components/primitives/CookieConsent";

const fontSans = DM_Sans({
  subsets: ["latin"],
  // weight: ["400", "500", "700"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  icons: "/favicon.ico?v=1",
  title: "PollSensei - Your end-to-end AI survey assistant",
  description:
    "Create surveys effortlessly with manual input or AI assistance. Streamline your survey creation process with our intuitive web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <html lang="en">
      <AOSInit />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <CookieConsent />
        <GoogleAnalytics gaId="G-TV4GCEE1JQ" />
        <GoogleOAuthProvider clientId={googleClientId}>
          <TanstackProvider>
            <ToastContainer className={`${cn(fontSans.variable)} z-50`} />
            <ReduxContext>{children}</ReduxContext>
          </TanstackProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
