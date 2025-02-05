import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import EmbedVideo from "../publicPages/EmbedVideo";
import {
  aiReportingIcon,
  dataAnalysisIcon,
  offlinePrintingIcon,
  pollsensei,
  surveyCreationIcon,
  voiceToTextIcon,
} from "@/assets/images";

// Types
interface FeatureCardProps {
  icon: StaticImageData;
  title: string;
  description: string;
  bgColor: string;
  index: number;
}

interface IntegrationImageProps {
  src: StaticImageData;
  alt: string;
  index: number;
}

interface NetworkNode {
  x: number;
  y: number;
  id: string;
}

interface NetworkLink {
  source: NetworkNode;
  target: NetworkNode;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// Animation variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const tagVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const taglineVariants: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const features = [
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
      "Transform spoken responses into text automatically, making data collection and analysis more efficient and accessible.",
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
      "Generate and print surveys for offline distribution while maintaining seamless data integration with your online results.",
    bgColor: "bg-pink-100",
  },
];

const networkData = {
  nodes: [
    { id: "AI Generation", group: 1 },
    { id: "Customizable Templates", group: 2 },
    { id: "Multilingual Support", group: 3 },
    { id: "Speech to Text", group: 4 },
    { id: "Offline Survey", group: 5 },
    { id: "Data Validation", group: 6 },
    { id: "Real-time Reporting", group: 7 },
    { id: "Audience Targeting", group: 8 },
    { id: "Purchase Respondents", group: 9 },
  ],
  links: [
    { source: "AI Generation", target: "Customizable Templates" },
    { source: "Customizable Templates", target: "Multilingual Support" },
    { source: "Multilingual Support", target: "Speech to Text" },
    { source: "Speech to Text", target: "Offline Survey" },
    { source: "Offline Survey", target: "Data Validation" },
    { source: "Data Validation", target: "Real-time Reporting" },
    { source: "Real-time Reporting", target: "Audience Targeting" },
    { source: "Audience Targeting", target: "Purchase Respondents" },
  ],
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  bgColor,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className={cn(
        "p-6 rounded-xl hover:shadow-lg transition-shadow duration-300",
        bgColor
      )}
    >
      <div className="relative w-full h-32 flex items-center justify-center mb-4">
        <Image
          src={icon}
          alt={title}
          width={120}
          height={120}
          className={cn("object-contain", index === 0 && "-translate-x-[7%]")}
        />
      </div>
      <motion.h3
        className="text-xl text-center font-semibold mb-2 text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const IntegrationImage: React.FC<IntegrationImageProps> = ({
  src,
  alt,
  index,
}) => {
  const controls = useAnimation();
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { delay: index * 0.3, duration: 0.8 },
      });
    }
  }, [isInView, controls, index]);

  return (
    <motion.div
      ref={imageRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={controls}
      className="relative overflow-hidden rounded-xl shadow-lg"
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="mx-auto hover:scale-105 transition-transform duration-300"
      />
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: true });

  const getFeatureColor = (featureId: string): string => {
    switch (featureId) {
      case "AI Generation":
        return "bg-purple-500";
      case "Customizable Templates":
        return "bg-blue-500";
      case "Multilingual Support":
        return "bg-green-500";
      case "Speech to Text":
        return "bg-yellow-500";
      case "Offline Survey":
        return "bg-red-500";
      case "Data Validation":
        return "bg-indigo-500";
      case "Real-time Reporting":
        return "bg-pink-500";
      case "Audience Targeting":
        return "bg-orange-500";
      case "Purchase Respondents":
        return "bg-teal-500";
      default:
        return "bg-gray-500";
    }
  };

  const getFeatureIcon = (featureId: string): string => {
    switch (featureId) {
      case "AI Generation":
        return "fa-robot";
      case "Customizable Templates":
        return "fa-palette";
      case "Multilingual Support":
        return "fa-language";
      case "Speech to Text":
        return "fa-microphone";
      case "Offline Survey":
        return "fa-wifi-slash";
      case "Data Validation":
        return "fa-check-circle";
      case "Real-time Reporting":
        return "fa-chart-line";
      case "Audience Targeting":
        return "fa-bullseye";
      case "Purchase Respondents":
        return "fa-users";
      default:
        return "fa-star";
    }
  };

  return (
    <>
      <section
        ref={featuresRef}
        className="py-16 sm:py-24 px-6 lg:px-24 bg-gradient-to-b from-white to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={taglineVariants}
              initial="initial"
              animate="animate"
              className="border-purple-500 w-fit mx-auto border-2 rounded-full py-2 px-6 text-purple-500 font-semibold mb-6 hover:bg-purple-50 transition-colors duration-300"
            >
              Key Features
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight bg-clip-text text-black">
              Discover the Power of PollSensei
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 lg:px-24 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-medium mb-4">Explore PollSensei</h2>
          <p className="text-gray-600 mb-8">How PollSensei Works</p>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <EmbedVideo />
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default FeaturesSection;
