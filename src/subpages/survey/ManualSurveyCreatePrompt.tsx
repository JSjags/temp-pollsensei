import { stars } from "@/assets/images";
import { updateDescription, updateTopic } from "@/redux/slices/survey.slice";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { Button as ShadButton } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const ManualSurveyCreatePrompt = () => {
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [manualSurveyTitle, setManualSurveyTitle] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const maxCharacters = 3000;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1, y: 100 }}
        transition={{
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        className="p-0 m-0 bg-transparent rounded-lg shadow-lg"
      >
        <div className="flex flex-col justify-center items-center gap-10 py-10 min-h-[80vh] ">
          <div className="text-center">
            <h1 className="text-2xl mt-10 md:mt-10 font-normal">
              What’s your survey about?
            </h1>
            <p className="text-lg">
              Provide a suitable title and description for the survey you want
              to create
            </p>
          </div>

          <form
            className={`flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 text-start justify-start gap-2`}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="">
              Title
              <input
                type="text"
                className="rounded-md py-2 px-3 border-[#BDBDBD] border w-full"
                placeholder="Enter Title of Survey here"
                style={{ border: "2px  solid #BDBDBD" }}
                value={manualSurveyTitle}
                onChange={(e) => {
                  setManualSurveyTitle(e.target.value);
                }}
              />
            </label>
            <label htmlFor="Your Prompt">Survey Summary</label>
            <div className="flex flex-col gap-2 relative">
              <textarea
                value={surveyPrompt}
                name=""
                id=""
                placeholder="Provide a brief description of the survey"
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
            {/* <button
            className="gradient-border gradient-text px-6 py-3 w-1/3 rounded-lg flex items-center space-x-2"
            disabled={!surveyPrompt ? true : false}
          >
            <span
              className={!surveyPrompt ? "text-gray-300" : ""}
            >
              Continue
            </span>
            <Image src={stars} alt="stars" className={``} />
          </button> */}
            <ShadButton
              disabled={!surveyPrompt && !manualSurveyTitle ? true : false}
              className="auth-btn"
              onClick={() => {
                dispatch(updateTopic(manualSurveyTitle));
                dispatch(updateDescription(surveyPrompt));
                router.push("/surveys/add-question-m");
              }}
            >
              Continue{" "}
            </ShadButton>
          </form>

          {/* <div className="flex flex-col justify-center items-center gap-10 ">
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
        </div> */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManualSurveyCreatePrompt;
