import PaginationControls from '@/components/common/PaginationControls'
import SurveyCard from '@/components/survey/SurveyCard'
import { Key, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/common/Button";
// import { Button as ShadButton } from "@/components/ui/button";
import { useFetchSurveysQuery } from "@/services/survey.service";
import Image from "next/image";
import FilterButton from '@/components/filter/FilterButton';
import search from "../../assets/images/search.svg";




const CreatedSurveysPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useFetchSurveysQuery(currentPage);

  console.log(data);
  console.log(data?.data);
  console.log(data?.data?.data);

  // const result = Array.from({ length: 6 }, (_, index) => `Item ${index}`);

  const totalPages = data?.data.total;
  return (
    <div>
      {/* Created survey page */}
        {data?.data.total > 0 && !isLoading && (
        <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
          <div className="md:flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-[700] text-[24px]">
                Your Surveys
              </h2>
              <div className="block md:hidden mt-2 md:mt-0">
                <Button label="Create new survey +" />
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
            {data && data?.data?.data?.map((item:any, it: Key | null | undefined) => (
            <SurveyCard key={it} {...item}  />
          ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setItemsPerPage={setItemsPerPage}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatedSurveysPage
