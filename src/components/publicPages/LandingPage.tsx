/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import NavBar from "@/components/blocks/NavBar";
import Footer from "@/components/blocks/Footer";
import { faqs } from "@/data/faqs";
import SeePricing from "./SeePricing";
import GetAppSection from "./GetApp";
import Subscribe from "../modals/Subsribe";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import HeroSection from "../landing-page/HeroSection";
import BenefitsSection from "../landing-page/BenefitsSection";
import FeaturesSection from "../landing-page/FeaturesSection";
import FAQSection from "../landing-page/FAQSection";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  y: any;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
  y,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="bg-white bg-opacity- p-6 sm:p-8 rounded-xl hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 border shadow-md hover:shadow-purple-400 border-opacity-"
  >
    <div className="text-3xl sm:text-4xl mb-4 text-purple-300">{icon}</div>
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">{title}</h2>
    <p className="text-sm  text-black">{description}</p>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const [subscribe, setSubscribe] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const scrollToSection = (id: string) => {
    if (id === "features" && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (id === "faqs" && faqsRef.current) {
      faqsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (id === "benefits" && benefitsRef.current) {
      benefitsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the section based on query parameter
  useEffect(() => {
    const url = new URL(window.location.href);
    const section = url.searchParams.get("section");

    if (section === "features" && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "faqs" && faqsRef.current) {
      faqsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "benefits" && benefitsRef.current) {
      benefitsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const [showSensei, setShowSensei] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSubscribe(true);
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   // Helper function to check if it's a new day since the last modal display
  //   const isNewDay = () => {
  //     const lastShown = localStorage.getItem('modalLastShown');
  //     if (!lastShown) return true;

  //     const lastShownDate = new Date(lastShown);
  //     const currentDate = new Date();
  //     return (
  //       lastShownDate.getDate() !== currentDate.getDate() ||
  //       lastShownDate.getMonth() !== currentDate.getMonth() ||
  //       lastShownDate.getFullYear() !== currentDate.getFullYear()
  //     );
  //   };

  //   if (isNewDay()) {
  //     const timer = setTimeout(() => {
  //       setSubscribe(true);
  //       localStorage.setItem('modalLastShown', new Date().toISOString());
  //     }, 10000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  return (
    <main className="min-h-screen">
      <NavBar scrollToSection={scrollToSection} />
      <div className="min-h-screen dark:bg-gradient-to-br from-[#1a0b2e] to-[#4a2075] text-white overflow-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* <section className="pb-16 sm:pb- pt-8 bg-white overflow-hidden flex flex-col items-center px-24">
          <h3 className="font-semibold text-[calc(1rem+4px)] text-black mx-auto ">
            Trusted By:
          </h3>
          <MarqueSlider />
        </section> */}

        {/* Benefits Section*/}
        <BenefitsSection benefitsRef={benefitsRef} />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQs Section */}
        <FAQSection faqs={faqs} />

        <section className=" bg-white text-black overflow-hidden">
          {/* <ContactUsCard /> */}
          <SeePricing />
        </section>

        <section className="pt-12 sm:pt-24 lg:px-24 gap-4 bg-white text-black overflow-hidden">
          {/* <ContactUsCard /> */}
          <GetAppSection />
        </section>
        <Footer onClick={() => setSubscribe((prev) => !prev)} />
      </div>
      {subscribe && (
        <Subscribe
          openModal={subscribe}
          onClose={() => setSubscribe((prev) => !prev)}
        />
      )}
    </main>
  );
};

export default LandingPage;
