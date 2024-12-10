import { setName } from "@/redux/slices/name.slice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Select from "react-select";
import ThreeStepDropdown from "../filter/ThreeStepDropdown";


const customStyles = {
  control: (provided: any) => ({
    ...provided,
    paddingLeft: "1.3rem",
    border: "none",
    backgroundColor: "#fff",
    color: "#8A7575",
    outline: "none",
  }),
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

interface ResponseActionsProps {
  handleNext?: () => void;
  handlePrev?: () => void;
  setName?: () => void;
  deleteAResponse?: () => void;
  totalSurveys?: number;
  curerentSurvey?: number;
  respondent_data?:any[];
  valid_response?: number;
  invalid_response?: number; 
  surveyData?: any; 
}

const ResponseActions: React.FC<ResponseActionsProps> = ({
  totalSurveys,
  curerentSurvey,
  handleNext,
  handlePrev,
  respondent_data,
  valid_response,
  invalid_response,
  deleteAResponse,
  surveyData,
}) => {
  // const [name, setName ] = useState('')
  const name = useSelector((state:RootState)=>state?.name?.name)
  const dispatch = useDispatch()
  console.log(surveyData)

 
  return (
    <div className="flex flex-col justify-between items-center gap-4 rounded-lg p-4 bg-white">
      {/* Left Section: Navigation and Status */}
      <div className="lg:flex items-center justify-between w-full">
        <div className="text-gray-500">
          <button
            className="mr-3 text-gray-500 hover:text-gray-700"
            onClick={handlePrev}
          >
            &lt;
          </button>
          <span className="font-semibold">Response</span>{" "}
          <span>{curerentSurvey}</span> / <span>{totalSurveys}</span>
          <button
            className="ml-3 text-gray-500 hover:text-gray-700"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between space-x-4">
          <ThreeStepDropdown questions={surveyData?.answers}   />
       
          <Select
            className="select-container border-2 border-gray-300 text-gray-700 min-w-[15rem] rounded-md focus:outline-none"
            classNamePrefix="select-name"
            defaultValue={'Filter by name'}
            name="category"
            options={respondent_data &&
              respondent_data?.map((respondent, index) => ({
                value:respondent?.response_id,
                label:respondent?.name
              }
              ))}
            styles={customStyles}
            onChange={(selectedOption: any) => {
              dispatch(setName(selectedOption.label))
              console.log(selectedOption)
            }}
          />
        </div>
      </div>

      {/* Right Section: Filters and Actions */}
      <div className="lg:flex items-center justify-between w-full space-x-4">
        {/* Valid and Invalid Count */}
        <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Valid</span>
            <span className="bg-gray-200 text-gray-700 px-2 rounded-full">
              {valid_response}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600">Invalid</span>
            <span className="bg-gray-200 text-gray-700 px-2 rounded-full">
             {invalid_response}
            </span>
          </div>
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={deleteAResponse}>
          Delete response
        </button>
      </div>
    </div>
  );
};

export default ResponseActions;
