// import type { Metadata } from "next";
// import { DM_Sans } from "next/font/google";
// import "./globals.css";
// import ReduxContext from "@/contexts/ReduxContext";
// import { cn } from "@/lib/utils";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AOSInit } from "@/components/ui/Aos";
// import { TanstackProvider } from "@/providers/TanstackProvider";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GoogleAnalytics } from "@next/third-parties/google";
// import { CookieConsent } from "@/components/primitives/CookieConsent";
// import { MixPanelProvider } from "@/contexts/MixpanelContext";
// import UpgradeModal from "@/components/subscription/modal-upgrade";
// import { SenseiProvider } from "@/contexts/SenseiContext";

// const fontSans = DM_Sans({
//   subsets: ["latin"],
//   // weight: ["400", "500", "700"],
//   variable: "--font-sans",
// });
// export const metadata: Metadata = {
//   icons: "/favicon.ico?v=1",
//   title: "PollSensei - Your end-to-end AI survey assistant",
//   description:
//     "Create surveys effortlessly with manual input or AI assistance. Streamline your survey creation process with our intuitive web app.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
//   return (
//     <html lang="en">
//       <AOSInit />
//       <body
//         className={cn(
//           "min-h-screen bg-background font-sans antialiased",
//           fontSans.variable
//         )}
//       >
//         <CookieConsent />
//         <GoogleAnalytics gaId="G-TV4GCEE1JQ" />
//         <GoogleOAuthProvider clientId={googleClientId}>
//           <TanstackProvider>
//             <ToastContainer className={`${cn(fontSans.variable)} z-50`} />
//             <ReduxContext>
//               <SenseiProvider>
//                 <UpgradeModal />
//                 <MixPanelProvider>{children}</MixPanelProvider>
//               </SenseiProvider>
//             </ReduxContext>
//           </TanstackProvider>
//         </GoogleOAuthProvider>
//       </body>
//     </html>
//   );
// }

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
import { MixPanelProvider } from "@/contexts/MixpanelContext";
import UpgradeModal from "@/components/subscription/modal-upgrade";
import { SenseiProvider } from "@/contexts/SenseiContext";

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
      <head>
        {/* Hotjar Tracking Code (Production Only) */}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:5247887,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }}
          />
        )}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* <CookieConsent /> */}
        <GoogleAnalytics gaId="G-TV4GCEE1JQ" />
        <GoogleOAuthProvider clientId={googleClientId}>
          <TanstackProvider>
            <ToastContainer className={`${fontSans.className} z-50`} />
            <ReduxContext>
              <SenseiProvider>
                <UpgradeModal />
                <MixPanelProvider>{children}</MixPanelProvider>
              </SenseiProvider>
            </ReduxContext>
          </TanstackProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
