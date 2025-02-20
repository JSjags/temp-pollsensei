import type { Metadata } from "next";
import {
  DM_Sans,
  Lexend,
  Roboto,
  Playfair_Display,
  Montserrat,
  Lora,
  Merriweather,
} from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Script from "next/script";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { cn } from "@/lib/utils";
import { MixPanelProvider } from "@/contexts/MixpanelContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import ReduxContext from "@/contexts/ReduxContext";
import { SenseiProvider } from "@/contexts/SenseiContext";
import UpgradeModal from "@/components/subscription/modal-upgrade";
import { AOSInit } from "@/components/ui/Aos";
import MetaPixel from "@/components/MetaPixel";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
}) as NextFontWithVariable;

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
  preload: true,
}) as NextFontWithVariable;
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
}) as NextFontWithVariable;
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
}) as NextFontWithVariable;
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-montserrat",
}) as NextFontWithVariable;
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: true,
}) as NextFontWithVariable;
const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  preload: true,
}) as NextFontWithVariable;

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
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode:"siqaf0b431e5699faf2a8cb25ad1bd13007939df411b201343c2e60d7efe686c7c491fd08d388e701b42cbb5f13245147eb", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.write("<div id='zsiqwidget'></div>");`,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          lexend.variable,
          roboto.variable,
          playfair.variable,
          montserrat.variable,
          lora.variable,
          merriweather.variable
        )}
      >
        {/* <CookieConsent /> */}
        <GoogleAnalytics gaId="G-TV4GCEE1JQ" />
        <GoogleOAuthProvider clientId={googleClientId}>
          <TanstackProvider>
            <ToastContainer
              className={`${cn(fontSans.variable)} !z-[9999999999999]`}
              limit={1}
            />
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
