"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/blocks/NavBar";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaChartLine,
  FaUsers,
  FaMobileAlt,
  FaLock,
  FaCog,
  FaRocket,
} from "react-icons/fa";
import Footer from "@/components/blocks/Footer";

const FeaturePage: React.FC = () => {
  const features = [
    {
      icon: <FaChartLine />,
      title: "Advanced Analytics",
      description: "Gain deep insights with our powerful analytics tools.",
    },
    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team on survey projects.",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Responsive",
      description: "Create and manage surveys on any device, anywhere.",
    },
    {
      icon: <FaLock />,
      title: "Data Security",
      description: "Your data is protected with enterprise-grade security.",
    },
    {
      icon: <FaCog />,
      title: "Customization",
      description: "Tailor surveys to match your brand and needs.",
    },
    {
      icon: <FaRocket />,
      title: "Fast Results",
      description: "Get real-time results as responses come in.",
    },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#5B03B2]">
          Powerful Features for Your Surveys
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600">
          Discover the tools that will take your surveys to the next level.
        </p>
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl text-[#5B03B2] w-12 h-12 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold ml-4 text-[#5B03B2]">
                  {feature.title}
                </h2>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Ready to experience these features?
          </h2>
          <p className="text-gray-600 mb-6">
            Start creating powerful surveys today and unlock the full potential
            of your data.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#5B03B2] text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
          >
            Get Started Now
          </Link>
        </motion.div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FeaturePage;
