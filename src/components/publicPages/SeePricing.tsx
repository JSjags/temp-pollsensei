import React from 'react';

const SeePricing: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 bg-gray-50">
      {/* Gradient background overlay */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-purple-300 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Take the Leap - Experience <br /> Simplified Survey Solution Today!
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Elevate your Survey. Elevate your Insights!
        </p>

        {/* Buttons */}
        <div className="mt- flex justify-center items-center gap-4">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 shadow-lg transition">
            Sign up for Free
          </button>
          <button className="px-6 py-2 text-purple-600 border border-purple-600 rounded-md font-semibold hover:bg-purple-50 transition">
            See Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default SeePricing;
