import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BenefitsSectionProps {
  benefitsRef: React.RefObject<HTMLElement>;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefitsRef }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const videoContainerVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const taglineVariants = {
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

  return (
    <section
      id="benefits"
      ref={benefitsRef}
      className="py-12 sm:py-24 px-4 lg:px-24 bg-white overflow-hidden"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex flex-col justify-center text-center items-center text-black mx-auto mb-16"
      >
        <motion.div
          variants={taglineVariants}
          initial="initial"
          animate="animate"
          className="border-purple-500 border-2 rounded-full py-2 px-6 text-purple-500 font-semibold mb-6 hover:bg-purple-50 transition-colors duration-300"
        >
          Built for you
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight md:leading-snug lg:leading-normal mb-6"
        >
          Manual Form Creation Meets <br className="hidden md:block" />
          AI Revolution.
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-2xl"
        >
          Create, validate, and analyze surveys effortlessly — all with
          <br className="hidden lg:block" /> PollSensei's intelligent platform.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-12 w-full"
      >
        {/* Feature 1 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl overflow-hidden duration-300"
        >
          <div className="flex flex-col lg:flex-row items-center p-6 lg:p-8 gap-8">
            <motion.div
              variants={videoContainerVariants}
              whileHover="hover"
              className="lg:w-[60%] w-full rounded-xl overflow-hidden"
            >
              <video
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ aspectRatio: "16/9" }}
              >
                <source src="/videos/Generate_survey.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <div className="lg:w-[40%] flex flex-col gap-6">
              <h3 className="text-2xl lg:text-3xl font-medium text-black">
                Survey in Seconds
              </h3>
              <p className="text-gray-600">
                Build audience specific surveys with one simple prompt
              </p>
              <Link
                href="/demo/create-survey"
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center w-full lg:w-auto"
              >
                Survey in 1-Click
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl overflow-hidden duration-300"
        >
          <div className="flex flex-col-reverse lg:flex-row items-center p-6 lg:p-8 gap-8">
            <div className="lg:w-[40%] flex flex-col gap-6">
              <h3 className="text-2xl lg:text-3xl font-medium text-black">
                AI-Powered Assistant
              </h3>
              <p className="text-gray-600">
                Access Real-time PollMaster support throughout the survey
                lifecycle-from creation to reporting.
              </p>
              <Link
                href="/demo/create-survey"
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center w-full lg:w-auto"
              >
                Get Instant AI Assistance
              </Link>
            </div>
            <motion.div
              variants={videoContainerVariants}
              whileHover="hover"
              className="lg:w-[60%] w-full rounded-xl overflow-hidden"
            >
              <video
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ aspectRatio: "16/9" }}
              >
                <source src="/videos/ai_powerded.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl overflow-hidden duration-300"
        >
          <div className="flex flex-col gap-6 p-6 lg:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-medium mb-4 text-black">
                Insightful, Actionable Analysis
              </h3>
              <p className="text-gray-600 mb-6">
                With PollSensei's powerful AI analysis, transform raw data into
                <br className="hidden lg:block" /> clear, impactful insights—no
                data expertise required
              </p>
              <Link
                href="/demo/create-survey"
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 inline-block"
              >
                Try Now
              </Link>
            </div>
            <motion.div
              variants={videoContainerVariants}
              whileHover="hover"
              className="w-full rounded-xl overflow-hidden"
            >
              <video
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ aspectRatio: "16/9" }}
              >
                <source src="/videos/Analysis.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BenefitsSection;
