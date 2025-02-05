import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

interface ButtonWrapperProps {
  children: React.ReactNode;
}

interface CTAButtonsProps {
  className?: string;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="relative inline-block rounded-full"
  >
    {children}
  </motion.div>
);

const CTAButtons: React.FC<CTAButtonsProps> = ({ className = "" }) => {
  // Generate random positions for glitter particles
  const glitterParticles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className={`flex justify-center items-center gap-5 ${className} rounded-full`}
    >
      {/* Primary Button - Write your First Prompt */}
      <ButtonWrapper>
        <Link href="/demo/create-survey">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] font-bold py-3 px-8 text-lg shadow-lg overflow-hidden group rounded-full"
          >
            {/* AI Glitter Effect */}
            {glitterParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, particle.scale, 0],
                }}
                transition={{
                  duration: 2,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Button Text */}
            <span className="relative z-10 text-white flex items-center gap-2">
              Write your First Prompt
            </span>
          </motion.div>
        </Link>
      </ButtonWrapper>

      {/* Secondary Button - Watch Video */}
      <ButtonWrapper>
        <Link
          href="https://youtu.be/VtHEtba0OnA?si=oAP1P0nwoRn2-Vm3"
          target="_blank"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-white font-bold py-3 px-8 text-lg overflow-hidden group rounded-full"
          >
            {/* Moving Light Border Effect */}
            <div className="absolute inset-0 border-2 border-[#5B03B2]  rounded-full">
              <motion.div
                className="absolute w-10 h-full bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50 rounded-full"
                animate={{
                  left: ["-20%", "120%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 4,
                }}
              />
            </div>

            {/* Button Text */}
            <span className="relative z-10 text-[#5B03B2] flex items-center gap-2">
              Watch Video
              <Play size={15} />
            </span>
          </motion.div>
        </Link>
      </ButtonWrapper>
    </div>
  );
};

export default CTAButtons;
