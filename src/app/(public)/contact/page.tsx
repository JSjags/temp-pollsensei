"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/blocks/NavBar";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/blocks/Footer";

const ContactPage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#5B03B2]"
          data-aos="fade-down"
        >
          Contact Us
        </h1>
        <p
          className="text-xl text-center mb-12 text-gray-600"
          data-aos="fade-up"
        >
          We&apos;re here to help. Reach out to us for any questions or
          concerns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div
            className="bg-white rounded-xl p-8 shadow-lg"
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#5B03B2]">
              Get in Touch
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B03B2]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B03B2]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border resize-none border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B03B2]"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#5B03B2] text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          <div
            className="bg-white rounded-xl p-8 shadow-lg"
            data-aos="fade-left"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#5B03B2]">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="text-[#5B03B2] mr-3 text-xl" />
                <p>info@surveypro.com</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-[#5B03B2] mr-3 text-xl" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-[#5B03B2] mr-3 text-xl" />
                <p>123 Survey St, Data City, AN 12345</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-[#5B03B2]">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#5B03B2] hover:text-opacity-80 transition-colors duration-300"
              >
                <FaFacebookF className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-[#5B03B2] hover:text-opacity-80 transition-colors duration-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-[#5B03B2] hover:text-opacity-80 transition-colors duration-300"
              >
                <FaLinkedinIn className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-[#5B03B2] hover:text-opacity-80 transition-colors duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-4 text-[#5B03B2]">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of businesses that trust SurveyPro for their survey
            needs.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#5B03B2] text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
