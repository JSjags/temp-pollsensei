"use client"

import React from 'react'

interface Card {
  title: string;
  subtitle: string;
  bgColor: string;
  hasPlayButton?: boolean;
}

const cardsData: Card[] = [
  { title: "How to create a survey", subtitle: "Watch Video", bgColor: "bg-green-200", hasPlayButton: true },
  { title: "How to create a survey", subtitle: "Read article", bgColor: "bg-yellow-200" },
  { title: "How to create a survey", subtitle: "Watch Video", bgColor: "bg-blue-200", hasPlayButton: true },
  { title: "How to create a survey", subtitle: "Read article", bgColor: "bg-green-200" },
  { title: "How to create a survey", subtitle: "Read article", bgColor: "bg-green-200" },
  { title: "How to create a survey", subtitle: "Watch Video", bgColor: "bg-pink-200", hasPlayButton: true },
  { title: "How to create a survey", subtitle: "Watch Video", bgColor: "bg-pink-200", hasPlayButton: true },
  { title: "How to create a survey", subtitle: "Read article", bgColor: "bg-purple-200" },
  { title: "How to create a survey", subtitle: "Read article", bgColor: "bg-purple-200" },
];

const TutorialPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardsData.map((card, index) => (
        <div
          key={index}
          className="flex flex-col bg-white shadow rounded-lg overflow-hidden"
        >
          {/* Card Background */}
          <div className={`relative h-40 ${card.bgColor} flex justify-center items-center`}>
            {card.hasPlayButton && (
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-4.586-2.577A1 1 0 009 9.423v5.154a1 1 0 001.166.982l4.586-2.577a1 1 0 000-1.732z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-800">{card.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
          </div>

          {/* Action Menu */}
          <div className="absolute top-2 right-2">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75h.008v.008H12V6.75zm0 5.25h.008v.008H12V12zm0 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default TutorialPage
