import React from "react";
import Image from "next/image";
import { sparkly } from "@/assets/images";
import { motion } from "framer-motion";

interface SurveyHeaderProps {
  logoUrl: string | File | null;
  headerUrl: string | File | null;
  survey: any;
  headerText: any;
  bodyText: any;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  logoUrl,
  headerUrl,
  survey,
  headerText,
  bodyText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {logoUrl && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-r from-[#9D50BB] to-[#6E48AA] rounded-lg w-16 my-5 text-white flex items-center flex-col shadow-lg hover:shadow-xl transform"
        >
          <Image
            src={
              logoUrl instanceof File
                ? URL.createObjectURL(logoUrl)
                : typeof logoUrl === "string"
                ? logoUrl
                : sparkly
            }
            alt=""
            className="w-full object-cover rounded-lg bg-no-repeat h-16 transition-transform duration-300"
            width={100}
            height={200}
          />
        </motion.div>
      )}

      {headerUrl && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-[#9D50BB] to-[#6E48AA] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col shadow-lg overflow-hidden"
        >
          <Image
            src={
              headerUrl instanceof File
                ? URL.createObjectURL(headerUrl)
                : typeof headerUrl === "string"
                ? headerUrl
                : sparkly
            }
            alt=""
            className="w-full object-cover bg-no-repeat h-24 rounded-lg transition-transform duration-300 hover:scale-105"
            width={100}
            height={200}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg w-full my-4 flex gap-2 px-4 md:px-6 py-6 flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[1.5rem] font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent"
          style={{
            fontSize: `${headerText?.size}px`,
            fontFamily: `${headerText?.name}`,
          }}
        >
          {survey?.topic}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-gray-600 leading-relaxed"
          style={{
            fontSize: `${bodyText?.size}px`,
            fontFamily: `${bodyText?.name}`,
          }}
        >
          {survey?.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SurveyHeader;
