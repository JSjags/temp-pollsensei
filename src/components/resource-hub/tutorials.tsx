import { smile1, tut1, tut2, tut4 } from '@/assets/images';
import Image from 'next/image';
import React, { useState } from 'react';

const Tutorials: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Text Articles');

  const articles = [
    {
      title: "Welcome to PollSensei: A Step-by-Step Guide to Creating Your First Survey",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: tut1,
    },
    {
      title: "Understanding AI-Powered Survey Creation: How Our Tool Works",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl:tut2,
    },
    {
      title: "Welcome to PollSensei: A Step-by-Step Guide to Creating Your First Survey",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: smile1,
    },
    {
      title: "Understanding AI-Powered Survey Creation: How Our Tool Works",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl:tut4,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-4">Tutorials for you</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('Text Articles')}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'Text Articles' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Text Articles
        </button>
        <button
          onClick={() => setActiveTab('Videos')}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'Videos' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <Image src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{article.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{article.description}</p>
              <p className="text-purple-600 font-semibold text-sm mt-4">{article.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
