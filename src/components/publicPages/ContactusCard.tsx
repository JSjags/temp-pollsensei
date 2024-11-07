import Image from 'next/image';
import React from 'react';

const ContactUsCard: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-16 lg:px-24">
      <div className=" w-full bg-[#1D0C3B] rounded-xl text-center p-6 md:p-10">
        
        {/* Avatar Group */}
        <div className="flex justify-center mb-4">
          <div className="flex -space-x-2">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Avatar 1"
              className="w-10 h-10 rounded-full border-2 border-[#1D0C3B] object-cover"
              width={5}
              height={5}
            />
            <Image
              src="https://randomuser.me/api/portraits/men/55.jpg"
              alt="Avatar 2"
              className="w-10 h-10 rounded-full border-2 border-[#1D0C3B] object-cover"
              width={5}
              height={5}
            />
            <Image
              src="https://randomuser.me/api/portraits/women/40.jpg"
              alt="Avatar 3"
              className="w-10 h-10 rounded-full border-2 border-[#1D0C3B] object-cover"
              width={5}
              height={5}
            />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-lg font-semibold text-white mb-2">Still have questions?</h2>
        <p className="text-sm text-gray-300 mb-6">
          Can&apos;t find the answer you&apos;re looking for? Please contact our friendly team.
        </p>

        {/* Button */}
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default ContactUsCard;
