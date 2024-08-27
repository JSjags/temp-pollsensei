import "./style.css";
import SurveyCard from "../../components/survey/SurveyCard";
import PaginationControls from "../../components/common/PaginationControls";
import FilterButton from "../../components/filter/FilterButton";
import Button from "../../components/common/Button";
import Image from "next/image";
import { useState } from "react";

import search from "../../assets/images/search.svg";
import { Milestone } from "lucide-react";
import Milestones from "@/components/survey/Milestones";

const SurveysPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const result = Array.from({ length: 6 }, (_, index) => `Item ${index}`);

  const currentResult = result?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(result.length / itemsPerPage);

  return (
    <div>
      <div className="bg-[url(/assets/milestones-bg.svg)] w-full h-[calc(100vh-150px)]">
        <div className="">
          <Milestones stage="2" />
        </div>
      </div>
      {/* <div className="container px-4 sm:px-6 lg:px-8 pb-20">
        <div className="my-6 sm:my-10">
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
            {currentResult.map((it) => (
              <SurveyCard key={it} />
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
      </div> */}
    </div>
  );
};

export default SurveysPage;
