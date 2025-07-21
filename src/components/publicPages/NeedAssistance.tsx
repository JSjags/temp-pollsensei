import Link from "next/link";
import React from "react";

const NeedAssistance: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 bg-gray-50">
      {/* Gradient background overlay */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-purple-300 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Need assistance or a custom <br /> subscription plan?
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Speak directly to Sales. Get a plan for any budget
        </p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <Link
            href={"mailto:sales@pollsensei.ai"}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white rounded-md font-semibold hover:opacity-90 shadow-lg transition duration-200"
          >
            Contact Sales
          </Link>
          {/* <button className="px-6 py-2 text-purple-600 border border-purple-600 rounded-md font-semibold hover:bg-purple-50 transition">
            See Pricing
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default NeedAssistance;
