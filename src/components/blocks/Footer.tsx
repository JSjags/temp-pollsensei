import {
  dark_theme_logo,
  footer_logo,
  pollsensei_new_logo,
} from "@/assets/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

type Props = {
  onClick?: () => void;
};

const Footer: React.FC<Props> = ({ onClick }) => {
  return (
    <footer className="bg-gray-90 text-[#F9F9F9] pt-12 pb-32 px-4 sm:px-6 lg:px-8 w-full relative overflow-hidden">
      <div className="container mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-2 flex-col gap-y-10  w-full">
          <div className="w-full col-span-1 md:col-span-3 xl:col-span-1 ">
            <Image src={pollsensei_new_logo} alt="Logo" />
          </div>

          <div className="grid lg:grid-cols-4 col-span-1 md:col-span-7 xl:col-span-1 grid-cols-2 gap-10 items-start w-full">
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Company
              </h4>
              <ul className="flex gap-y-4 flex-col">
                <li>
                  <span
                    onClick={onClick}
                    // href="/features"
                    className="text-black hover:text-purple-600"
                  >
                    Update
                  </span>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="mailto:sales@pollsensei.ai"
                    className="text-black hover:text-purple-600"
                  >
                    Contact Sales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resource-hub"
                    className="text-black hover:text-purple-600"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Legal
              </h4>
              <ul className="flex gap-y-4 flex-col">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-black hover:text-purple-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-black hover:text-purple-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Socials
              </h4>
              <div className="flex gap-y-4 flex-col">
                <Link
                  target="_blank"
                  href="https://x.com/pollsenseiAI?t=7fKJdJRHIPfnOLlzEd6oYw&s=09"
                  className="text-black hover:text-purple-600"
                >
                  {/* <FaTwitter /> */}
                  Twitter
                </Link>
                <Link
                  target="_blank"
                  href="https://www.facebook.com/profile.php?id=61567009761421&mibextid=ZbWKwL"
                  className="text-black hover:text-purple-600"
                >
                  {/* <FaFacebook /> */}
                  Facebook
                </Link>
                {/* <a href="#" className="text-black hover:text-white">
                 
                  Linkedin
                </a> */}
                <Link
                  target="_blank"
                  href="https://www.instagram.com/pollsensei/"
                  className="text-black hover:text-purple-600"
                >
                  {/* <FaInstagram /> */}
                  Instagram
                </Link>
                {/* <a href="#" className="text-black hover:text-white">
                  <FaInstagram />
                  Contact Us
                </a> */}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Contact
              </h4>
              <div className="flex gap-y-4 flex-col">
                <Link
                  target="_blank"
                  href={`mailto:support@pollsensei.ai`}
                  className="text-black hover:text-purple-600"
                >
                  support@pollsensei.ai
                </Link>
                <Link
                  href="tel:+2349058772118"
                  className="text-black hover:text-purple-600"
                  target="_blank"
                >
                  +2349058772118
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-black">
          <p>
            &copy; {new Date().getFullYear()} Oaks Intelligence Limited. All
            rights reserved.
          </p>
        </div>
      </div>
      <Image
        src={footer_logo}
        alt="Logo"
        className="w-full absolute -bottom-[125px] "
      />
    </footer>
  );
};

export default Footer;
