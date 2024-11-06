"use client"

import { useRouter } from 'next/navigation';
import React from 'react';


const NotFound: React.FC = () => {
const router = useRouter();

  const goHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <button
          onClick={goHome}
          className="mt-6 px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
