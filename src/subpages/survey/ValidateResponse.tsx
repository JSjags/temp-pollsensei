import { replaceAnswers, resetAnswers } from "@/redux/slices/answer.slice";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CommentQuestion from "@/components/survey/CommentQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import PaginationBtn from "@/components/common/PaginationBtn";
import PreviewFile from "@/components/survey/PreviewFile";
import AnswerMultiChoiceQuestion from "@/components/survey/AnswerMuiltipleChoice";
import { toast } from "react-toastify";
import { useSubmitResponseMutation } from "@/services/survey.service";
import MediaQuestion from "@/components/survey/MediaQuestion";
import StarRatingQuestion from "@/components/survey/ValidateStarRattings";
import LikertScaleQuestion from "@/components/survey/ValidateLikertScale";
import NumberQuestion from "@/components/survey/NumberQuestion";
import DropdownQuestion from "@/components/survey/AnswerDropdownQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import BooleanQuestion from "@/components/survey/AnswerBoolean";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import CommentWithMediaQuestion from "@/components/survey/CommentWithMediaQuestion";


interface HeaderText {
  name: string;
  size: number;
}

interface Survey {
  creator: string;
  organization_id: string;
  survey_type: string;
  topic: string;
  description: string;
  status: string;
  theme: string;
  color_theme: string;
  logo_url: string;
  header_url: string;
  header_text: HeaderText;
  question_text: HeaderText;
  body_text: HeaderText;
  public_id: string;
  shorturl: string;
  generated_by: string;
  conversation_id: string;
}

interface ExtractedAnswer {
  question: string;
  question_type: string;
  description: string;
  is_required: boolean;
  options?: string[];
  selected_options?: string[];
  text?: string;
}

interface ResponseData {
  // data: {
    survey: Survey;
    extracted_answers: ExtractedAnswer[];
    uploaded_files: string[];
  // };
}


interface Answer {
  question: string;
  question_type: string;
  options: string[];
  selected_options: string[];
}



const ValidateResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const OCRresponses = useSelector(
    // @ts-ignore
    (state: RootState) => state.answer as any
  );
  const ocr = useSelector((state: RootState)=> state.answer)
  console.log(ocr)
  console.log(params.id);
  console.log(OCRresponses);
  const [currentSection, setCurrentSection] = useState(0);
  const [submitResponse, { data, isLoading, isSuccess, isError, error }] =
    useSubmitResponseMutation();
  const [respondent_name, setRespondent_name] = useState<string>("No provided");
  const [respondent_phone, setRespondent_phone] = useState("");
  const [respondent_country, setRespondent_country] = useState("");

  const [respondent_email, setRespondent_email] =
    useState<string>("example@gmail.com");

  const [ocrRes, setOcrRes] = useState<ResponseData | null>(null);


  console.log(OCRresponses);
  console.log(ocrRes);

  useEffect(()=>{
    if(OCRresponses as any){
      setOcrRes({
      survey: OCRresponses?.survey || [],
      extracted_answers: OCRresponses?.extracted_answers ||[],
      uploaded_files: OCRresponses?.uploaded_files || [],
      })
    }
  }, [OCRresponses])



  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        // @ts-ignore
        return prevIndex < OCRresponses[currentSection]?.survey?.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSubmitResponse = async () => {
    console.log("U clicked")
    // @ts-ignore
    const answers = (ocrRes as any)?.extracted_answers?.map((item: any) => {
        if (
          item.question_type === "multiple_choice" ||
          item.question_type === "checkbox" ||
          item.question_type === "single_choice"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            selected_options:
            item.selected_options && item.selected_options.length > 0
              ? item.selected_options
              : [item.options[0]], 
            // selected_options: item.selected_options || "No answer was provided",
          };
        } else if (
          item.question_type === "comment" ||
          item.question_type === "long_text" ||
          item.question_type === "short_text"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            text: item.text || "No answer was provided",
          };
        } else if (
          item.question_type === "likert_scale" ||
          item.question_type === "rating_scale" ||
          item.question_type === "star_rating"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            scale_value: item.scale_value.toString() || '2',
          };
        } else if (
          item.question_type === "drop_down_value"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            drop_down_value: item.drop_down_value || [item.options[0]],
          };
        } else if (
          item.question_type === "boolean_value"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            boolean_value: item.boolean_value,
          };
        }
        // return null;
      })
      .filter(Boolean);

    const responsePayload = {
      survey_id: params.id,
      respondent_name: respondent_name,
      respondent_phone: respondent_phone,
      respondent_country: respondent_country,
      respondent_email: respondent_email,
      answers: answers,
    };
    console.log(responsePayload);
    try {
      await submitResponse(responsePayload).unwrap();
      toast.success("Submitted successfully")
    } catch (e) {
      toast.error("Error submitting data: " + e)
      console.log(e);
    }
  };

  

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your response was saved successfully");
      router.push("/surveys/survey-list");
      dispatch(resetAnswers());
    }
    if (isError || error) {
      toast.error("An error occurred while submitting your response");
    }
  }, [isSuccess, isError, error, router]);

  // TODO: Check why the last option is not piked



  const handleUpdateSelectedOption = (index: number, selectedOption: string) => {
    if (!ocrRes) return;
  
    setOcrRes((prev) => {
      if (!prev) return null;
  
      const updatedAnswers = [...prev.extracted_answers]; // Clone the extracted_answers array
      const question = { ...updatedAnswers[index] }; // Clone the specific question at the index
  
      if (question.selected_options) {
        if (question.selected_options.includes(selectedOption)) {
          // Remove the option if it's already selected
          question.selected_options = question.selected_options.filter(
            (option) => option !== selectedOption
          );
        } else {
          // Add the selected option (Single or multi-choice logic)
          question.selected_options = [selectedOption];
        }
      } else {
        // If `selected_options` is undefined, initialize it
        question.selected_options = [selectedOption];
      }
  
      updatedAnswers[index] = question; // Replace the updated question in the array
  
      return {
        ...prev,
        extracted_answers: updatedAnswers, // Update the extracted_answers array
      };
    });
  };
  
  

  return (
    <div
      className={`${
        (ocrRes as any)?.survey?.theme
      } flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div
        className={`${
          (ocrRes as any)?.survey?.theme
        } flex justify-between gap-10 w-full`}
      >
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white flex items-center flex-col ">
            <Image
              src={(ocrRes as any)?.survey?.logo_url}
              alt=""
              className="w-full object-cover bg-no-repeat h-16 rounded-full"
              width={"100"}
              height={"200"}
            />
          </div>

          <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
            <Image
              src={(ocrRes as any)?.survey?.header_url}
              alt=""
              className="w-full object-cover bg-no-repeat h-24 rounded-lg"
              width={"100"}
              height={"200"}
            />
          </div>
          <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
            <h2
              className="text-[1.5rem] font-normal"
              style={{
                fontSize: `${
                  (ocrRes as any)?.survey?.header_text
                    ?.size
                }px`,
                fontFamily: `${
                  (ocrRes as any)?.survey?.header_text
                    ?.name
                }`,
              }}
            >
              {(ocrRes as any)?.survey?.topic}
            </h2>
            <p
              style={{
                fontSize: `${
                  (ocrRes as any)?.survey?.body_text?.size
                }px`,
                fontFamily: `${
                  (ocrRes as any)?.survey?.body_text?.name
                }`,
              }}
            >
              {(ocrRes as any)?.survey?.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4">
            {(ocrRes as any)?.survey?.settings
              ?.collect_email_addresses && (
              <div className="flex flex-col w-full">
                <label htmlFor="full name" className="pl-5">
                  Full name <sup className="text-red-700 text-sm">*</sup>
                </label>
                <input
                  type="text"
                  className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none "
                  required
                  onChange={(e) => setRespondent_name(e.target.value)}
                  value={respondent_name}
                />
              </div>
            )}
            {(ocrRes as any)?.survey?.settings
              ?.collect_name_of_respondents && (
              <div className="flex flex-col w-full">
                <label htmlFor="full name" className="pl-5">
                  Email <sup className="text-red-700 text-sm">*</sup>
                </label>
                <input
                  type="email"
                  className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none "
                  required
                  onChange={(e) => setRespondent_email(e.target.value)}
                  value={respondent_email}
                />
              </div>
            )}
          </div>

          {/* @ts-ignore */}
          { (ocrRes as any)?.extracted_answers?.map((item: any, index: number) => (
             <div key={index} className="mb-4">
             {
             item.question_type === "multiple_choice" ||
             item.question_type === "checkbox" ||
             item.question_type === "single_choice" ? (
               <AnswerMultiChoiceQuestion
                 key={index}
                 question={item.question}
                 options={item.options}
                 questionType={item.question_type}
                 selectedOptions={item.selected_options || [""]}
                 onChange={(selected) => {
                  handleUpdateSelectedOption(index, item.selected_options)
                 }}
                 index={index + 1}
                 status={item?.validation_result?.status}
               />
             ) : 
             item.question_type === "comment" ||
              item.question_type === "short_text"  ? (
               <CommentQuestion
                 key={index}
                 index={index + 1}
                 questionType={item.question_type}
                 question={item.question}
                 response={item.text}
                 status={item?.validation_result?.status}
                
               />
             ) :
                
              item.question_type === "number" ? (
              <CommentQuestion
                key={index}
                index={index + 1}
                questionType={item.question_type}
                question={item.question}
                response={item.num}
                status={item?.validation_result?.status}
               
              />
            ) 
             : item.question_type === "media"  ? (
             <MediaQuestion
               key={index}
               index={index + 1}
               questionType={item.question_type}
               question={item.question}
               response={item?.media?.text}
               status={item?.validation_result?.status}
               audio={item?.media?.url}
           
             />
           ) :
      
        
               item.question_type === "long_text" ? (
               <CommentWithMediaQuestion
                 key={index}
                 index={index + 1}
                 questionType={item.question_type}
                 question={item.question}
                 response={item?.media?.text || item.text }
                 mediaUrl={item?.media?.url}
                 status={item?.validation_result?.status}
                 audio={item?.media?.url}
              
               />
             )
              : item.question_type === "linear_Scale" ? (
               <LinearScaleQuestion
                 question={item.question}
                 scaleStart={item.scaleStart}
                 scaleEnd={item.scaleEnd}
                 questionType={item.question_type}
                
               />
             ) : item.question_type === "likert_scale" ? (
               <LikertScaleQuestion
                 question={item.question}
                 options={item.options}
                 questionType={item.question_type}
                 scale_value={item.scale_value}
               />
             )
              : item.question_type === "star_rating" ? (
               <StarRatingQuestion
                 question={item.question}
                 questionType={item.question_type}
                 scale_value={item.scale_value}
                 onRate={(value) => console.log("Rated:", value)}
               />
             ) 
             : item.question_type === "matrix_checkbox" ? (
               <MatrixQuestion
                 key={index}
                 index={index + 1}
                 rows={item.rows}
                 columns={item.columns}
                 questionType={item.question_type}
                 question={item.question}
               />
             ) : item.question_type === "short_text" ? (
               <ShortTextQuestion
                 key={index}
                 index={index + 1}
                 question={item.question}
                 questionType={item.question_type}
                 is_required={item.is_required}
               />
             ) : item.question_type === "boolean" ? (
               <BooleanQuestion
                 key={index}
                 index={index + 1}
                 question={item.question}
                 options={item.options}
                 boolean_value={item?.boolean_value}
                 questionType={item.question_type}
                status={item?.validation_result?.status}

               />
             )
            
              : item.question_type === "checkbox" ? (
               <CheckboxQuestion
                 key={index}
                 index={index + 1}
                 question={item.question}
                 options={item.options}
                 questionType={item.question_type}
                status={item?.validation_result?.status}

               />
             ) : item.question_type === "rating_scale" ? (
               <RatingScaleQuestion
                 key={index}
                 index={index + 1}
                 question={item.question}
                 options={item.options}
                 questionType={item.question_type}
               />
             )
              : item.question_type === "drop_down" ? (
               <DropdownQuestion
                 index={index + 1}
                 key={index}
                 question={item.question}
                 options={item.options}
                 questionType={item.question_type}
                 drop_down_value={item.drop_down_value}
                status={item?.validation_result?.status}

               />
             )
              : item.question_type === "number" ? (
               <NumberQuestion
                 key={index}
                 index={index + 1}
                 question={item.question}
                 questionType={item.question_type}
               />
             ) : null}
           </div>
          ))}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            <div className="flex gap-2 items-center"></div>
            {OCRresponses?.length > 1 && (
              <div className="flex w-full md:w-auto md:justify-end items-center">
                <PaginationBtn
                  currentSection={currentSection}
                  totalSections={OCRresponses.length}
                  onNavigate={navigatePage}
                />
              </div>
            )}
          </div>

          <div className=" rounded-md flex  items-center w-full md:min-w-[16rem] py-5 text-center">
        
            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
              // type="submit"
              onClick={() => {
                handleSubmitResponse()
             
              }}
            >
              {/* Submit Response */}
              {isLoading ? "Submitting..." : "Submit Response"}
            </button>
          </div>
          <div className="bg-[#5B03B21A] rounded-md flex flex-col justify-center items-center mb-10 py-5 text-center relative">
            <div className="flex flex-col">
              <p>Form created by</p>
              <Image src={pollsensei_new_logo} alt="Logo" />
            </div>
            <span className="absolute bottom-2 right-4 text-[#828282]">
              Remove watermark
            </span>
          </div>
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          <PreviewFile data={(ocrRes as any)?.uploaded_files} />
        </div>
      </div>
    </div>
  );
};

export default ValidateResponse;
