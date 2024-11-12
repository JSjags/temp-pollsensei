"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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
import Subscribe from "../modals/Subsribe";
import { useRouter } from "next/navigation";
import EmbedVideo from "./EmbedVideo";

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
  const router = useRouter();
  const featureCardY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [subscribe, setSubscribe] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

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
        <section className="relative min-h-screen flex-col gap-10 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 hero_bg ">
          <Image
            src={pollsensei}
            alt="Abstract Background"
            className=" mx-auto"
          />
          <motion.div
            style={{ y }}
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          ></motion.div>

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
                    Write your First Prompt
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
                  href="https://youtu.be/VtHEtba0OnA?si=oAP1P0nwoRn2-Vm3"
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

        {/* <section className="pb-16 sm:pb- pt-8 bg-white overflow-hidden flex flex-col items-center px-24">
          <h3 className="font-semibold text-[calc(1rem+4px)] text-black mx-auto ">
            Trusted By:
          </h3>
          <MarqueSlider />
        </section> */}

        <section
          id="benefits"
          ref={benefitsRef}
          className="pb-12 sm:py-24 lg:px-24 bg-white overflow-hidden"
        >
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
                {/* <Image src={built_for_u_1} alt="feature" className="w-full" /> */}
                <video loop muted autoPlay className="w-full">
                  <source
                    src={"/videos/Generate_survey.mp4"}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
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
                  <Link href={"/login"} className="auth-btn w-1/2">
                    Survey in 1-Click
                  </Link>
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
                  <Link href={"/login"} className="auth-btn w-1/2">
                    Get Instant AI Assistance
                  </Link>
                </div>
              </div>
              <div className="lg:w-[60%] mb-4 lg:mb-0 mt-3 lg:mt-0">
                {/* <Image src={ai_powered} alt="feature" className="w-full" /> */}
                <video loop muted autoPlay className="w-full">
                  <source
                    src={"/videos/ai_powerded.mp4"}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
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
                <Link href={"/login"} className="auth-btn md:w-1/3">
                  Try Now
                </Link>
              </div>
              <div className="lg:w-[80%] mb-4 lg:mb-0 mt-3 lg:mt-0">
                {/* <Image src={analysis} alt="feature" className="w-full" /> */}
                <video loop muted autoPlay className="w-full">
                  <source src="/videos/Analysis.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          ref={featuresRef}
          className="py-12 sm:py-24 px-12 lg:px-24 bg-[#ffffff] text-black overflow-hidden"
        >
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
            {/* <Image src={poll_video} alt="poll_ videos" className="mx-auto" /> */}
            <EmbedVideo />
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

        {/* FAQs Section */}
        <section
          id="faqs"
          ref={faqsRef}
          className="py-12 sm:py-24 bg-[#F5F5F5] text-black overflow-hidden"
        >
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
