import {
  DM_Sans,
  Lexend,
  Roboto,
  Playfair_Display,
  Montserrat,
  Lora,
  Merriweather,
} from "next/font/google";

export const fonts = {
  sans: DM_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
  }),
  lexend: Lexend({
    subsets: ["latin"],
    variable: "--font-lexend",
    display: "swap",
  }),
  roboto: Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap",
  }),
  playfair: Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
  }),
  montserrat: Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
  }),
  lora: Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    display: "swap",
  }),
  merriweather: Merriweather({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-merriweather",
    display: "swap",
  }),
};
