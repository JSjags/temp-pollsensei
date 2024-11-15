import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-center bg-gray-100 px-6 md:mx-20 py-10">
      {/* Left Section */}
      <div className="lg:w-1/2 mb-10 lg:mb-0 mx-auto">
        <h1 className="text-6xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 text-sm mt-4">
          Do you have questions or concerns that we can help you with?
         
        </p>
        <p className="text-gray-600 text-sm mt-4">
        Please use the contact form below, and we'll get back to you.
         
        </p>

      </div>

      {/* Right Section (Form) */}
      <div className="bg-white shadow-md rounded-lg lg:w-1/2 w-full p-8">
        <form>
          {/* Name */}
          <div className="flex flex-col mb-6">
            <label className="text-gray-700 font-medium">
              Name<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="First name"
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email and Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-700 font-medium">
                Email<span className="text-red-500"> *</span>
              </label>
              <input
                type="email"
                placeholder="email@pollsensei.com"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (xxx) (xxxx)"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col mb-6">
            <label className="text-gray-700 font-medium">Message</label>
            <textarea
              placeholder="Your Message"
              className="mt-2 p-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
