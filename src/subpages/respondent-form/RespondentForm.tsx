"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUser } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { PiHeartbeat } from "react-icons/pi";
import { PiUserList } from "react-icons/pi";
import { BsSuitcase2 } from "react-icons/bs";
import { MdOutlineHomeWork } from "react-icons/md";
import PersonalInformation from "@/subpages/respondent-form/PersonalInformation";
import Geo_Culture from "@/subpages/respondent-form/Geo_Culture";
import Edu_Employment from "@/subpages/respondent-form/Edu_Employment";
import Health_LifeStyle from "@/subpages/respondent-form/Health_Lifestyle";
import Tech_Media from "@/subpages/respondent-form/Tech_Media";
import Housing_Living from "@/subpages/respondent-form/Housing_Living";
import Mobility_Travel from "@/subpages/respondent-form/Mobility_Travel";
import IdentityVerification from "@/subpages/respondent-form/IdentityVerification";
import Image from "next/image";
import marker from "@/assets/images/marker.svg";
import tech from "@/assets/images/tech.svg";

const RespondentForm = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    {
      id: 1,
      name: "Personal Information",
      value: "personal",
      icon: (
        <FiUser
          className={`text-xl ${
            activeTab === "personal" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: (
        <PersonalInformation onContinue={() => setActiveTab("geography")} />
      ),
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
      component: (
        <Geo_Culture
          onContinue={() => setActiveTab("employment")}
          onPrevious={() => setActiveTab("personal")}
        />
      ),
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
      component: (
        <Edu_Employment
          onContinue={() => setActiveTab("health")}
          onPrevious={() => setActiveTab("geography")}
        />
      ),
    },
    {
      id: 4,
      name: "Health & Lifestyle Markers",
      value: "health",
      icon: (
        <PiHeartbeat
          className={`text-xl ${
            activeTab === "health" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: (
        <Health_LifeStyle
          onContinue={() => setActiveTab("technology")}
          onPrevious={() => setActiveTab("employment")}
        />
      ),
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
      component: (
        <Tech_Media
          onContinue={() => setActiveTab("housing")}
          onPrevious={() => setActiveTab("health")}
        />
      ),
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
      component: (
        <Housing_Living
          onContinue={() => setActiveTab("mobility")}
          onPrevious={() => setActiveTab("technology")}
        />
      ),
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
      component: (
        <Mobility_Travel
          onContinue={() => setActiveTab("identity")}
          onPrevious={() => setActiveTab("housing")}
        />
      ),
    },
    {
      id: 8,
      name: "Identity Verification",
      value: "identity",
      icon: (
        <PiUserList
          className={`text-xl ${
            activeTab === "identity" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: (
        <IdentityVerification onPrevious={() => setActiveTab("mobility")} />
      ),
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-auto flex gap-5 items-start"
    >
      <TabsList className="hidden lg:flex flex-col gap-4 items-center justify-start w-[40%] h-full bg-[#F2F2F8] rounded-xl py-5 px-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab?.id}
            value={`${tab?.value}`}
            className="bg-transparent data-[state=active]:border-l-2 border-[#5B03B2] data-[state=active]:bg-white data-[state=active]:shadow-sm shadow-black w-full flex items-center justify-start gap-2"
            disabled={activeTab !== tab?.value}
          >
            {tab?.icon}
            <p className="text-sm text-[#4F5B67]"> {tab.name} </p>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab?.id}
          value={`${tab?.value}`}
          className="lg:bg-white lg:shadow-lg shadow-[#A9A7A72E] w-full h-full lg:h-[85vh] m-0 rounded-xl lg:p-5 overflow-y-auto"
        >
          {tab?.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default RespondentForm;
