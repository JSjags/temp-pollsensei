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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const GeneralTab = () => {
  const [activeTab, setActiveTab] = useState<string>("personalInfo");
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria
  );

  const tabs = [
    {
      id: 1,
      name: "Personal Information",
      value: "personalInfo",
      icon: (
        <FiUser
          className={`text-xl ${
            activeTab === "personalInfo" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <PersonalInformation tab="personalInfo" />,
    },
    {
      id: 2,
      name: "Geography & Culture",
      value: "geographicInfo",
      icon: (
        <Image
          src={marker}
          alt="marker"
          width={15}
          height={15}
          className={`${
            activeTab === "geographicInfo" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Geo_Culture tab="geographicInfo" />,
    },
    {
      id: 3,
      name: "Education & Employment",
      value: "educationEmployment",
      icon: (
        <LuGraduationCap
          className={`text-xl ${
            activeTab === "educationEmployment"
              ? "text-[#5B03B2]"
              : "text-[#898989]"
          }`}
        />
      ),
      component: <Edu_Employment tab="educationEmployment" />,
    },
    {
      id: 4,
      name: "Health & Lifestyle Markers",
      value: "healthLifestyle",
      icon: (
        <PiHeartbeat
          className={`text-xl ${
            activeTab === "healthLifestyle"
              ? "text-[#5B03B2]"
              : "text-[#898989]"
          }`}
        />
      ),
      component: <Health_LifeStyle tab="healthLifestyle" />,
    },
    {
      id: 5,
      name: "Technology & Media Usage",
      value: "technologyMedia",
      icon: (
        <Image
          src={tech}
          alt="tech"
          width={20}
          height={20}
          className={`${
            activeTab === "technologyMedia"
              ? "text-[#5B03B2]"
              : "text-[#898989]"
          }`}
        />
      ),
      component: <Tech_Media tab="technologyMedia" />,
    },
    {
      id: 6,
      name: "Housing & Living Situations",
      value: "housingLiving",
      icon: (
        <MdOutlineHomeWork
          className={`text-xl ${
            activeTab === "housingLiving" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Housing_Living tab="housingLiving" />,
    },
    {
      id: 7,
      name: "Mobility & Travel",
      value: "mobilityTravel",
      icon: (
        <BsSuitcase2
          className={`text-xl ${
            activeTab === "mobilityTravel" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: <Mobility_Travel tab="mobilityTravel" />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full min-h-[80vh] overflow-y-auto hidden lg:flex items-start gap-5"
      >
        <TabsList className="flex flex-col gap-4 items-center justify-start w-[40%] min-h-[60vh] bg-[#F2F2F8] rounded-xl py-5 px-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={`${tab.value}`}
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
        <div className="relative w-full">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={`${tab.value}`}
              forceMount
              className={`lg:bg-white lg:shadow-lg shadow-[#A9A7A72E] w-full h-full lg:h-auto m-0 rounded-xl lg:p-5 overflow-y-auto absolute top-0 left-0 ${
                activeTab === tab.value ? "block" : "hidden"
              }`}
            >
              {React.cloneElement(tab.component, { tab: activeTab })}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <h1 className="block lg:hidden text-lg font-bold text-left mb-5">
        Filter Respondents
      </h1>

      <Accordion type="single" collapsible className="w-full">
        {tabs.map((tab) => (
          <AccordionItem value={tab.value} key={tab.id}>
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
export default GeneralTab;
