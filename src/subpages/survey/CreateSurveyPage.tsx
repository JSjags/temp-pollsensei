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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip } from "flowbite-react";
import {
  useCreateAiSurveyMutation,
  useGenerateTopicsMutation,
} from "@/services/survey.service";
import { toast } from "react-toastify";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import GeneratedSurvey from "./GeneratedSurvey";
import IsGenerating from "@/components/modals/IsGenerating";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addSection,
  resetSurvey,
  saveGeneratedBy,
  updateConversationId,
  updateDescription,
  updateSurveyType,
  updateTopic,
} from "@/redux/slices/survey.slice";
import store from "@/redux/store";
import Milestones from "@/components/survey/Milestones";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";
import { resetQuestion } from "@/redux/slices/questions.slice";

// Springy Animation Variants for the mascot
const mascotVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 0 }, // Start small and slightly off-screen
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring", // Springy effect
      stiffness: 300, // Controls the "bounciness"
      damping: 20, // Controls how fast the spring comes to rest
      duration: 0.8, // Duration of the animation
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 0, // Exit with downward movement
    transition: {
      duration: 0.3, // Slightly faster exit
    },
  },
};

const CreateSurveyPage = () => {
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState("");
  const [isSelected, setIsSelected] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [whatDoYouWant, setWhatDoYouWant] = useState(true);
  const [oneMoreThing, setOneMoreThing] = useState(false);
  const [promptForm, setPromptForm] = useState(false);
  const [isTopicModal, setIsTopicModal] = useState(false);
  const [manualTopic, setManualTopic] = useState("");
  const generated_by = useSelector(
    (state: RootState) => state.survey.generated_by
  );
  // const surveyData = useSelector((state:RootState)=>state.survey.sections)
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [surveyType, setSurveyType] = useState("");
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [createAiSurvey, { data, isLoading, isSuccess }] =
    useCreateAiSurveyMutation();
  const [
    generateTopics,
    {
      data: topics,
      isLoading: isLoadingTopics,
      isSuccess: isTopicSuccess,
      isError: isTpoicError,
      error: topicError,
    },
  ] = useGenerateTopicsMutation();
  const [generated, setGenerated] = useState(false);

  const handleDivClick = (userType: any) => {
    setSelectedDiv(userType);
  };

  const maxCharacters = 3000;
  console.log(data);

  const handleSurveyType = (userType: any, prompt: string) => {
    setSelectedDiv(userType);
    setSelectedSurveyType(prompt);
    setSurveyType(prompt);
  };

  const handlePathClick = () => {
    if (selectedDiv) {
      setWhatDoYouWant((prev) => !prev);
      setOneMoreThing((prev) => !prev);
    }
  };

  const handleGenerateTopics = async () => {
    try {
      await generateTopics({
        user_query: surveyPrompt,
      });
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };

  useEffect(() => {
    if (isTopicSuccess) {
      toast.success("Survey topic created successfully");
      setIsTopicModal((prev) => !prev);
      setPromptForm(!promptForm);
    }
    if (isTpoicError || topicError) {
      toast.error("Failed to generate survey topic");
    }
  }, [isTopicSuccess, isTpoicError, topicError]);

  const handleGenerateQuestion = async () => {
    console.log({
      user_query: surveyPrompt,
      survey_type: selectedSurveyType,
    });

    try {
      await createAiSurvey({
        user_query: surveyPrompt,
        survey_type: selectedSurveyType,
      });
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const refactoredQuestions = (data as any)?.data?.response?.map(
        (question: any) => {
          const optionType = question["Option type"]?.trim();
          if (optionType === "matrix_multiple_choice") {
            return {
              question: question.Question,
              rows: question.Options.Rows,
              columns: question.Options.Columns,
              question_type: optionType === null ? optionType : "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "long_text" || optionType === "short_text") {
            return {
              question: question.Question,
              options: "",
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "boolean") {
            return {
              question: question.Question,
              options: ["Yes", "No"],
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "number") {
            return {
              question: question.Question,
              options: "",
              min: 1,
              max: 10000000,
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "slider") {
            return {
              question: question.Question,
              options: "",
              min: question.Options.Min,
              max: question.Options.Max,
              step: question.Options.Step,
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          return {
            question: question.Question,
            options: question.Options,
            question_type: optionType || "",
            is_required: true,
            description: "",
          };
        }
      );
      dispatch(addSection({ questions: refactoredQuestions }));
      dispatch(updateConversationId((data as any)?.data?.conversation_id));
      dispatch(
        updateDescription((data as any)?.data?.description || surveyPrompt)
      );
      toast.success("Survey created successfully");
      setGenerated((prev) => !prev);
      setPromptForm(false);
    }
  }, [
    (data as any)?.data?.conversation_id,
    (data as any)?.data?.response,
    (data as any)?.data.topic,
    dispatch,
    isSuccess,
    surveyPrompt,
  ]);

  const UseAnotherPrompt = () => {
    setGenerated((prev) => !prev);
    setPromptForm(!promptForm);
  };

  const survey = store.getState().survey;
  console.log(survey);
  console.log(data);
  console.log(survey.sections);

  useEffect(() => {
    dispatch(resetQuestion());
    dispatch(resetSurvey());
  }, []);

  // // Update URL based on the state
  // const updateURLParams = (key: string, value: string | null) => {
  //   const params = new URLSearchParams(searchParams.toString());

  //   if (value) {
  //     params.set(key, value);
  //   } else {
  //     params.delete(key);
  //   }

  //   navigate.push(`${pathname}?${params.toString()}`);
  // };

  // // Effect to sync state to URL
  // useEffect(() => {
  //   if (whatDoYouWant) {
  //     updateURLParams("state", "what-do-you-want");
  //   } else if (!oneMoreThing && !promptForm && !isTopicModal) {
  //     updateURLParams("state", "what-do-you-want");
  //   }
  // }, [whatDoYouWant]);

  // useEffect(() => {
  //   if (oneMoreThing) {
  //     updateURLParams("state", "one-more-thing");
  //   } else if (!promptForm && !isTopicModal) {
  //     updateURLParams("state", null);
  //   }
  // }, [oneMoreThing]);

  // useEffect(() => {
  //   if (promptForm) {
  //     updateURLParams("state", "enter-your-prompt");
  //   } else if (!oneMoreThing && !isTopicModal) {
  //     updateURLParams("state", null);
  //   }
  // }, [promptForm]);

  // useEffect(() => {
  //   if (isTopicModal) {
  //     updateURLParams("state", "generate-topic");
  //   } else if (!oneMoreThing && !promptForm) {
  //     updateURLParams("state", null);
  //   }
  // }, [isTopicModal]);

  // // Effect to sync URL params back to state
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   const state = params.get("state");

  //   setWhatDoYouWant(state === "what-do-you-want");
  //   setOneMoreThing(state === "one-more-thing");
  //   setPromptForm(state === "enter-your-prompt");
  //   setIsTopicModal(state === "generate-topic");
  // }, [searchParams]);

  // Reset survey data when the page loads
  useEffect(() => {
    dispatch(resetSurvey());
  }, [dispatch]);

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
              onClick={() => {
                handleDivClick(1);
                dispatch(saveGeneratedBy("ai"));
              }}
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
              onClick={() => {
                handleDivClick(2);
                dispatch(saveGeneratedBy("manually"));
                setSurveyType("Both");
                dispatch(updateSurveyType("Both"));
              }}
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
                onClick={() => {
                  navigate.push("/surveys/create-manual");
                }}
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
              onClick={() => {
                handleSurveyType(3, "Qualitative");
              }}
            >
              <Image
                src={qualitative_survey}
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-lg">Qualitative Survey</h1>
              <p>
                Give us a prompt and our AI we will do the hard work{" "}
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
                  setSurveyType("Qualitative");
                  // dispatch(updateSurveyType("qualitative"))
                  dispatch(updateSurveyType(surveyType));
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  if (generated_by === "ai") {
                    setPromptForm(true);
                  } else {
                    navigate.push("/surveys/create-manual");
                  }
                }}
              >
                Proceed
              </button>
            </div>
            <div
              className={`flex flex-col items-center pb-4 justify-center gap-5 border rounded-md px-10 pt-10 text-center mt-4 md:mt-0 relative ${
                selectedDiv === 5 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleSurveyType(5, "Both")}
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
                  setSurveyType("Both");
                  // dispatch(updateSurveyType("Qualitative & Quantitative"))
                  dispatch(updateSurveyType(surveyType));
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  if (generated_by === "ai") {
                    setPromptForm(true);
                  } else {
                    navigate.push("/surveys/create-manual");
                  }
                }}
              >
                Proceed
              </button>
              <div className="bg-[#F70A0A] text-white py-2 absolute top-0 right-0 rounded-tr px-4 ">
                Not sure ?
              </div>
            </div>
            <div
              className={`flex flex-col items-center pb-4 justify-center gap-5 border rounded-md px-10 pt-10 text-center mt-4 md:mt-0 ${
                selectedDiv === 4 ? "border-[#CC9BFD] border-2" : ""
              }`}
              onClick={() => handleSurveyType(4, "Quantitative")}
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
                  setSurveyType("Quantitative");
                  // dispatch(updateSurveyType("quantitative"))
                  dispatch(updateSurveyType(surveyType));
                  setWhatDoYouWant(false);
                  setOneMoreThing(false);
                  if (generated_by === "ai") {
                    setPromptForm(true);
                  } else {
                    navigate.push("/surveys/create-manual");
                  }
                }}
              >
                Proceed
              </button>
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
              if (manualTopic.trim()) {
                dispatch(updateTopic(manualTopic));
              }
              handleGenerateTopics();
            }}
          >
            <label htmlFor="Your Prompt">Your Prompt</label>
            <div className="flex flex-col gap-2 relative">
              <textarea
                value={surveyPrompt}
                name=""
                id=""
                placeholder="Write your prompt"
                className="rounded-md py-2 px-3 border w-full h-36 border-[#BDBDBD]"
                style={{ border: "2px  solid #BDBDBD" }}
                onChange={(e) => {
                  if (e.target.value.length === 3000) {
                    toast.warning("Prompt shouldn't exceed 3000 characters");
                  }
                  setSurveyPrompt(e.target.value);
                }}
                maxLength={3000}
              ></textarea>
              <div className="text-sm text-gray-500 mt-1 absolute bottom-2 right-4">
                {surveyPrompt.length}/{maxCharacters} characters
              </div>
            </div>
            <button
              className="gradient-border gradient-text px-6 py-3 w-2/3 rounded-lg flex items-center space-x-2"
              disabled={!surveyPrompt ? true : false}
            >
              <span className={!surveyPrompt ? "text-gray-300" : ""}>
                Generate
              </span>
              <Image src={stars} alt="stars" className={``} />
            </button>
          </form>

          <div className="flex flex-col justify-center items-center gap-10 ">
            <div>
              <h1 className="text-lg mt-10">Try any of our sample prompts.</h1>
              <p className="text-sm">
                Select one of our pre-generated AI surveys.
              </p>
            </div>

            <div className={`md:flex justify-center gap-5 pb-4 items-center`}>
              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-start mt-4 md:mt-0`}
                onClick={() => {
                  setSurveyPrompt(
                    "I am working on a survey to evaluate student satisfaction within our school. This survey aims to gather feedback on various aspects of the educational experience, including course content, teaching quality, campus facilities, and extracurricular activities. Additionally, the survey seeks to identify areas where the school can improve and enhance the overall student experience. The target audience for this survey includes current students across different grades and departments. By capturing diverse perspectives, the survey aims to provide actionable insights that can help improve student satisfaction and academic success. The focus will be on understanding student needs and preferences to inform future decisions and initiatives aimed at enhancing the educational environment"
                  );
                  // setTimeout(()=>{
                  //   handleGenerateTopics()
                  // }, 2000)
                }}
              >
                <h1 className="text-lg text-start">
                  Student Satisfaction Survey
                </h1>

                <p className="text-start">
                  Assess learning experiences, teaching quality,{" "}
                  <br className="hidden lg:block" /> and academic support,
                  helping educational <br className="hidden lg:block" />{" "}
                  institutions improve student outcomes.
                </p>
              </div>

              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-center mt-4 md:mt-0 `}
                onClick={() => {
                  setSurveyPrompt(
                    "Our organisation is conducting a survey to evaluate employee engagement. This survey aims to collect feedback on various aspects of the workplace experience, including job satisfaction, work-life balance, management effectiveness, professional development opportunities, and organizational culture. Additionally, the survey seeks to identify areas where we can improve employee engagement and retention. The target audience includes all employees across different departments and levels within the organization. By capturing diverse perspectives, we aim to gather actionable insights that can inform future enhancements to our workplace policies, practices, and initiatives. The focus will be on understanding employee needs and motivations to foster a more engaged and productive workforce."
                  );
                  // setTimeout(()=>{
                  //   handleGenerateTopics()
                  // }, 2000)
                }}
              >
                <h1 className="text-lg text-start">
                  Employee Engagement Survey
                </h1>
                <p className="text-start">
                  Measure staff satisfaction, motivation, and{" "}
                  <br className="hidden lg:block" /> workplace culture, helping
                  organizations <br className="hidden lg:block" /> improve
                  internal dynamics.
                </p>
              </div>
              <div
                className={`flex flex-col items-center pb-4 justify-center gap-5 border border-[#CC9BFD] bg-[#FAFAFA] rounded-md px-10 pt-10 text-center mt-4 md:mt-0`}
                onClick={() => {
                  setSurveyPrompt(
                    "This survey aims to gather feedback across several key aspects, including event organisation, content quality, speaker impact, venue suitability, and overall attendee satisfaction. Additionally, the survey aims to pinpoint areas where improvements can be made and to gauge how well the event achieved its goals. Participants include all attendees of the event, including participants, speakers, sponsors, and exhibitors. By gathering insights from a diverse range of perspectives, the survey aims to provide actionable feedback to enhance future event planning and improve the overall attendee experience. Our goal is to better understand attendee preferences and needs to ensure that future events are even more successful and impactful."
                  );
                  // setTimeout(()=>{
                  //   handleGenerateTopics()
                  // }, 2000)
                }}
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
      {isTopicModal && (
        <IsLoadingModal openModal={isTopicModal} modalSize="lg">
          <div className="flex flex-col gap-3">
            <div className="text-center">
              <h2 className="text-lg font-normal ">
                Set Survey Topic and Continue
              </h2>
              <p className="text-sm">
                We have recommended suitable topic for your survey based on your
                entered prompt
              </p>
            </div>

            {topics &&
              (topics as any)?.data.topics.map(
                (topic: string[], index: number) => (
                  <div
                    className={`border ${
                      isSelected === index ? "border-2 border-red-500" : ""
                    } py-4 text-[#7A8699] border-[#CC9BFD] px-2 bg-[#FAFAFA] rounded-md `}
                    key={index}
                    onClick={(e) => {
                      // @ts-ignore
                      dispatch(updateTopic(e.target.innerHTML));
                      setIsSelected(index);
                    }}
                  >
                    {topic}
                  </div>
                )
              )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsTopicModal(false);
                handleGenerateQuestion();
              }}
              className="mt-5 flex flex-col gap-3"
            >
              <label htmlFor="manual-prompt">
                Manually Enter your preferred topic below:
              </label>
              <input
                value={manualTopic}
                onChange={(e) => setManualTopic(e.target.value)}
                type="text"
                placeholder="Input your survey topic"
                className="w-full px-3 py-3 border border-[#BDBDBD] rounded-md"
              />
              <button
                className="gradient-border gradient-text px-6 py-3 w-2/3 mx-auto rounded-md flex items-center space-x-2"
                disabled={!surveyPrompt && !surveyType ? true : false}
              >
                <span
                  className={
                    !surveyPrompt && !surveyType ? "text-gray-300" : ""
                  }
                >
                  {isLoading ? "Generating..." : "Generate Survey"}
                </span>
                <Image src={stars} alt="stars" className={``} />
              </button>
            </form>
          </div>
        </IsLoadingModal>
      )}
      {isLoadingTopics && (
        <IsGenerating
          isGeneratingSurveyLoading={isLoadingTopics}
          what="Topics"
        />
      )}
      {isLoading && (
        <IsGenerating isGeneratingSurveyLoading={isLoading} what="Questions" />
      )}
      {generated && (
        <>
          <GeneratedSurvey data={survey?.sections} onClick={UseAnotherPrompt} />
        </>
      )}
    </div>
  );
};

export default CreateSurveyPage;

// optionType === "Multi-choice"
//   ? "multiple_choice"
//   :
// optionType === "Dropdown"
// ? "drop_down"
// :
// optionType === "likert_scale"
// ? "likert_scale"
// :
// optionType === "Slider"
// ? "slider"
// :
// optionType === "Star Rating"
// ? "star_rating"
// :
// optionType === "Multiple Choice"
// ? "multiple_choice"
// :
// optionType === "Single Choice"
// ? "single_choice"
// :
// optionType === "Checkbox"
// ? "checkbox"
// :
// optionType === "Rating Scale"
// ? "rating_scale"
// :
// optionType === "Comment"
// ? "long_text"
// :
// optionType === "Boolean"
// ? "boolean"
// :
// optionType === "Matrix"
// ? "matrix_checkbox"
// : "matrix_checkbox"
// ,
