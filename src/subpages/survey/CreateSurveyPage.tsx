"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  chatbot,
  qualitative_survey,
  quantitative_qualitative_survey,
  Quantitative_survey,
  stars,
  tooltip_icon,
  User_Setting,
} from "@/assets/images";
import { useRouter } from "next/navigation";
import { Tooltip } from "flowbite-react";
import { useCreateAiSurveyMutation } from "@/services/survey.service";
import { toast } from "react-toastify";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import GeneratedSurvey from "./GeneratedSurvey";

const CreateSurveyPage = () => {
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState("");
  const [whatDoYouWant, setWhatDoYouWant] = useState(true);
  const [oneMoreThing, setOneMoreThing] = useState(false);
  const [promptForm, setPromptForm] = useState(false);
  const navigate = useRouter();
  const [surveyType, setSurveyType] = useState("");
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [createAiSurvey, { data, isLoading, isSuccess }] =
    useCreateAiSurveyMutation();
  const [ generated, setGenerated ] = useState(false)

  const handleDivClick = (userType: any) => {
    setSelectedDiv(userType);
  };

  const handleSurveyType = (userType: any, prompt: string) => {
    setSelectedDiv(userType);
    setSelectedSurveyType(prompt);
  };

  const handlePathClick = () => {
    if (selectedDiv) {
      setWhatDoYouWant((prev) => !prev);
      setOneMoreThing((prev) => !prev);
    }
  };

  const handleGenerateQuestion = async () => {
    try {
      await createAiSurvey({
        user_query: surveyPrompt,
        survey_type: selectedSurveyType,
      });
      toast.success("Survey created successfully");
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // navigate.push(`/surveys`);
      setGenerated((prev)=>!prev);
      setPromptForm(!promptForm)
    }
  }, [isSuccess]);

const UseAnotherPrompt =() =>{
  setGenerated((prev)=>!prev);
  setPromptForm(!promptForm)
}

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-5 text-center">
      {whatDoYouWant && (
        <div className="flex flex-col justify-center items-center gap-10 ">
          <h1 className="text-2xl mt-10 md:mt-0">
            Hello, there! What do you want to do?
          </h1>

          <div className={`md:flex justify-center gap-5 items-center`}>
            <div
              className={`flex flex-col items-center pb-20 justify-center gap-5 border rounded-md px-10 pt-10 text-center ${
                selectedDiv === 1 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleDivClick(1)}
            >
              <Image src={chatbot} alt="Logo" className="h-8 w-auto" />
              <h1 className="text-lg">Generate with AI</h1>
              <p>
                Give us a prompt and our AI we will do the hard for{" "}
                <br className="hidden lg:block" /> you. We will create a survey
                tailored for your needs
              </p>
              <button
                className={`bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[16px] font-medium text-center font-inter justify-center ${
                  selectedDiv === 1 ? "visible" : "invisible"
                }`}
                type="button"
                onClick={handlePathClick}
              >
                Proceed
              </button>
            </div>
            <div
              className={`flex flex-col items-center pb-20 justify-center gap-5 border rounded-md px-10 pt-10 text-center mt-4 md:mt-0 ${
                selectedDiv === 2 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleDivClick(2)}
            >
              <Image src={User_Setting} alt="Logo" className="h-8 w-auto" />
              <h1 className="text-lg">Create Manually</h1>
              <p>
                Create your own survey on a blank canvas and{" "}
                <br className="hidden lg:block" /> customize it according to
                your taste.
              </p>

              <button
                className={`bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[1rem] font-medium text-center font-inter justify-center ${
                  selectedDiv === 2 ? "visible" : "invisible"
                }`}
                type="button"
                onClick={handlePathClick}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {oneMoreThing && (
        <div className="flex flex-col justify-center items-center gap-10 ">
          <div>
            <h1 className="text-2xl mt-10 md:mt-0">Okay! One more thing.</h1>
            <p className="text-lg">
              Tell us the type of survey you want to create
            </p>
          </div>

          <div className={`md:flex justify-center gap-5 items-center`}>
            <div
              className={`flex flex-col items-center pb-4 justify-center gap-5 border rounded-md px-10 pt-6 text-center ${
                selectedDiv === 3 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleSurveyType(3, "qualitative")}
            >
              <Image
                src={qualitative_survey}
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-lg">Qualitative Survey</h1>
              <p>
                Give us a prompt and our AI we will do the hard{" "}
                <br className="hidden lg:block" /> for you. We will create a
                survey tailored for your <br className="hidden lg:block" />{" "}
                needs
              </p>
              <Tooltip
                content={`Lorem ipsum dolor sit amet consectetur. Tempus duis viverra etiam sagittis scelerisque. Et cursus cursus sodales convallis amet. Vitae mattis quis tellus tortor quis sit. Sem nibh leo lorem mi.`}
                animation="duration-1000"
                style="light"
                className={`w-[20rem]`}
              >
                <Image
                  src={tooltip_icon}
                  alt="Logo"
                  className={`h-8 w-auto ${
                    selectedDiv === 3 ? "visible" : "invisible"
                  }`}
                />
              </Tooltip>

              <button
                className={`bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[16px] font-medium text-center font-inter justify-center ${
                  selectedDiv === 3 ? "visible" : "invisible"
                }`}
                type="button"
                onClick={() => {
                  setSurveyType("qualitative");
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  setPromptForm(true);
                }}
              >
                Proceed
              </button>
            </div>
            <div
              className={`flex flex-col items-center pb-4 justify-center gap-5 border rounded-md px-10 pt-10 text-center mt-4 md:mt-0 ${
                selectedDiv === 4 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleSurveyType(4, "quantitative")}
            >
              <Image
                src={Quantitative_survey}
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-lg">Quantitative Survey</h1>
              <p>
                Create your own survey on a blank canvas and{" "}
                <br className="hidden lg:block" /> customize it according to
                your taste.
              </p>
              <Tooltip
                content={`Lorem ipsum dolor sit amet consectetur. Tempus duis viverra etiam sagittis scelerisque. Et cursus cursus sodales convallis amet. Vitae mattis quis tellus tortor quis sit. Sem nibh leo lorem mi.`}
                animation="duration-1000"
                style="light"
                className={`w-[20rem]`}
              >
                <Image
                  src={tooltip_icon}
                  alt="Logo"
                  className={`h-8 w-auto ${
                    selectedDiv === 4 ? "visible" : "invisible"
                  }`}
                />
              </Tooltip>
              <button
                className={`bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[1rem] font-medium text-center font-inter justify-center ${
                  selectedDiv === 4 ? "visible" : "invisible"
                }`}
                type="button"
                onClick={() => {
                  setSurveyType("quantitative");
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  setPromptForm(true);
                }}
              >
                Proceed
              </button>
            </div>
            <div
              className={`flex flex-col items-center pb-4 justify-center gap-5 border rounded-md px-10 pt-10 text-center mt-4 md:mt-0 relative ${
                selectedDiv === 5 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleSurveyType(5, "Qualitative & Quantitative")}
            >
              <Image
                src={quantitative_qualitative_survey}
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-lg">Both (Qualitative & Quantitative)</h1>
              <p>
                Create your own survey on a blank canvas and{" "}
                <br className="hidden lg:block" /> customize it according to
                your taste.
              </p>
              <Tooltip
                content={`Lorem ipsum dolor sit amet consectetur. Tempus duis viverra etiam sagittis scelerisque. Et cursus cursus sodales convallis amet. Vitae mattis quis tellus tortor quis sit. Sem nibh leo lorem mi.`}
                animation="duration-1000"
                style="light"
                className={`w-[20rem]`}
              >
                <Image
                  src={tooltip_icon}
                  alt="Logo"
                  className={`h-8 w-auto ${
                    selectedDiv === 5 ? "visible" : "invisible"
                  }`}
                />
              </Tooltip>

              <button
                className={`bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[1rem] font-medium text-center font-inter justify-center ${
                  selectedDiv === 5 ? "visible" : "invisible"
                }`}
                type="button"
                onClick={() => {
                  setSurveyType("Qualitative & Quantitative");
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  setPromptForm(true);
                }}
              >
                Proceed
              </button>
              <div className="bg-[#F70A0A] text-white py-2 absolute top-0 right-0 rounded-tr px-4 ">
                Most Preferred
              </div>
            </div>
          </div>
        </div>
      )}
      {promptForm && (
        <div className="flex flex-col justify-center items-center gap-10 ">
          <div>
            <h1 className="text-2xl mt-10 md:mt-10 font-normal">
              Write a prompt. we’ll do the rest for you
            </h1>
            <p className="text-lg">
              Tell us the survey you want to make? We will create it for you
            </p>
          </div>

          <form
            className={`flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 text-start justify-start gap-2`}
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateQuestion();
            }}
          >
            {/* <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Enter Title of Survey here"
              className="rounded-md px-3 py-2 border w-full border-[#BDBDBD]"
              style={{ border: "2px  solid #BDBDBD" }}
            /> */}
            <label htmlFor="Your Prompt">Your Prompt</label>
            <textarea
              value={surveyPrompt}
              name=""
              id=""
              placeholder="Write your prompt"
              className="rounded-md px-3 border w-full h-36 border-[#BDBDBD]"
              style={{ border: "2px  solid #BDBDBD" }}
              onChange={(e) => setSurveyPrompt(e.target.value)}
            ></textarea>
            <button
              className="gradient-border gradient-text px-6 py-3 w-1/3 rounded-lg flex items-center space-x-2"
              disabled={!surveyPrompt && !surveyType ? true : false}
            >
              <span
                className={!surveyPrompt && !surveyType ? "text-gray-300" : ""}
              >
                Generate
              </span>
              <Image src={stars} alt="stars" className={``} />
            </button>
          </form>

          <div className="flex flex-col justify-center items-center gap-10 ">
            <div>
              <h1 className="text-lg mt-10">Try any of our Sample prompts.</h1>
              <p className="text-sm">
                Select one of our Pre-generated AI surveys
              </p>
            </div>

            <div className={`md:flex justify-center gap-5 pb-4 items-center`}>
              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-start mt-4 md:mt-0`}
              >
                <h1 className="text-lg text-start">Student Satisfaction Survey</h1>

                <p className="text-start">
                  Assess learning experiences, teaching quality,{" "}
                  <br className="hidden lg:block" /> and academic support,
                  helping educational <br className="hidden lg:block" />{" "}
                  institutions improve student outcomes.
                </p>
              </div>

              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-center mt-4 md:mt-0 `}
              >
                <h1 className="text-lg text-start">Employee Engagement Survey</h1>
                <p className="text-start">
                  Measure staff satisfaction, motivation, and{" "}
                  <br className="hidden lg:block" /> workplace culture, helping
                  organizations <br className="hidden lg:block" /> improve
                  internal dynamics.
                </p>
              </div>
              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-center mt-4 md:mt-0`}
              >
                <h1 className="text-lg text-start">Event Feedback Survey</h1>
                <p className="text-start">
                  Evaluate the success of events, conferences, or{" "}
                  <br className="hidden lg:block" /> meetings, gathering input
                  on content, <br className="hidden lg:block" /> organization,
                  and overall experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <IsLoadingModal openModal={isLoading} modalSize={"lg"}>
          <div className="flex flex-col text-center gap-2">
            <Image src={stars} alt="stars" className={`h-8 w-auto animate-spin-slow`} />
            <h2 className="text-lg">Generating Questions for you</h2>
            <p className="text-sm">Hold on while we do the hard work for you.</p>
          </div>
        </IsLoadingModal>
      )}

      {
        generated && <GeneratedSurvey data={data} onClick={UseAnotherPrompt} />
      }
    </div>
  );
};

export default CreateSurveyPage;
