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

import MetaPixel from "@/components/MetaPixel";
import UpgradeModal from "@/components/subscription/modal-upgrade";
import { AOSInit } from "@/components/ui/Aos";
import { MixPanelProvider } from "@/contexts/MixpanelContext";
import ReduxContext from "@/contexts/ReduxContext";
import { SenseiProvider } from "@/contexts/SenseiContext";
import { cn } from "@/lib/utils";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Script from "next/script";

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
      <MetaPixel />
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=1295383375247111&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <script
          src="https://desk.zoho.com/portal/api/feedbackwidget/962073000000470140?orgId=861220932&displayType=popout"
          defer
        />
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
            <ToastContainer
              className={`${cn(fontSans.variable)} !z-[9999999999999]`}
            />
            <ReduxContext>
              <SenseiProvider>
                <UpgradeModal />
                <MixPanelProvider>{children}</MixPanelProvider>
              </SenseiProvider>
            </ReduxContext>
          </TanstackProvider>
        </GoogleOAuthProvider>
        <Script
          src="https://desk.zoho.com/portal/api/feedbackwidget/962073000000470140?orgId=861220932&displayType=popout"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
