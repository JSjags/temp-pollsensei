"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/blocks/NavBar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/blocks/Footer";
import ToggleMonth from "@/components/common/ToggleMonth";
import PricingTable from "@/components/publicPages/PricingTable";
import NeedAssistance from "@/components/publicPages/NeedAssistance";
import axiosInstanceWithoutToken from "@/lib/axios-instance-without-token";

interface Feature {
  _id: string;
  feature_name: string;
}

interface Plan {
  _id: string;
  name: string;
  description: string;
  monthly_price_naira: number;
  monthly_price_dollar: number;
  yearly_price_naira: number;
  yearly_price_dollar: number;
  total_yearly_price_naira: number;
  total_yearly_price_dollar: number;
  trial_period: number;
  number_of_collaborators: number | string;
  number_of_monthly_responses: number | string;
  number_of_accounts: number | string;
  features: Feature[];
}

const PricingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-8 md:py-16 pb-0 md:pb-0">
        <section className="text-[#171725] overflow-hidden w-full">
          <div className="flex flex-col gap-3 justify-center text-center py-2 items-center text-black mx-auto">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-72 bg-gray-200 rounded animate-pulse mt-4"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-4"></div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-20">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 md:p-8 shadow-lg h-[600px]"
              >
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await axiosInstanceWithoutToken.get("/plan");
      return response.data as Plan[];
    },
  });

  console.log(plansData);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleToggle = (monthly: boolean) => {
    setIsMonthly(monthly);
  };

  if (isLoading) {
    return <PricingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-8 md:py-16 pb-0 md:pb-0">
        <section className="text-[#171725] overflow-hidden w-full">
          <div className="flex flex-col gap-3 justify-center text-center py-2 items-center text-black mx-auto">
            <motion.p
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600"
            >
              Simple Pricing, no hidden fees
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-semibold leading-tight"
            >
              Start Small, Scale <br /> as you wish
            </motion.h2>
            <ToggleMonth onToggle={handleToggle} />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-20">
            {plansData?.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                data-aos="fade-up"
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#5B03B2] mb-4">
                    {plan.name}
                  </h3>
                  <div className="text-3xl md:text-4xl font-bold text-[#5B03B2] mb-6">
                    $
                    {isMonthly
                      ? plan.monthly_price_dollar
                      : plan.total_yearly_price_dollar}
                    <span className="text-lg font-normal text-gray-600">
                      /{isMonthly ? "month" : "year"}
                    </span>
                    {!isMonthly && plan.monthly_price_dollar !== 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-normal mt-2"
                      >
                        <div className="text-gray-600 flex items-center gap-1">
                          <span className="font-medium">Only</span> $
                          {Math.round(plan.yearly_price_dollar)}
                          <span className="font-medium">/month</span>
                        </div>
                        <div className="text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Save $
                          {plan.monthly_price_dollar - plan.yearly_price_dollar}
                          /month
                          <span className="text-xs opacity-75">
                            (
                            {Math.round(
                              (plan.monthly_price_dollar -
                                plan.yearly_price_dollar) *
                                12
                            )}
                            /year)
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature._id}
                        className="flex items-start space-x-2"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {feature.feature_name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-4 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Plan Includes:
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#5B03B2]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className="font-medium">Team Members</span>
                      </div>
                      <span className="text-[#5B03B2] font-semibold">
                        {plan.number_of_collaborators.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#5B03B2]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">Monthly Responses</span>
                      </div>
                      <span className="text-[#5B03B2] font-semibold">
                        {plan.number_of_monthly_responses.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#5B03B2]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">User Accounts</span>
                      </div>
                      <span className="text-[#5B03B2] font-semibold capitalize">
                        {plan.number_of_accounts}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="block w-full bg-[#5B03B2] text-white text-center py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300 mt-8"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* <section className="bg-white text-black overflow-hidden">
        <PricingTable />
      </section> */}

      <section
        className="bg-white text-black overflow-hidden"
        data-aos="fade-up"
      >
        <NeedAssistance />
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
