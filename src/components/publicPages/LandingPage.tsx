"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import NavBar from "@/components/blocks/NavBar";
import Footer from "@/components/blocks/Footer";
import {
  ai_powered,
  aiReportingIcon,
  analysis,
  bar_chart,
  built_for_u_1,
  dataAnalysisIcon,
  hero_icon_2,
  integration_1,
  integration_2,
  integration_3,
  landing_img,
  offlinePrintingIcon,
  pie_chart,
  poll_video,
  pollsensei,
  surveyCreationIcon,
  voiceToTextIcon,
} from "@/assets/images";
import MarqueSlider from "../common/MarqueSlider";
import { faqs } from "@/data/faqs";
import Accordion from "../common/Accordion";
import Pricing from "./Pricing";
import ContactUsCard from "./ContactusCard";
import { Play } from "lucide-react";
import FeatureCard2 from "./FeatureCard2";
import SeePricing from "./SeePricing";
import GetAppSection from "./GetApp";

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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const featureCardY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="min-h-screen dark:bg-gradient-to-br from-[#1a0b2e] to-[#4a2075] text-white overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex-col gap-10 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 hero_bg ">
          <Image
            src={pollsensei}
            alt="Abstract Background"
            className=" mx-auto"
          />
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
              className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-[500] mb-6 leading-10 md:leading-loose 
              text-black font-inter
               lg:leading-[96px] "
            >
              Redefining Survey Creation for <br className="hidden lg:block" />{" "}
              Smarter Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs sm:text-sm md:text-lg mb-12 max-w-3xl mx-auto text-black"
            >
              {/* Unleash the power of AI-driven surveys. Craft, analyze, and
              innovate with unparalleled precision. */}
              Experience AI-powered surveys that make every response meaningful
              and <br className="hidden lg:block" /> every decision impactful.
            </motion.p>
            <div className="flex justify-center items-center gap-5">
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
                  className="relative inline-block bg-none font-bold py-3 px-6 sm:px-8 rounded-md text-base sm:text-lg shadow-lg overflow-hidden group text-purple-500 border border-purple-500"
                >
                  <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 text-purple-500 border-purple-500 group-hover:text-purple-500 transition-colors duration-300 flex items-center justify-center">
                    Watch Video <Play size={15} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <Image
            src={bar_chart}
            alt="Abstract Background"
            width={100}
            height={100}
            className="hidden lg:flex absolute top-56 left-48"
          />
          <Image
            src={pie_chart}
            alt="Abstract Background"
            width={100}
            height={100}
            className="hidden lg:flex absolute top-48 right-56"
          />
          <Image
            src={hero_icon_2}
            alt="Abstract Background"
            width={150}
            height={150}
            className="absolute bottom-0 right-56"
          />
        </section>
        <section className="pt- sm:pt- bg-white overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center max-w-3xl items-center"
          >
            <Image src={landing_img} alt="Abstract Background" />
          </motion.div>
        </section>

        <section className="pb-16 sm:pb-24 pt-8 bg-white overflow-hidden flex flex-col items-center px-24">
          <h3 className="font-semibold text-[calc(1rem+4px)] text-black mx-auto ">
            Trusted By:
          </h3>
          <MarqueSlider />
        </section>

        {/* Features Section */}
        <section className="pb-12 sm:pb-24 lg:px-24 bg-white overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">
              Built for you
            </div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">
              Manual Form Creation Meets AI Revolution.
            </h2>
            <p>
              Create, validate, and analyze surveys effortlessly — all with{" "}
              <br className="hidden lg:flex" /> PollSensei’s intelligent
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-10 items-center w-full py-8 px-4">
            <div className="p-4 bg-white border-purple rounded-lg shadow-lg lg:flex justify-between items-center gap-5 w-full">
              <div className="lg:w-[60%]">
                <Image src={built_for_u_1} alt="feature" className="w-full" />
              </div>
              <div className="lg:w-[40%] mb-4 lg:mb-0">
                <div className="flex flex-col gap-3 items- text-black mx-">
                  <h2 className="text-[calc(1rem+8px)] font-medium leading-[60px]">
                    Survey in Seconds
                  </h2>
                  <p>
                    Build audience specific surveys with one simple <br />{" "}
                    prompt
                  </p>
                  <button className="auth-btn w-1/2">Get Started</button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border-purple rounded-lg shadow-lg lg:flex justify-between items-center gap-5 w-full">
              <div className="lg:w-[40%] mb-4 md:mb-0">
                <div className="flex flex-col gap-3 items- text-black mx-">
                  <h2 className="text-[calc(1rem+8px)] font-medium leading-[60px]">
                    AI-Powered Assistant
                  </h2>
                  <p>
                    Access Real-time PollMaster support throughout the survey
                    lifecycle-from creation to reporting.
                  </p>
                  <button className="auth-btn w-1/2">Get Started</button>
                </div>
              </div>
              <div className="lg:w-[60%] mb-4 lg:mb-0 mt-3 lg:mt-0">
                <Image src={ai_powered} alt="feature" className="w-full" />
              </div>
            </div>
            <div className="p-4 bg-white border-purple rounded-lg shadow-lg lg:flex flex-col justify-between items-center gap-5 w-full">
              <div className="flex flex-col gap-3 justify-center text-center items-center text-black mx-auto">
                <h2 className="text-[calc(1rem+8px)] font-medium">
                  Insightful, Actionable Analysis
                </h2>
                <p>
                  With PollSensei’s powerful AI analysis, transform raw data
                  into <br className="hidden lg:flex" /> clear, impactful
                  insights—no data expertise required
                </p>
                <button className="auth-btn md:w-1/3">Get Started</button>
              </div>
              <div className="lg:w-[80%] mb-4 lg:mb-0 mt-3 lg:mt-0">
                <Image src={analysis} alt="feature" className="w-full" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-24 px-12 lg:px-24 bg-[#ffffff] text-black overflow-hidden">
          <div className="flex flex-col gap-3 justify-center text-center items-center text-black mx-auto">
            <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">
              Key Features
            </div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">
              Discover the Power of PollSensei
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {[
              {
                icon: pollsensei,
                title: "AI-Driven Engagement",
                description:
                  "Boost response rates with AI-generated, audience-specific questions that capture attention and enhance engagement.",
                bgColor: "bg-indigo-100",
              },
              {
                icon: surveyCreationIcon,
                title: "Instant Survey Creation",
                description:
                  "Create high-quality surveys in a few steps without prior question drafting or manual typing.",
                bgColor: "bg-orange-100",
              },
              {
                icon: dataAnalysisIcon,
                title: "Streamlined Data Analysis",
                description:
                  "Automatically review, validate, and analyze online and offline survey responses, improving efficiency and saving valuable time.",
                bgColor: "bg-purple-100",
              },
              {
                icon: voiceToTextIcon,
                title: "Voice to Text",
                description:
                  "Automatically review, validate, and analyze online and offline survey responses, improving efficiency and saving valuable time.",
                bgColor: "bg-yellow-100",
              },
              {
                icon: aiReportingIcon,
                title: "Comprehensive AI Reporting",
                description:
                  "Access AI-powered reporting for effortless interpretation of qualitative and quantitative data without requiring specialized knowledge.",
                bgColor: "bg-blue-100",
              },
              {
                icon: offlinePrintingIcon,
                title: "Offline Printing",
                description:
                  "Automatically review, validate, and analyze online and offline survey responses, improving efficiency and saving valuable time.",
                bgColor: "bg-pink-100",
              },
            ].map((feature, index) => (
              <FeatureCard2 key={index} {...feature} />
            ))}
          </div>
        </section>

        <section className="py-1 sm:py-2 px-12 lg:px-24 gap-4 bg-[#ffffff] text-black overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <h2 className="text-[calc(2rem+8px)] font-medium">
              Explore PollSensei
            </h2>
            <p className="text-[#667085] ">How PollSensei Works</p>
          </div>
          <div>
            <Image src={poll_video} alt="poll_ videos" className="mx-auto" />
          </div>
        </section>

        <section className="py-12 sm:py-24 px-12 lg:px-24 gap-4 bg-[#ffffff] text-black overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <h2 className="text-[calc(2rem+8px)] font-medium">
              Poll Sensei Integrations
            </h2>
            <p className="text-[#667085] ">Everything you need in one place</p>
          </div>
          <div className="flex flex-col gap-4">
            <Image src={integration_1} alt="poll_ videos" className="mx-auto" />
            <Image src={integration_2} alt="poll_ videos" className="mx-auto" />
            <Image src={integration_3} alt="poll_ videos" className="mx-auto" />
          </div>
        </section>

        {/* <section className="py-12 sm:py-24 px-12 lg:px-24 bg-[#F5F5F5] text-black overflow-hidden">
          <div className="flex flex-col items- text-black mx-">
            <div className="border-purple-500 border w-24 rounded-full py-2 px-5 text-purple-500">
              Features
            </div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">
              Lorem ipsum dolor sit.
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Sed velit varius tempus
              pellentesque sed <br /> maecenas. Nibh imperdiet sit aliquam elit
              feugiat.
            </p>
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
        </section> */}

        {/* <section className="p- sm:p- bg-[#F5F5F5] text-black overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">
              Simple and Flexible Pricing Plans
            </h2>
          </div>
          <div className="px-16 lg:px-24 text-[#99A0AD] mx-auto">
            <Pricing />
          </div>
        </section> */}

        <section className="py-12 sm:py-24 bg-[#F5F5F5] text-black overflow-hidden">
          <div className="flex flex-col justify-center text-center items-center text-black mx-auto">
            <div className="border-purple-500 border rounded-full py-2 px-5 text-purple-500">
              FAQs
            </div>
            <h2 className="text-[calc(2rem+8px)] font-medium leading-[60px]">
              Frequently asked questions
            </h2>
            <p>Everything you need to know about the product and billing.</p>
          </div>
          <div className="lg:w-1/2 mx-auto px-12 lg:px-0">
            <Accordion items={faqs} />
          </div>
        </section>

        <section className=" bg-white text-black overflow-hidden">
          {/* <ContactUsCard /> */}
          <SeePricing />
        </section>
        
        <section className="pt-12 sm:pt-24 lg:px-24 gap-4 bg-white text-black overflow-hidden">
          {/* <ContactUsCard /> */}
          <GetAppSection />
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
