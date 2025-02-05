"use client";

import EarlyAccessMessage from "@/components/custom/EarlybedMessage";
import React from "react";

const PaymentPage: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-[4.4rem] flex flex-col py-4 sm:py-6 lg:py-[3.88rem]">
      <div className="flex flex-col pb-3 sm:pb-5">
        <h3 className="text-lg sm:text-xl lg:text-[calc(1rem+4px)] font-bold">
          Setup Payment
        </h3>
        <p className="text-[#898989] text-sm sm:text-base mt-2">
          Choose your preferred payment option
        </p>
        <hr className="mt-6 sm:mt-8" />
      </div>
      <EarlyAccessMessage />
    </div>
  );
};

export default PaymentPage;
