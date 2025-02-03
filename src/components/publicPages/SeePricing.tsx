import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

const SeePricing: React.FC = () => {
  const router = useRouter();
  return (
    <section className="relative flex flex-col items-center justify-center py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated gradient background overlay */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-300/40 to-transparent animate-gradient" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
        >
          Take the Leap - Experience <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Simplified Survey Solution
          </span>{" "}
          Today!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-gray-600 text-lg sm:text-xl"
        >
          Elevate your Survey. Elevate your Insights!
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <Link
            href={"/register"}
            onClick={() => router.push("/register")}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Sign up for Free
          </Link>
          <Link
            href={"/pricing"}
            onClick={() => router.push("/pricing")}
            className="px-8 py-3 text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            See Pricing
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SeePricing;
