import React from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

const KnowledgeBase: React.FC = () => {
  return (
    <div className="px-5 md:px-20 py-6 w-full mx-auto">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-4">
        Knowledge Base &gt; <span className="font-medium">Home</span>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Popular on Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Popular on Articles</h2>

          <div className="space-y-6">
            {/* Article Item */}
            <div>
              <h3 className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer">
                How can I create a new Survey
              </h3>
              <p className="text-gray-600 mt-2">
                Creating a survey is easy on PollSensei. We make survey creation
                as seamless and fast as possible. Our AI bot is there...
              </p>
              <p className="text-gray-500 text-sm mt-1">20th November, 2024</p>
            </div>

            {/* Article Item */}
            <div>
              <h3 className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer">
                Can I save my survey in any format?
              </h3>
              <p className="text-gray-600 mt-2">
                Saving your survey is easy. You can save your survey offline in
                any format depending on your package. We can also...
              </p>
              <p className="text-gray-500 text-sm mt-1">15th October, 2024</p>
            </div>
          </div>

          <Link href="/articles" className="inline-flex items-center text-purple-700 font-medium mt-6">
            Read more Articles <span className="ml-1">&gt;</span>
          </Link>
        </div>

        {/* Popular Video Tutorials */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Popular Video Tutorials</h2>

          <div className="space-y-6">
            {/* Video Tutorial Item */}
            <div>
              <h3 className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer flex items-center">
                <FaPlay className="text-purple-700 mr-2" /> How can I create a new Survey
              </h3>
              <p className="text-gray-500 text-sm mt-1">20th November, 2024</p>
            </div>

            {/* Video Tutorial Item */}
            <div>
              <h3 className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer flex items-center">
                <FaPlay className="text-purple-700 mr-2" /> Can I save my survey in any format?
              </h3>
              <p className="text-gray-500 text-sm mt-1">20th November, 2024</p>
            </div>
          </div>

          <Link href="/tutorials" className="inline-flex items-center text-purple-700 font-medium mt-6">
            Watch more Tutorials <span className="ml-1">&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
