import React from "react";
import Image from "next/image";
import { teamIcon } from "../../assets/images";

interface InviteSuccessProps {
  onClick: () => void;
  email: string;
}

const InviteSuccess: React.FC<InviteSuccessProps> = ({ onClick, email }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-75 text-center mt-16">
        <Image
          src={teamIcon}
          alt="Team icon"
          width={70}
          height={70}
          className="mx-auto"
        />
        <p className="text-2xl font-bold mt-3">Member Successfully added</p>
        <p className="text-[#7A8699] font-normal text-[calc(1rem+2px)]">
          An invite has been sent to {email}
        </p>
        <button className="auth-btn mt-5" onClick={onClick}>
          Continue...
        </button>
      </div>
    </div>
  );
};

export default InviteSuccess;
