import SurveyCard from "@/components/survey/SurveyCard";
import { Key, useState } from "react";
import Button from "@/components/common/Button";
import { useFetchSurveysQuery } from "@/services/survey.service";
import Image from "next/image";
import FilterButton from "@/components/filter/FilterButton";
import search from "../../assets/images/search.svg";
import { useRouter } from "next/navigation";
import PaginationBtn from "@/components/common/PaginationBtn";
import PageControl from "@/components/common/PageControl";
import { Button as ShadButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CreatedSurveysPage = () => {
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useFetchSurveysQuery(currentPage);
  const router = useRouter();
  const userRoles = useSelector((state: RootState) => state.user.user?.roles[0].role || []);


  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  if (!isLoading && (!data?.data?.total || data.data.total === 0)) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
        <div className="md:flex my-10 items-center justify-between">
          <div className="flex gap-5 items-center">
            <h2 className="text-[#333333] font-[700] text-[24px]">
              Your Surveys
            </h2>
            <div className="block md:hidden mt-2 md:mt-0">
              {
              userRoles.includes("Admin") && 
              <Button
                label="Create new survey +"
                onClick={() => {
                  router.push("/surveys/create-survey");
                }}
              />
              }
            </div>
            <div className="hidden lg:flex items-center pl-4 gap-2 rounded-[8px] border-[1px] px- border-[#d9d9d9] w-[292px] h-[40px]">
              <Image src={search} alt="Search icon" width={20} height={20} />
              <input
                className="ring-0 text-[#838383] flex-1 outline-none"
                type="text"
                placeholder="Search surveys"
              />
            </div>
            <div className="hidden md:block">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="hidden md:block mt-2 md:mt-0">
            {
              userRoles.includes("Admin") && 
              <Button
                label="Create new survey +"
                onClick={() => {
                  router.push("/surveys/create-survey");
                }}
              />

            }
          </div>
          <div className="block md:hidden">
            <FilterButton text="Add filter" />
          </div>
        </div>
        <Card className="w-full max-w-3xl mx-auto mt-[10vh] border-none shadow-none">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-8">
            <div className="relative w-full max-w-[320px] aspect-square">
              <Image
                src="/assets/survey-list/no-survey.svg"
                alt="Illustration of a person with laboratory flasks and a rocket"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2 max-w-[600px]">
              <p className="text-lg sm:text-xl text-muted-foreground">
                You have not created any Survey yet. Think on how to start? We
                can help you do the difficult part using our generative-AI
                capabilities to create your dream survey= .
              </p>
            </div>
            <ShadButton
              className="auth-btn text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => router.push("/surveys/create-survey")}
            >
              Create Survey
            </ShadButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {data?.data.total > 0 && !isLoading && (
        <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
          <div className="md:flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-[700] text-[24px]">
                Your Surveys
              </h2>
              <div className="block md:hidden mt-2 md:mt-0">
              { 
              userRoles.includes("Admin") && 
               <Button
                  label="Create new survey +"
                  onClick={() => {
                    router.push("/surveys/create-survey");
                  }}
                />}
              </div>
              <div className="hidden lg:flex items-center pl-4 gap-2 rounded-[8px] border-[1px] px- border-[#d9d9d9] w-[292px] h-[40px]">
                <Image src={search} alt="Search icon" width={20} height={20} />
                <input
                  className="ring-0 text-[#838383] flex-1 outline-none"
                  type="text"
                  placeholder="Search surveys"
                />
              </div>
              <div className="hidden md:block">
                <FilterButton text="Add filter" />
              </div>
            </div>
            <div className="hidden md:block mt-2 md:mt-0">
           { 
              userRoles.includes("Admin") && 
             <Button
                label="Create new survey +"
                onClick={() => {
                  router.push("/surveys/create-survey");
                }}
              />}
            </div>
            <div className="block md:hidden">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
            {data &&
              data?.data?.data?.map((item: any, it: Key | null | number | undefined) => (
                <SurveyCard key={it} {...item} index={it} />
              ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-end">
            <PageControl
              currentPage={currentPage}
              totalPages={totalPages}
              onNavigate={navigatePage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedSurveysPage;
