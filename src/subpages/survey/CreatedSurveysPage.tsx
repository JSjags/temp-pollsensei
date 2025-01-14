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
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const CreatedSurveysPage = () => {
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isFetching } = useFetchSurveysQuery(currentPage);
  const router = useRouter();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

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

  const SurveyCardSkeleton = () => (
    <div className="relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-[314px] bg-white">
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="mt-3 sm:mt-4">
        <Skeleton className="h-6 w-20 rounded-xl" />
      </div>

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>

      <div className="mt-6 sm:mt-[42px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );

  if (isLoading || isFetching) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
        <div className="md:flex my-10 items-center justify-between">
          <div className="flex gap-5 items-center">
            <h2 className="text-[#333333] font-[700] text-[24px]">
              Your Surveys
            </h2>
            <div className="hidden lg:flex items-center pl-4 gap-2 rounded-[8px] border-[1px] bg-white border-[#d9d9d9] w-[292px] h-[40px]">
              <Image src={search} alt="Search icon" width={20} height={20} />
              <input
                className="ring-0 text-[#838383] flex-1 outline-none"
                type="text"
                placeholder="Search surveys"
              />
            </div>
            <div className="hidden md:block">
              <FilterButton
                text="Add filter"
                buttonClassName="border-[#D9D9D9]"
              />
            </div>
          </div>
          <div className="hidden md:block mt-2 md:mt-0">
            {userRoles.includes("Admin") && (
              <Button
                label="Create new survey +"
                onClick={() => {
                  router.push("/surveys/create-survey");
                }}
                className="h-10 !bg-gradient-to-r !from-[#5B03B2] !to-[#9D50BB]"
              />
            )}
          </div>
          <div className="block md:hidden">
            <FilterButton text="Add filter" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SurveyCardSkeleton />
              </motion.div>
            ))}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-end">
          <PageControl
            currentPage={currentPage}
            totalPages={totalPages}
            onNavigate={navigatePage}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>
    );
  }

  if (!data?.data?.total || data.data.total === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 mt-0 sm:mt-0 sm:my-10">
        <div className="md:flex my-10 items-center justify-between">
          <div className="flex gap-5 items-center">
            <h2 className="text-[#333333] font-[700] text-xl">Your Surveys</h2>
            <div className="block md:hidden mt-2 md:mt-0">
              {userRoles.includes("Admin") && (
                <Button
                  label="Create new survey +"
                  onClick={() => {
                    router.push("/surveys/create-survey");
                  }}
                />
              )}
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
            {userRoles.includes("Admin") && (
              <Button
                label="Create new survey +"
                onClick={() => {
                  router.push("/surveys/create-survey");
                }}
              />
            )}
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
                capabilities to create your dream survey.
              </p>
            </div>
            <ShadButton
              className="auth-btn text-white px-8 !h-10 text-lg rounded-lg"
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
      {data?.data.total > 0 && (
        <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
          <div className="md:flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-[700] text-[24px]">
                Your Surveys
              </h2>
              <div className="block md:hidden mt-2 md:mt-0">
                {userRoles.includes("Admin") && (
                  <Button
                    label="Create new survey +"
                    onClick={() => {
                      router.push("/surveys/create-survey");
                    }}
                  />
                )}
              </div>
              <div className="hidden lg:flex items-center pl-4 gap-2 rounded-[8px] border-[1px] bg-white border-[#d9d9d9] w-[292px] h-[40px]">
                <Image src={search} alt="Search icon" width={20} height={20} />
                <input
                  className="ring-0 text-[#838383] flex-1 outline-none"
                  type="text"
                  placeholder="Search surveys"
                />
              </div>
              <div className="hidden md:block">
                <FilterButton
                  text="Add filter"
                  buttonClassName="border-[#D9D9D9]"
                />
              </div>
            </div>
            <div className="hidden md:block mt-2 md:mt-0">
              {userRoles.includes("Admin") && (
                <Button
                  label="Create new survey +"
                  onClick={() => {
                    router.push("/surveys/create-survey");
                  }}
                  className="h-10 !bg-gradient-to-r !from-[#5B03B2] !to-[#9D50BB]"
                />
              )}
            </div>
            <div className="block md:hidden">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
            {data?.data?.data?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SurveyCard {...item} />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-end">
            <PageControl
              currentPage={currentPage}
              totalPages={totalPages}
              onNavigate={navigatePage}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedSurveysPage;
