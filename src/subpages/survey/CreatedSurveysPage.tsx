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

const CreatedSurveysPage = () => {
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useFetchSurveysQuery(currentPage);
  const router = useRouter();

  console.log(data);
  console.log(data?.data);
  console.log(data?.data?.data);

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
                <Button
                  label="Create new survey +"
                  onClick={() => {
                    router.push("/surveys/create-survey");
                  }}
                />
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
              <Button label="Create new survey +" />
            </div>
            <div className="block md:hidden">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
            {data &&
              data?.data?.data?.map((item: any, it: Key | null | undefined) => (
                <SurveyCard key={it} {...item} />
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
