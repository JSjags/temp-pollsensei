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
import { motion } from "framer-motion";
import WatermarkBanner from "@/components/common/WatermarkBanner";

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
  const [editSurvey, { isSuccess, isError, error, isLoading: isEditLoading }] =
    useEditSurveyMutation();
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
            questions: section.questions.filter(
              (_, qIdx) => qIdx !== questionIndex
            ),
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
        const updatedQuestions = currentSectionData.questions.map(
          (question, idx) =>
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
    console.log({ id: params.id, surveyData });
    try {
      await editSurvey({ id: params.id, body: surveyData }).unwrap();
      toast.success("Survey updated successfully!");
      router.push("/surveys/survey-list");
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update survey.");
    }
  };
  return (
    <div
      className={`${surveyData?.theme} flex flex-col gap-5 w-full px-0 lg:pl-6 relative`}
    >
      <div className={`flex justify-between gap-6 w-full`}>
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
            {isEditHeader ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-6 bg-white rounded-lg w-full my-4 p-6 shadow-lg"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Survey Topic
                    </label>
                    <input
                      type="text"
                      value={surveyData.topic}
                      onChange={(e) =>
                        setSurveyData({ ...surveyData, topic: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Survey Description
                    </label>
                    <textarea
                      rows={4}
                      value={surveyData.description}
                      onChange={(e) =>
                        setSurveyData({
                          ...surveyData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-4 py-2 w-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-md shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                    onClick={() => setIsEditHeader((prev) => !prev)}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg w-full my-4 p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="space-y-4">
                  <h2
                    className="font-normal"
                    style={{
                      fontSize: `${surveyData?.header_text?.size}px`,
                      fontFamily: `${surveyData?.header_text?.name}`,
                    }}
                  >
                    {surveyData?.topic}
                  </h2>
                  <p
                    className="text-gray-600"
                    style={{
                      fontSize: `${surveyData?.body_text?.size}px`,
                      fontFamily: `${surveyData?.body_text?.name}`,
                    }}
                  >
                    {surveyData?.description}
                  </p>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 h-10 border border-purple-300 text-sm font-medium rounded-full text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      onClick={() => setIsEditHeader((prev) => !prev)}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
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

          <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-10">
            <button
              className="auth-btn text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={saveSurvey}
            >
              {isEditLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <WatermarkBanner className="mb-10" />
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
