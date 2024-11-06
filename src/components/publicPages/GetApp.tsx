
import { get_android, get_ios, phone_1, phone_2 } from '@/assets/images';
import Image from 'next/image';
import React from 'react';
const appStoreImage = '/path/to/apple-store-placeholder.png';
const playStoreImage = '/path/to/play-store-placeholder.png';
const phoneImage1 = '/path/to/phone-placeholder1.png';
const phoneImage2 = '/path/to/phone-placeholder2.png';

const GetAppSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white">
      {/* Left Section - App Promotion Text */}
      <div className="md:w-1/2">
        <h2 className="text-3xl md:text-6xl font-bold text-gray-900">
          Get the <br /> mobile app
        </h2>
        <p className="mt-4 text-gray-600">
          Download our mobile app. Available on Apple <br /> Store and Play Store
        </p>
        
        {/* Store buttons */}
        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2  bg-gray-10 rounded-lg shadow hover:bg-gray-200 transition">
            <Image src={get_ios} alt="Apple Store" className="w-28" />
            {/* <span className="text-gray-800 font-semibold">Get on iPhone</span> */}
          </button>
          <button className="flex items-center gap-2  bg-gray-10 rounded-lg shadow hover:bg-gray-200 transition">
            <Image src={get_android} alt="Play Store" className="w-28" />
            {/* <span className="text-gray-800 font-semibold">Get on Android</span> */}
          </button>
        </div>
      </div>

      {/* Right Section - Phone Mockups */}
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 relative">
        <Image src={phone_1} alt="Phone mockup 1" className="w-40 h-auto md:w-48 lg:w-56 relative z-10" />
        <Image src={phone_2} alt="Phone mockup 2" className="w-40 h-auto md:w-48 lg:w-56 -ml-16 md:-ml-20 lg:-ml-24 relative z-0" />
      </div>
    </div>
  );
};

export default GetAppSection;
