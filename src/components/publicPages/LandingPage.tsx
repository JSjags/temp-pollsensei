"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  FaRocket,
  FaA,
  FaChartLine,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa6";
import MatrixRain from "@/components/custom/MatrixRain";
import NavBar from "@/components/blocks/NavBar";
import Footer from "@/components/blocks/Footer";
import {
  bar_chart,
  chart,
  hero_icon_1,
  hero_icon_2,
  landing_img,
  pie_chart,
} from "@/assets/images";
import MarqueSlider from "../common/MarqueSlider";
import { faqs } from "@/data/faqs";
import Accordion from "../common/Accordion";
import Pricing from "./Pricing";
import ContactUsCard from "./ContactusCard";

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
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">
      {title}
    </h2>
    <p className="text-sm  text-black">{description}</p>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const featureCardY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="min-h-screen dark:bg-gradient-to-br from-[#1a0b2e] to-[#4a2075] text-white overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 hero_bg ">
          {/* <MatrixRain /> */}
          <motion.div
            style={{ y }}
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          >
            {/* <Image
            src="/images/abstract-bg.svg"
            alt="Abstract Background"
            layout="fill"
            objectFit="cover"
          /> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center relative z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-[500] mb-6 
              text-black font-inter
               leading-[96px]"
            >
              Smarter Approach to Creating <br className="hidden lg:block" />{" "}
              Your Surveys
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs sm:text-sm md:text-lg mb-12 max-w-3xl mx-auto text-black"
            >
              {/* Unleash the power of AI-driven surveys. Craft, analyze, and
              innovate with unparalleled precision. */}
              PollSensei empowers you to create impactful surveys faster and
              gain deeper insights from your audience using AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/register"
                className="relative inline-block bg-white font-bold py-3 px-6 sm:px-8 rounded-md text-base sm:text-lg shadow-lg overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                  Get Started
                </span>
              </Link>
            </motion.div>
          </motion.div>
          <Image
            src={hero_icon_1}
            alt="Abstract Background"
            width={100}
            height={100}
            className="absolute top-32 left-48"
          />
          <Image
            src={hero_icon_2}
            alt="Abstract Background"
            width={150}
            height={150}
            className="absolute bottom-48 right-56"
          />
        </section>
        <section className="pt- sm:pt- bg-white overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center max-w-3xl items-center"
          >
            <Image
              src={landing_img}
              alt="Abstract Background"
              // layout="fill"
              // objectFit=""
            />
          </motion.div>
          <Image
            src={pie_chart}
            alt="pie chart"
            width={60}
            height={60}
            className="absolute top-16 left-72 hidden md:flex"
          />
          <Image
            src={bar_chart}
            alt="bar chart"
            width={60}
            height={60}
            className="absolute bottom-16 left-72 z-30 hidden md:flex"
          />

          <Image
            src={chart}
            alt="chart"
            width={60}
            height={60}
            className="absolute bottom-24 right-72 hidden md:flex"
          />
        </section>


        <section className="pb-16 sm:pb-24 pt-8 bg-white overflow-hidden flex flex-col items-center px-24">
          <h3 className="font-semibold text-[calc(1rem+4px)] text-black mx-auto ">Trusted By:</h3>
                <MarqueSlider />
        </section>

        {/* Features Section */}
        <section className="pb-12 sm:pb-24 bg-white overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">Benefits</div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">Here’s why you should use PollSensei</h2>
            <p>We leverage the power of Artificial Intelligence to guide you every step of the way, from <br className="hidden lg:flex" /> crafting effective questions to unlocking the true meaning behind responses.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  icon: <FaRocket />,
                  title: "AI-Powered Suggestions",
                  description:
                    "Never get stuck for a question again. Pollsensei's AI acts as your brainstorming partner, suggesting relevant questions based on your survey goals. This ensures you gather the most valuable information from your audience..",
                  delay: 0.2,
                },
                {
                  icon: <FaA />,
                  title: "Intuitive Interface",
                  description:
                    "Pollsensei's user-friendly interface lets you create professional surveys in minutes. Simple UI features and clear prompts make crafting questions a breeze, even for beginners with no coding knowledge required.",
                  delay: 0.4,
                },
                {
                  icon: <FaChartLine />,
                  title: "Save time and resources",
                  description:
                    "Streamline your survey process and free up valuable time. AI automates tedious tasks like question suggestion and data analysis, allowing you to focus on what matters most - interpreting results and making data-driven decisions.",
                  delay: 0.6,
                },
                {
                  icon: <FaChartLine />,
                  title: "Sentiment Analysis",
                  description:
                    "Look beyond the words and understand the true feelings behind responses. Pollsensei's AI analyzes sentiment, revealing if your audience is happy, frustrated, or neutral, giving you a deeper understanding of their emotional response.",
                  delay: 0.6,
                },
                {
                  icon: <FaChartLine />,
                  title: "Actionable Insights",
                  description:
                    "Don't get bogged down in raw data. Pollsensei transforms complex information into clear, actionable insights. Get easy-to-understand recommendations that empower you to make informed decisions and take strategic action.",
                  delay: 0.6,
                },
                {
                  icon: <FaChartLine />,
                  title: "Reduce bias",
                  description:
                    "Unconscious bias can skew your survey results. Pollsensei's AI identifies potential bias within your questions, helping you craft fairer and more accurate surveys that capture genuine thoughts and feelings.",
                  delay: 0.6,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: feature.delay }}
                  whileHover={{ scale: 1.05, rotateY: 15, z: 50 }}
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    style={{
                      y: featureCardY,
                    }}
                  >
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={feature.delay}
                      y={featureCardY}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>


        <section className="py-12 sm:py-24 bg-[#F5F5F5] text-black overflow-hidden">
        <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">FAQs</div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">Frequently asked questions</h2>
            <p>Everything you need to know about the product and billing.</p>
          </div>
              <div className="md:w-1/2 mx-auto">
                <Accordion items={faqs} />
              </div>
          </section>

        <section className="p- sm:p- bg-white text-black overflow-hidden">
        <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            {/* <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">FAQs</div> */}
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">Simple and Flexible Pricing Plans</h2>
            {/* <p>Everything you need to know about the product and billing.</p> */}
          </div>
              <div className="px-16 lg:px-24 text-[#99A0AD] mx-auto">
               <Pricing />
              </div>
          </section>


        <section className="py-12 sm:py-24 bg-white text-black overflow-hidden">
       <ContactUsCard />
          </section>



        {/* Testimonials Section */}
        {/* <section
          ref={testimonialsRef}
          className="py-16 sm:py-24 bg-white relative overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10 mb-12 px-4 sm:px-6 lg:px-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-purple-900">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto text-gray-700">
              Discover how PollSensei has transformed survey experiences for
              businesses worldwide.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
          >
            {[
              {
                name: "John Doe",
                role: "Marketing Director",
                company: "TechCorp",
                testimonial:
                  "PollSensei revolutionized our market research. The AI-powered insights are game-changing!",
              },
              {
                name: "Jane Smith",
                role: "HR Manager",
                company: "Global Industries",
                testimonial:
                  "Employee feedback has never been easier to collect and analyze. PollSensei is a must-have tool.",
              },
              {
                name: "Alex Johnson",
                role: "Product Owner",
                company: "InnovateTech",
                testimonial:
                  "The intuitive design and powerful analytics have significantly improved our product development process.",
              },
              {
                name: "Sarah Lee",
                role: "Customer Experience Lead",
                company: "RetailGiant",
                testimonial:
                  "PollSensei helped us uncover crucial customer insights that drove our satisfaction scores through the roof.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-purple-100 p-6 rounded-lg shadow-md w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <p className="font-bold text-purple-900 text-sm sm:text-base">
                  {testimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {testimonial.role}, {testimonial.company}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section> */}

        {/* CTA Section */}
        {/* <section className="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-white">
              Ready to Transform Your Survey Process?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="block w-full sm:w-auto bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-purple-100 transition duration-300 text-base sm:text-lg shadow-md"
                >
                  Join PollSensei
                </Link>
              </motion.div>
              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="block w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-purple-700 transition duration-300 text-base sm:text-lg"
                >
                  Log In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section> */}
        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
