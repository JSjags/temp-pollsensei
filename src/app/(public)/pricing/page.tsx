"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import NavBar from "@/components/blocks/NavBar";
import { FaRocket, FaChartLine, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/blocks/Footer";
import Pricing from "@/components/publicPages/Pricing";
import ToggleMonth from "@/components/common/ToggleMonth";
import SeePricing from "@/components/publicPages/SeePricing";
import PricingTable from "@/components/publicPages/PricingTable";

const PricingPage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const plans = [
    {
      name: "Basic",
      icon: <FaRocket className="text-4xl mb-4 text-[#5B03B2]" />,
      price: "$9.99",
      description:
        "Perfect for individuals and small teams just getting started.",
      features: [
        "100 surveys/month",
        "Basic analytics",
        "Email support",
        "Customizable survey templates",
        "Data export (CSV, Excel)",
      ],
    },
    {
      name: "Pro",
      icon: <FaChartLine className="text-4xl mb-4 text-[#5B03B2]" />,
      price: "$29.99",
      description:
        "Ideal for growing businesses that need more power and flexibility.",
      features: [
        "Unlimited surveys",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Team collaboration tools",
        "Advanced question types",
        "Survey logic and branching",
      ],
    },
    {
      name: "Enterprise",
      icon: <FaBriefcase className="text-4xl mb-4 text-[#5B03B2]" />,
      price: "Custom",
      description:
        "Tailored solutions for large organizations with complex needs.",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "API access",
        "On-premise deployment",
        "Single Sign-On (SSO)",
        "Advanced security features",
        "Custom integrations",
      ],
    },
  ];

  const handleToggle = (isMonthly: boolean) => {
    console.log(isMonthly ? "Monthly Plan" : "Yearly Plan");
  };

  const featuresRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);


  const scrollToSection = (id: string) => {
    if (id === "features" && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (id === "faqs" && faqsRef.current) {
      faqsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[gradient-to-b from-gray-100 to-white] text-gray-800 overflow-hidden">
      <NavBar scrollToSection={scrollToSection} />
      <main className="container mx-auto px-4 py-16">
        {/* <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#5B03B2]"
        >
          Choose the Right Plan for You
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-12 text-gray-600"
        >
          Unlock the full potential of your surveys with our flexible pricing
          options.
        </motion.p> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
            >
              <div className="flex-grow">
                <div className="flex justify-center">{plan.icon}</div>
                <h2 className="text-2xl font-semibold mb-4 text-[#5B03B2] text-center">
                  {plan.name}
                </h2>
                <p className="text-4xl font-bold mb-4 text-[#5B03B2] text-center">
                  {plan.price}
                  {plan.name !== "Enterprise" && (
                    <span className="text-lg font-normal text-gray-600">
                      /month
                    </span>
                  )}
                </p>
                <p className="text-gray-600 mb-6 text-center">
                  {plan.description}
                </p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {index > 0 && (
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Includes all features from {plans[index - 1].name} plan
                  </p>
                )}
              </div>
              <Link
                href="/register"
                className="block w-full bg-[#5B03B2] text-white text-center py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300 mt-auto"
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </div>
          ))}
        </div> */}
        <section className="p- sm:p- text-[#171725] overflow-hidden w-full">
      
          <div className="flex flex-col gap-3 justify-center text-center py-2 items-center text-black mx-auto">
          <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb text-gray-600"
        >
       Simple Pricing, no hidden fees
        </motion.p>
            {/* <p>Simple Pricing, no hidden fees</p> */}
            <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[calc(4rem-4px)] leading-[50px] font-semibold"
          >
        
              Start Small, Scale <br /> as you wish
      

          </motion.h2>
            <ToggleMonth onToggle={handleToggle} />
          </div>
          <div className="text-[#171725]  mt-12 w-full">
            <Pricing />
          </div>
        </section>
        <div className="mt-16 text-center" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-4">
            Not sure which plan is right for you?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Schedule a free consultation to find the
            perfect fit for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#5B03B2] text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
          >
            Schedule a Consultation
          </Link>
        </div>
      </main>
        <section className=" bg-white text-black overflow-hidden">
          <PricingTable />
           </section>
        <section className=" bg-white text-black overflow-hidden">
          {/* <ContactUsCard /> */}
          <SeePricing />
        </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PricingPage;
