"use client"


import Image from "next/image";
import { no_survey_state } from "../../assets/images";
import { useRouter } from "next/navigation";


const SurveyEmptyPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-5 my-6 ">
      <Image src={no_survey_state} alt="Search icon" />
      <h1 className="text-3xl text-center">Welcome to PollSensei.ai</h1>
      <p className="text-center ">You have not created any Survey yet. Create a new survey to start <br /> your journey to creating a seamless end-to-end survey</p>
      <button
        className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
        type="button"
        onClick={()=>router.push('/surveys/create-survey')}
      >
        Create Survey
      </button>
    </div>
  )
}

export default SurveyEmptyPage
