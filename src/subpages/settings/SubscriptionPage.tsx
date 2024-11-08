"use client";

import EarlyAccessMessage from "@/components/custom/EarlybedMessage";
import React from "react";

const SubscriptionPage: React.FC = () => {
  return (
    <div className="px-[2rem] lg:px-[4.4rem] flex flex-col py-[1.5rem] md:py-[3.88rem]">
      <div className="flex flex-col pb-5">
        <h3 className="text-[calc(1rem+4px)] font-bold ">Subscription</h3>
        <p className="text-[#898989] text-[calc(1rem-2px)]">
          {/* Subscription */}
        </p>
        <hr className="mt-8" />
      </div>
      <EarlyAccessMessage />
    </div>
  );
};

export default SubscriptionPage;
