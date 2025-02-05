"use client";

import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-line"></div>
      <style jsx>{`
        .loading-container {
          width: 100%;
          height: 2px;
          background-color: #ffffff;
          overflow: hidden;
        }
        .loading-line {
          width: 100%;
          height: 100%;
          background-color: #a855f7;
          animation: moveLeft 1.5s infinite linear;
          border-radius: 10px;
        }
        @keyframes moveLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
