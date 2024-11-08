import React from "react";
import { FaSmileWink } from "react-icons/fa";

const EarlyAccessMessage: React.FC = () => {
  return (
    <div className=" mx-auto p-6 bg-gradient-to-r  text-black rounded-lg">
      <div className="flex items-center space-x-4">
        <FaSmileWink className="text-3xl animate-pulse text-yellow-500" />
        <h2 className="text-2xl font-bold">You’re one of the lucky few! 🎉</h2>
      </div>
      <p className="mt-4 text-lg leading-relaxed">
        Congratulations! You’re among our{" "}
        <span className="font-semibold underline">exclusive early birds</span>{" "}
        who are enjoying <span className="font-bold">free access</span> to our
        platform. No payment. No subscription. Just pure, unlimited access to
        everything we offer!
      </p>
      <p className="mt-4 text-sm text-indigo-20 font-medium">
        Enjoy it while it lasts, because this is our special thank-you for
        joining us early!
      </p>
      {/* <button className="mt-6 px-4 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-indigo-100 transition duration-200">
        Start Exploring Now
      </button> */}
    </div>
  );
};

export default EarlyAccessMessage;
