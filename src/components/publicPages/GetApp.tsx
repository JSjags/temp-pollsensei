import { get_android, get_ios, phone_1, phone_2 } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const GetAppSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-12 md:p-24 py-0 md:py-0 bg-gradient-to-br from-white to-purple-50 shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)] rounded-2xl">
      {/* Left Section - App Promotion Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="md:w-1/2 space-y-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
        >
          Get the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            mobile app
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          Download our mobile app. Available on Apple <br /> Store and Play
          Store
        </motion.p>

        {/* Store buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex gap-6 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image src={get_ios} alt="Apple Store" className="w-32 md:w-36" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={get_android}
              alt="Play Store"
              className="w-32 md:w-36"
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Section - Phone Mockups */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="md:w-1/2 flex justify-center items-end mt-16 md:mt-0 relative"
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Image
            src={phone_1}
            alt="Phone mockup 1"
            className="w-48 h-auto md:w-56 lg:w-64 drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [20, 0, 20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-0 -ml-20 md:-ml-24 lg:-ml-28"
        >
          <Image
            src={phone_2}
            alt="Phone mockup 2"
            className="w-48 h-auto md:w-56 lg:w-64 drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GetAppSection;
