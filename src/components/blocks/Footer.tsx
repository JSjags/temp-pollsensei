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
        <div className="md:flex justify-between items-start  w-full">
          <div className="w-full">
            <Image src={pollsensei_new_logo} alt="Logo" />
          </div>

          <div className="flex justify-en gap-10 items-start w-full">
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Company
              </h4>
              <ul className="space-y-2">
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
                  <Link href="mailto:sales@pollsensei.ai" className="text-black hover:text-purple-600">
                    Contact Sales
                  </Link>
                </li>
                <li>
                  <Link href="/resource-hub" className="text-black hover:text-purple-600">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#606060] mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
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
              <div className="flex flex-col">
                <Link
                  href="https://x.com/pollsenseiAI?t=7fKJdJRHIPfnOLlzEd6oYw&s=09"
                  className="text-black hover:text-purple-600"
                >
                  {/* <FaTwitter /> */}
                  Twitter
                </Link>
                <Link
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
