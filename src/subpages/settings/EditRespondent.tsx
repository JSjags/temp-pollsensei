"use client";
import { useState, useEffect } from "react";
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
import { getInitialValuesFromSchema } from "@/utils/respondentUtils";
import { combinedSchema, CombinedFormData } from "@/utils/combinedSchema";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetRespondentData } from "@/services/api/apiRequest";
import { APP_KEYS } from "@/constants";

const EditRespondent = () => {
  const [activeTab, setActiveTab] = useState("educationEmployment");
  const initialFormData = getInitialValuesFromSchema(combinedSchema);

  const [formData, setFormData] = useState<CombinedFormData>(initialFormData);

  const tabs = [
    {
      id: 1,
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
      component: (
        <Edu_Employment
          onContinue={() => setActiveTab("healthLifestyle")}
          onPrevious={() => setActiveTab("geographicInfo")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: 2,
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
      component: (
        <Health_LifeStyle
          onContinue={() => setActiveTab("technologyMedia")}
          onPrevious={() => setActiveTab("educationEmployment")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: 3,
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
      component: (
        <Tech_Media
          onContinue={() => setActiveTab("housingLiving")}
          onPrevious={() => setActiveTab("healthLifestyle")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: 4,
      name: "Housing & Living Situations",
      value: "housingLiving",
      icon: (
        <MdOutlineHomeWork
          className={`text-xl ${
            activeTab === "housingLiving" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: (
        <Housing_Living
          onContinue={() => setActiveTab("mobilityTravel")}
          onPrevious={() => setActiveTab("technologyMedia")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: 5,
      name: "Mobility & Travel",
      value: "mobilityTravel",
      icon: (
        <BsSuitcase2
          className={`text-xl ${
            activeTab === "mobilityTravel" ? "text-[#5B03B2]" : "text-[#898989]"
          }`}
        />
      ),
      component: (
        <Mobility_Travel
          onContinue={() => setActiveTab("identityVerification")}
          onPrevious={() => setActiveTab("housingLiving")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
  ];

  const userAccessToken = useSelector(
    (state: RootState) => state.user.access_token
  );

  const { data: respondentData, isLoading } = useQuery({
    queryKey: [...[APP_KEYS.RESPONDENT_DATA], userAccessToken, activeTab],
    queryFn: () => GetRespondentData(userAccessToken, activeTab),
    enabled: !!userAccessToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (respondentData?.data?.sectionData) {
      const newFormData = {
        ...initialFormData,
        ...respondentData.data.sectionData,
      };
      if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
        setFormData(newFormData);
      }
    } else {
      setFormData(initialFormData);
    }
  }, [respondentData, initialFormData, isLoading, formData]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(newTab) => {
        setActiveTab(newTab);
      }}
      className="w-full h-auto flex gap-5 items-start p-2"
    >
      <TabsList className="hidden lg:flex flex-col gap-4 items-center justify-start w-[40%] h-full bg-[#F2F2F8] rounded-xl py-5 px-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab?.id}
            value={`${tab?.value}`}
            className="bg-transparent data-[state=active]:border-l-2 border-[#5B03B2] data-[state=active]:bg-white data-[state=active]:shadow-sm shadow-black w-full flex items-center justify-start gap-2"
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
          className="lg:bg-white lg:shadow-lg shadow-[#A9A7A72E] w-full h-full lg:h-[85vh] m-0 rounded-xl lg:p-3 overflow-y-auto"
        >
          {tab?.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default EditRespondent;
