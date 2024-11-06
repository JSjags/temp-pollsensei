import { dark_theme_logo, footer_logo, pollsensei_new_logo } from "@/assets/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="bg-gray-90 text-[#F9F9F9] pt-12 pb-32 px-4 sm:px-6 lg:px-8 w-full relative">
      <div className="container mx-auto w-full">
        <div className="md:flex justify-between items-start  w-full">
          <div className="w-full">
            {/* <h3 className="text-xl font-bold mb-4">PollSensei</h3>
            <p className="text-black text-sm sm:text-base">
              Revolutionizing surveys with AI-powered insights
            </p> */}
            <Image src={pollsensei_new_logo} alt="Logo" />

          </div>

          <div className="flex justify-en gap-10 items-start w-full">
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-black hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-black hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="text-black hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-black hover:text-white"
                  >
                    Benefit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-black hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-black hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">Socials</h4>
              <div className="flex flex-col">
                <a href="#" className="text-black hover:text-white">
                  {/* <FaTwitter /> */}
                  Twitter
                </a>
                <a href="#" className="text-black hover:text-white">
                  {/* <FaFacebook /> */}
                  Facebook
                </a>
                <a href="#" className="text-black hover:text-white">
                  {/* <FaLinkedin /> */}
                  Linkedin
                </a>
                <a href="#" className="text-black hover:text-white">
                  {/* <FaInstagram /> */}
                  Instagram
                </a>
                <a href="#" className="text-black hover:text-white">
                  {/* <FaInstagram /> */}
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-black">
          <p>&copy; 2024 PollSensei. All rights reserved.</p>
        </div>
      </div>
      <Image src={footer_logo} alt="Logo" className="w-full absolute -bottom-[125px] " />
    </footer>
  );
};

export default Footer;
