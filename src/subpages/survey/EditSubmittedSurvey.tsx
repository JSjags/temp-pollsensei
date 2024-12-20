import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";

// import MultiChoiceQuestionEdit from "../milestone/Test";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import {
  useEditSurveyMutation,
  useFetchASurveyQuery,
} from "@/services/survey.service";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import CommentQuestion from "@/components/survey/CommentQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import BooleanQuestion from "@/components/survey/BooleanQuestion";
import SliderQuestion from "@/components/survey/SliderQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import { toast } from "react-toastify";


interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  is_required?: boolean;
}

interface Section {
  questions: Question[];
}

interface SurveyData {
  topic: string;
  description: string;
  sections: Section[];
  theme: string;
  header_text: { name: string; size: number };
  question_text: { name: string; size: number };
  body_text: { name: string; size: number };
  color_theme: string;
  logo_url: string;
  header_url: string;
}

const EditSubmittedSurvey = () => {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useFetchASurveyQuery(params.id);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditHeader, setIsEditHeader] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSurvey, { isSuccess, isError, error, isLoading:isEditLoading }] = useEditSurveyMutation();
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  console.log(data);
  console.log(params.id);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    topic: "",
    description: "",
    sections: [],
    theme: "",
    header_text: { name: "", size: 18 },
    question_text: { name: "", size: 14 },
    body_text: { name: "", size: 12 },
    color_theme: "#ffffff",
    logo_url: "#ffffff",
    header_url: "#ffffff",
  });

  const questions = surveyData?.sections;
  console.log(questions);
  console.log(surveyData);

  const EditQuestion = (index: any) => {
    setEditIndex(index);
    setIsEdit(true);
    // setIsSidebarOpen(false);
    // setAiChatbot(true);
    console.log(index);
    // setSelectIndex(index);
  };

  // const handleDeleteQuestion = (questionIndex: number) => {
  //   setSurveyData((prevData) => {
  //     // Clone sections
  //     const updatedSections = [...prevData.sections];
  
  //     // Check if currentSection and questionIndex are valid
  //     const currentQuestions =
  //       updatedSections[currentSection]?.questions || [];
  
  //     if (
  //       Array.isArray(currentQuestions) &&
  //       questionIndex >= 0 &&
  //       questionIndex < currentQuestions.length
  //     ) {
  //       // Remove the question
  //       updatedSections[currentSection].questions = currentQuestions.filter(
  //         (_, idx) => idx !== questionIndex
  //       );
  //     } else {
  //       toast.warn(
  //         `Invalid operation: currentSection=${currentSection}, questionIndex=${questionIndex}`
  //       );
  //     }
  
  //     return { ...prevData, sections: updatedSections };
  //   });
  // };
  
  const handleDeleteQuestion = (questionIndex: number) => {
    setSurveyData((prevData) => {
      // Create deep copies to avoid mutating the state directly
      const updatedSections = prevData.sections.map((section, idx) => {
        if (idx === currentSection) {
          return {
            ...section,
            questions: section.questions.filter((_, qIdx) => qIdx !== questionIndex),
          };
        }
        return section;
      });
  
      return { ...prevData, sections: updatedSections };
    });
  };


  // const handleDeleteQuestion = ( questionIndex: number) => {
  //   setSurveyData((prevData) => {
  //     const updatedSections = [...prevData.sections];
  //     updatedSections[currentSection].questions.splice(questionIndex, 1); // Remove question
  //     return { ...prevData, sections: updatedSections };
  //   });
  // };

  const handleCancel = () => {
    setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
    // setAiChatbot(false);
  };

  // Populate the form fields when the data is fetched successfully
  useEffect(() => {
    if (data) {
      setSurveyData({
        topic: data?.data?.topic || "",
        description: data?.data?.description || "",
        // sections: data?.data?.questions || [],
        theme: data?.data?.theme || "Default",
        header_text: data?.data?.header_text || {
          name: "Times New Roman",
          size: 18,
        },
        question_text: data?.data?.question_text || {
          name: "Times New Roman",
          size: 14,
        },
        body_text: data?.data?.body_text || {
          name: "Times New Roman",
          size: 12,
        },
        sections: data?.data?.sections || [],
        color_theme: data?.data?.color_theme || "#ffffff",
        logo_url: data?.data?.logo_url || "",
        header_url: data?.data?.header_url || "",
      });
    }
  }, [data]);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < surveyData?.sections?.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSave = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean
  ) => {
    if (editIndex === null) return; // No edit index, return early
  
    setSurveyData((prevData) => {
      const updatedSections = [...prevData.sections]; // Clone sections
  
      // Get the current section
      const currentSectionData = updatedSections[currentSection];
  
      if (currentSectionData) {
        // Update the specific question
        const updatedQuestions = currentSectionData.questions.map((question, idx) =>
          idx === editIndex
            ? {
                ...question,
                question: updatedQuestion,
                options: updatedOptions,
                question_type: updatedQuestionType,
                is_required: isRequired,
              }
            : question
        );
  
        // Replace the updated questions in the section
        updatedSections[currentSection] = {
          ...currentSectionData,
          questions: updatedQuestions,
        };
      }
  
      return {
        ...prevData,
        sections: updatedSections,
      };
    });
  
    // Exit edit mode
    setEditIndex(null);
    setIsEdit(false);
  };
  


  
  const saveSurvey = async () => {
    console.log({ id: params.id, surveyData })
        try {
          await editSurvey({ id: params.id, body:surveyData }).unwrap();
          toast.success("Survey updated successfully!");
          router.push('/surveys/survey-list');
        } catch (error) {
          console.error("Error updating survey:", error);
          toast.error("Failed to update survey.");
        }
      };
  return (
    <div
      className={`${surveyData?.theme} flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div
        className={`${surveyData?.theme} flex justify-between gap-10 w-full`}
      >
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          {surveyData?.logo_url && (
            <div className="bg-[#9D50BB] rounded w-16 my-5 text-white flex items-center flex-col ">
              <Image
                src={surveyData?.logo_url}
                alt=""
                className="w-full object-cover rounded  bg-no-repeat h-16 "
                width={"100"}
                height={"200"}
              />
            </div>
          )}

          {surveyData?.header_url && (
            <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
              <Image
                src={surveyData?.header_url}
                alt=""
                className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                width={"100"}
                height={"200"}
              />
            </div>
          )}

          <div className="flex flex-col">
          {
            isEditHeader ? (
              <div className="mb-6 bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <label className="block font-semibold mb-2">Survey Topic</label>
               <input
                 type="text"
                 value={surveyData.topic}
                 onChange={(e) => setSurveyData({ ...surveyData, topic: e.target.value })}
                 className="w-full p-2 border rounded"
               />
               <label className="block font-semibold mb-2 mt-4">Survey Description</label>
               <textarea
                 rows={4}
                 value={surveyData.description}
                 onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
                 className="w-full p-2 border rounded"
               />
                 <button className="auth-btn text-white px-4 py-2 w-1/2 rounded hover:bg-blue-700" onClick={()=>setIsEditHeader((prev)=>!prev)}>
           Save
          </button>
             </div>
            
            ) : (
              <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <h2
                className="text-[1.5rem] font-normal"
                style={{
                  fontSize: `${surveyData?.header_text?.size}px`,
                  fontFamily: `${surveyData?.header_text?.name}`,
                }}
              >
                {surveyData?.topic}
              </h2>
              <p
                style={{
                  fontSize: `${surveyData?.body_text?.size}px`,
                  fontFamily: `${surveyData?.body_text?.name}`,
                }}
              >
                {surveyData?.description}
              </p>
              <div className="flex justify-end">
             <button className="bg-transparent border text-[#828282] border-[#828282]  px-5 py-1 rounded-full" onClick={()=>setIsEditHeader((prev)=>!prev)}>
           Edit
          </button>

              </div>
            </div>
            )
          }
          </div>
 


          {/* @ts-ignore */}
          {surveyData?.sections[currentSection]?.questions?.map(
            (item: any, index: number) => (
              <div key={index} className="mb-4">
                {isEdit &&
                editIndex === index &&
                item.question_type === "matrix_checkbox" ? (
                  <MatrixQuestionEdit
                    question={item.question}
                    options={item.options}
                    is_required={item.is_required}
                    questionType={item.question_type}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : isEdit && editIndex === index ? (
                  <MultiChoiceQuestionEdit
                    // index={index + 1}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    is_required={item.is_required}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : item.question_type === "multiple_choice" ||
                  item.question_type === "multi_choice" ? (
                  <MultiChoiceQuestion
                    question={item.question}
                    options={item.options}
                    is_required={item.is_required}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    index={index + 1}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    setEditId={setEditIndex}
                  />
                ) : item.question_type === "comment" ||
                  item.question_type === "long_text" ? (
                  <CommentQuestion
                    key={index}
                    index={index + 1}
                    questionType={item.question_type}
                    question={item.question}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                  />
                ) : item.question_type === "linear_Scale" ? (
                  <LinearScaleQuestion
                    question={item.question}
                    scaleStart={item.scaleStart}
                    scaleEnd={item.scaleEnd}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    index={index + 1}
                  />
                ) : item.question_type === "likert_scale" ? (
                  <LikertScaleQuestion
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    index={index + 1}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "star_rating" ? (
                  <StarRatingQuestion
                    question={item.question}
                    // maxRating={5}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    index={index + 1}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "matrix_multiple_choice" ||
                  item.question_type === "matrix_checkbox" ? (
                  <MatrixQuestion
                    key={index}
                    index={index + 1}
                    // options={item.options}
                    rows={item.rows}
                    columns={item.columns}
                    questionType={item.question_type}
                    question={item.question}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "single_choice" ? (
                  <SingleChoiceQuestion
                    index={index + 1}
                    key={index}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "checkbox" ? (
                  <CheckboxQuestion
                    key={index}
                    index={index + 1}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "rating_scale" ? (
                  <RatingScaleQuestion
                    key={index}
                    index={index + 1}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "drop_down" ? (
                  <DropdownQuestion
                    index={index + 1}
                    key={index}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "number" ? (
                  <NumberQuestion
                    key={index}
                    index={index + 1}
                    question={item.question}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "short_text" ? (
                  <ShortTextQuestion
                    key={index}
                    index={index + 1}
                    question={item.question}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "boolean" ? (
                  <BooleanQuestion
                    key={index}
                    index={index + 1}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // onSave={handleAISave}
                    is_required={item.is_requied}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : item.question_type === "slider" ? (
                  <SliderQuestion
                    question={item.question}
                    options={item.options}
                    // step={item.options.length}
                    questionType={item.question_type}
                    index={index + 1}
                    is_required={item.is_required}
                    EditQuestion={() => EditQuestion(index)}
                    DeleteQuestion={() => handleDeleteQuestion(index)}
                    // @ts-expect-error expect here
                    onSave={handleAISave}
                    setIsRequired={() => {
                      const updatedSections = [...questions];
                      const updatedSection = {
                        ...updatedSections[currentSection],
                      };
                      const updatedQuestions = [...updatedSection.questions];

                      updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        is_required: !item.is_required,
                      };

                      updatedSection.questions = updatedQuestions;
                      updatedSections[currentSection] = updatedSection;
                    
                    }}
                  />
                ) : (
                  "Unsupported question type"
                )}
              </div>
            )
          )}

          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
          <button className="auth-btn text-white px-4 py-2 rounded hover:bg-blue-700" onClick={saveSurvey}>
            {isEditLoading ? "Saving..." : "Save Changes"}
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
          {isSidebar ? <StyleEditor /> : <QuestionType />}
        </div>
      </div>
    </div>
  );
};

export default EditSubmittedSurvey;
