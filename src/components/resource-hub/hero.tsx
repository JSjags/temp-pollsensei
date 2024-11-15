import { question_mark } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Help = () => {
  return (
    <div className="bg-[#F7E9FD] h-[90vh] flex justify-between w-full items-center flex-col  relative pt-24 pb-20 px-5 md:px-20 ">
      <div className="flex justify-between items-center w-full">
        <div className="text">
          <div className="text-black py-10">
            <h1 className="text-5xl font-bold pb-5 font-[Helvetica]">
              Hello 👋
            </h1>
            <h1 className="text-5xl font-bold font-[Helvetica]">
              How can we help you?
            </h1>
          </div>

          <form
            action=""
            className="bg-white md:w-[27.5rem] px-10 rounded-full flex justify-between items-center"
          >
            <input
              type="text"
              placeholder="Search"
              className="border-none w-full ring-0 outline-none py-2"
            />
            <FaSearch />
          </form>
        </div>

        <Image src={question_mark} alt="question mark" className="hidden lg:flex" />
      </div>
    </div>
  );
};

export default Help;
