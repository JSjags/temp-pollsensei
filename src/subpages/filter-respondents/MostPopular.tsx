"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUser } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { PiHeartbeat } from "react-icons/pi";
import { BsSuitcase2 } from "react-icons/bs";
import { MdOutlineHomeWork } from "react-icons/md";
import PersonalInformation from "@/subpages/filter-respondents/PersonalInformation";
import Geo_Culture from "@/subpages/filter-respondents/Geo_Culture";
import Edu_Employment from "@/subpages/filter-respondents/Edu_Employment";
import Health_LifeStyle from "@/subpages/filter-respondents/Health_Lifestyle";
import Tech_Media from "@/subpages/filter-respondents/Tech_Media";
import Housing_Living from "@/subpages/filter-respondents/Housing_Living";
import Mobility_Travel from "@/subpages/filter-respondents/Mobility_Travel";
import Image from "next/image";
import marker from "@/assets/images/marker.svg";
import tech from "@/assets/images/tech.svg";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MostPopular = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria
  );

  const tabs = [
    {
      id: 1,
      name: "Personal Information",
      value: "personal",
      icon: (
        <FiUser className="text-xl data-[state=active]:text-[#5B03B2] text-[#898989]" />
      ),
      component: <PersonalInformation tab="personal" />,
    },
    {
      id: 2,
      name: "Geography & Culture",
      value: "geography",
      icon: (
        <Image
          src={marker}
          alt="marker"
          width={15}
          height={15}
          className={`${
            activeTab === "geography" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Geo_Culture tab="geography" />,
    },
    {
      id: 3,
      name: "Education & Employment",
      value: "employment",
      icon: (
        <LuGraduationCap
          className={`text-xl ${
            activeTab === "employment" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Edu_Employment tab="employment" />,
    },
    {
      id: 4,
      name: "Health & Lifestyle Markers",
      value: "health",
      icon: (
        <PiHeartbeat
          className={`text-xl ${
            activeTab === "employment" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Health_LifeStyle tab="health" />,
    },
    {
      id: 5,
      name: "Technology & Media Usage",
      value: "technology",
      icon: (
        <Image
          src={tech}
          alt="tech"
          width={20}
          height={20}
          className={`${
            activeTab === "technology" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Tech_Media tab="technology" />,
    },
    {
      id: 6,
      name: "Housing & Living Situations",
      value: "housing",
      icon: (
        <MdOutlineHomeWork
          className={`text-xl ${
            activeTab === "housing" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Housing_Living tab="housing" />,
    },
    {
      id: 7,
      name: "Mobility & Travel",
      value: "mobility",
      icon: (
        <BsSuitcase2
          className={`text-xl ${
            activeTab === "mobility" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Mobility_Travel tab="mobility" />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-5 relative">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full min-h-[80vh] overflow-y-auto flex items-start gap-5"
      >
        <TabsList className="hidden lg:flex flex-col gap-4 items-center justify-start w-[40%] min-h-[60vh] bg-[#F2F2F8] rounded-xl py-5 px-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab?.id}
              value={`${tab?.value}`}
              className="bg-transparent border-l-2 border-transparent data-[state=active]:border-[#5B03B2] data-[state=active]:bg-white data-[state=active]:shadow-sm shadow-black w-full flex items-center justify-between"
            >
              <div className="flex items-center justify-start gap-2">
                {Object.values(selectedCriteria[tab.value] || {}).some(
                  (section: any) => section.values.length > 0
                ) ? (
                  <IoMdCheckmarkCircle className="text-xl text-[#5B03B2]" />
                ) : (
                  <MdOutlineCircle className="text-xl text-[#5B03B2]" />
                )}
                <p className="text-sm text-[#4F5B67]"> {tab.name} </p>
              </div>
              <IoChevronForward className="text-xl text-[#8E8E93]" />
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab?.id}
            value={`${tab?.value}`}
            className="lg:bg-white lg:shadow-lg shadow-[#A9A7A72E] w-full h-full lg:h-auto m-0 rounded-xl lg:p-5 overflow-y-auto"
          >
            {tab?.component}
          </TabsContent>
        ))}
      </Tabs>

      {/******* MOBILE DROPDOWN */}

      <h1 className="block lg:hidden text-lg font-bold text-left mb-5">
        Filter Respondents
      </h1>

      <Accordion type="single" collapsible className="w-full">
        {tabs.map((tab) => (
          <AccordionItem value={tab?.value} key={tab.id}>
            <AccordionTrigger className="w-full h-auto block lg:hidden">
              <Button
                variant="outline"
                size="default"
                className="w-full flex items-center justify-start gap-2 active:outline-none bg-transparent border-0 border-b-0 border-[#898989] text-black text-sm"
              >
                {Object.values(selectedCriteria[tab.value] || {}).some(
                  (section: any) => section.values.length > 0
                ) ? (
                  <IoMdCheckmarkCircle className="text-lg text-[#5B03B2]" />
                ) : (
                  <MdOutlineCircle className="text-lg text-[#5B03B2]" />
                )}
                <span className="text-[#4F5B67]">{tab.name}</span>
              </Button>
            </AccordionTrigger>
            <AccordionContent className="shadow-lg shadow-[#A9A7A72E] w-full h-auto m-0 rounded-xl">
              {tab.component}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default MostPopular;
