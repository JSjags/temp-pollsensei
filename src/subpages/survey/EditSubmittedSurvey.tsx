// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import StyleEditor from "./StyleEditor";
// import QuestionType from "./QuestionType";
// import Image from "next/image";
// import { pollsensei_new_logo, sparkly } from "@/assets/images";
// import WaitingMessagesModal from "@/components/modals/WaitingModal";
// import PaginationBtn from "@/components/common/PaginationBtn";
// import { HiOutlinePlus } from "react-icons/hi";
// import { ClipLoader } from "react-spinners";
// import MatrixQuestion from "@/components/survey/MatrixQuestion";
// import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
// import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
// import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
// import CommentQuestion from "@/components/survey/CommentQuestion";
// import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
// import MultiChoiceQuestionEdit from "../milestone/Test";
// import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
// import {
//   useEditSurveyMutation,
//   useFetchASurveyQuery,
// } from "@/services/survey.service";

// const EditSubmittedSurvey = () => {
//   const params = useParams();
//   const { data, isLoading } = useFetchASurveyQuery(params.id);
//   const [editSurvey, { isSuccess, isError, error }] = useEditSurveyMutation();
//   const [isSidebar, setIsSidebarOpen] = useState(true);
//   const [isEdit, setIsEdit] = useState(true);
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [currentSection, setCurrentSection] = useState(0);

//   console.log(data);
//   console.log(params.id);
//   const [surveyData, setSurveyData] = useState({
//     topic: "",
//     description: "",
//     sections: [
//       // {
//       //   question: "",
//       //   question_type: "",
//       //   options: [""],
//       // },
//     ],
//     theme: "",
//     header_text: { name: "", size: 18 },
//     question_text: { name: "", size: 14 },
//     body_text: { name: "", size: 12 },
//     color_theme: "#ffffff",
//     logo_url: "#ffffff",
//     header_url: "#ffffff",
//   });

//   // Populate the form fields when the data is fetched successfully
//   useEffect(() => {
//     if (data) {
//       setSurveyData({
//         topic: data?.data?.topic || "",
//         description: data?.data?.description || "",
//         sections: data?.data?.questions || [],
//         theme: data?.data?.theme || "Default",
//         header_text: data?.data?.header_text || {
//           name: "Times New Roman",
//           size: 18,
//         },
//         question_text: data?.data?.question_text || {
//           name: "Times New Roman",
//           size: 14,
//         },
//         body_text: data?.data?.body_text || {
//           name: "Times New Roman",
//           size: 12,
//         },
//         color_theme: data?.data?.color_theme || "#ffffff",
//         logo_url: data?.data?.logo_url || "",
//         header_url: data?.data?.header_url || "",
//       });
//     }
//   }, [data]);

//   const navigatePage = (direction: any) => {
//     setCurrentSection((prevIndex) => {
//       if (direction === "next") {
//         return prevIndex < surveyData?.sections?.length - 1 ? prevIndex + 1 : prevIndex;
//       } else {
//         return prevIndex > 0 ? prevIndex - 1 : prevIndex;
//       }
//     });
//   };
//   return (
//     <div
//       className={`${surveyData?.theme} flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
//     >
//       <div
//         className={`${surveyData?.theme} flex justify-between gap-10 w-full`}
//       >
//         <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
//           {surveyData?.logo_url && (
//             <div className="bg-[#9D50BB] rounded w-16 my-5 text-white flex items-center flex-col ">
//               <Image
//                 src={surveyData?.logo_url}
//                 alt=""
//                 className="w-full object-cover rounded  bg-no-repeat h-16 "
//                 width={"100"}
//                 height={"200"}
//               />
//             </div>
//           )}

//           {surveyData?.header_url && (
//             <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
//               <Image
//                 src={surveyData?.header_url}
//                 alt=""
//                 className="w-full object-cover bg-no-repeat h-24 rounded-lg"
//                 width={"100"}
//                 height={"200"}
//               />
//             </div>
//           )}

//           <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
//             <h2
//               className="text-[1.5rem] font-normal"
//               style={{
//                 fontSize: `${surveyData?.header_text?.size}px`,
//                 fontFamily: `${surveyData?.header_text?.name}`,
//               }}
//             >
//               {surveyData?.topic}
//             </h2>
//             <p
//               style={{
//                 fontSize: `${surveyData?.body_text?.size}px`,
//                 fontFamily: `${surveyData?.body_text?.name}`,
//               }}
//             >
//               {surveyData?.description}
//             </p>
//             <div className="flex justify-end"></div>
//           </div>

//           {/* data.sections[0].questions */}
//               {/* @ts-ignore */}
//           {surveyData?.sections[currentSection]?.questions?.map((item: any, index: number) => (
//           <div key={index} className="mb-4">
//             { item.question_type === "matrix_checkbox" ? (
//               <MatrixQuestionEdit
//                 question={item.question}
//                 options={item.options}
//                 is_required={item.is_required}
//                 questionType={item.question_type}
//                 // onSave={handleSave}
//                 // onCancel={handleCancel}
//               />
//             ) :
//             // isEdit && editIndex === index ?
//              (
//               <MultiChoiceQuestionEdit
//                 question={item.question}
//                 options={item.options}
//                 questionType={item.question_type}
//                 is_required={item.is_required}
//                 // onSave={handleSave}
//                 // onCancel={handleCancel}
//               />
//             )
//             //  : item.question_type === "multiple_choice" || item.question_type === "multi_choice" ? (
//             //   <MultiChoiceQuestion
//             //     question={item.question}
//             //     options={item.options}
//             //     is_required={item.is_required}
//             //     setIsRequired={() => {
//             //       const updatedSections = [...questions];
//             //       const updatedSection = { ...updatedSections[currentSection] };
//             //       const updatedQuestions = [...updatedSection.questions];

//             //       updatedQuestions[index] = {
//             //         ...updatedQuestions[index],
//             //         is_required: !item.is_required,
//             //       };

//             //       updatedSection.questions = updatedQuestions;
//             //       updatedSections[currentSection] = updatedSection;
//             //       dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
//             //     }}
//             //     questionType={item.question_type}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     index={index + 1}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : item.question_type === "comment" || item.question_type === "long_text" ? (
//             //   <CommentQuestion
//             //     key={index}
//             //     index={index + 1}
//             //     questionType={item.question_type}
//             //     question={item.question}
//             //     is_required={item.is_requied}
//             //     setIsRequired={() => {
//             //       const updatedSections = [...questions];
//             //       const updatedSection = { ...updatedSections[currentSection] };
//             //       const updatedQuestions = [...updatedSection.questions];

//             //       updatedQuestions[index] = {
//             //         ...updatedQuestions[index],
//             //         is_required: !item.is_required,
//             //       };

//             //       updatedSection.questions = updatedQuestions;
//             //       updatedSections[currentSection] = updatedSection;
//             //       dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
//             //     }}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : item.question_type === "linear_Scale" ? (
//             //   <LinearScaleQuestion
//             //     question={item.question}
//             //     scaleStart={item.scaleStart}
//             //     scaleEnd={item.scaleEnd}
//             //     questionType={item.question_type}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : item.question_type === "likert_scale" ? (
//             //   <LikertScaleQuestion
//             //     question={item.question}
//             //     options={item.options}
//             //     questionType={item.question_type}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : item.question_type === "star_rating" ? (
//             //   <StarRatingQuestion
//             //     question={item.question}
//             //     maxRating={5}
//             //     questionType={item.question_type}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : item.question_type === "matrix_checkbox" ? (
//             //   <MatrixQuestion
//             //     key={index}
//             //     index={index + 1}
//             //     options={item.options}
//             //     questionType={item.question_type}
//             //     question={item.question}
//             //     EditQuestion={() => EditQuestion(index)}
//             //     DeleteQuestion={()=>handleDeleteQuestion(index)}
//             //   />
//             // ) : null
//             }
//           </div>
//         ))}

//           <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
//             {/* <div className="flex gap-2 items-center">
//             <button
//               className="bg-white rounded-full px-5 py-1"
//               onClick={()=>setAddMoreQuestion((prev)=> !prev)}
//               disabled={generatingSingleSurvey}
//             >
//               {
//                 generatingSingleSurvey ? (
//                   <ClipLoader size={24} />
//                 ) : (

//                  <>
//                   <HiOutlinePlus className="inline-block mr-2" /> Add Question
//                  </>
//                 )
//               }
//             </button>

//           </div> */}

//             {/* {questions?.length > 1 && (
//           <div className="flex w-full md:w-auto md:justify-end items-center">
//             <PaginationBtn
//               currentSection={currentSection}
//               totalSections={questions.length}
//               onNavigate={navigatePage}
//             />
//           </div>
//         )} */}
//           </div>

//           {/* <WaitingMessagesModal otherPossibleCondition={generatingSingleSurvey}  openModal={openModal}
//       setOpenModal={generatingSingleSurvey === false ? () => setOpenModal(false) : () => setOpenModal(true)}
//        /> */}

//           {/* <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
//         <button
//           className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
//           type="button"
//           onClick={handleSurveyCreation}
//         >
//           {isLoading ? "Submitting" : "Continue"}
//         </button>
//         </div> */}
//           <div className="bg-[#5B03B21A] rounded-md flex flex-col justify-center items-center mb-10 py-5 text-center relative">
//             <div className="flex flex-col">
//               <p>Form created by</p>
//               <Image src={pollsensei_new_logo} alt="Logo" />
//             </div>
//             <span className="absolute bottom-2 right-4 text-[#828282]">
//               Remove watermark
//             </span>
//           </div>
//         </div>
//         <div
//           className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
//         >
//           {isSidebar ? <StyleEditor /> : <QuestionType />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditSubmittedSurvey;

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";
import WaitingMessagesModal from "@/components/modals/WaitingModal";
import PaginationBtn from "@/components/common/PaginationBtn";
import { HiOutlinePlus } from "react-icons/hi";
import { ClipLoader } from "react-spinners";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import MultiChoiceQuestionEdit from "../milestone/Test";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import {
  useEditSurveyMutation,
  useFetchASurveyQuery,
} from "@/services/survey.service";

const EditSubmittedSurvey = () => {
  const params = useParams();
  const { data, isLoading } = useFetchASurveyQuery(params.id);
  const [editSurvey, { isSuccess, isError, error }] = useEditSurveyMutation();
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [isEdit, setIsEdit] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState(0);

  console.log(data);
  console.log(params.id);
  const [surveyData, setSurveyData] = useState({
    topic: "",
    description: "",
    sections: [
      // {
      //   question: "",
      //   question_type: "",
      //   options: [""],
      // },
    ],
    theme: "",
    header_text: { name: "", size: 18 },
    question_text: { name: "", size: 14 },
    body_text: { name: "", size: 12 },
    color_theme: "#ffffff",
    logo_url: "#ffffff",
    header_url: "#ffffff",
  });

  // Populate the form fields when the data is fetched successfully
  useEffect(() => {
    if (data) {
      setSurveyData({
        topic: data?.data?.topic || "",
        description: data?.data?.description || "",
        sections: data?.data?.questions || [],
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
            <div className="flex justify-end"></div>
          </div>

          {/* data.sections[0].questions */}
          {/* @ts-ignore */}
          {surveyData?.sections[currentSection]?.questions?.map(
            (item: any, index: number) => (
              <div key={index} className="mb-4">
                {
                  item.question_type === "matrix_checkbox" ? (
                    <MatrixQuestionEdit
                      question={item.question}
                      options={item.options}
                      is_required={item.is_required}
                      questionType={item.question_type}
                      // onSave={handleSave}
                      // onCancel={handleCancel}
                    />
                  ) : (
                    // isEdit && editIndex === index ?
                    <MultiChoiceQuestionEdit
                      question={item.question}
                      options={item.options}
                      questionType={item.question_type}
                      is_required={item.is_required}
                      // onSave={handleSave}
                      // onCancel={handleCancel}
                    />
                  )
                  //  : item.question_type === "multiple_choice" || item.question_type === "multi_choice" ? (
                  //   <MultiChoiceQuestion
                  //     question={item.question}
                  //     options={item.options}
                  //     is_required={item.is_required}
                  //     setIsRequired={() => {
                  //       const updatedSections = [...questions];
                  //       const updatedSection = { ...updatedSections[currentSection] };
                  //       const updatedQuestions = [...updatedSection.questions];

                  //       updatedQuestions[index] = {
                  //         ...updatedQuestions[index],
                  //         is_required: !item.is_required,
                  //       };

                  //       updatedSection.questions = updatedQuestions;
                  //       updatedSections[currentSection] = updatedSection;
                  //       dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
                  //     }}
                  //     questionType={item.question_type}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     index={index + 1}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : item.question_type === "comment" || item.question_type === "long_text" ? (
                  //   <CommentQuestion
                  //     key={index}
                  //     index={index + 1}
                  //     questionType={item.question_type}
                  //     question={item.question}
                  //     is_required={item.is_requied}
                  //     setIsRequired={() => {
                  //       const updatedSections = [...questions];
                  //       const updatedSection = { ...updatedSections[currentSection] };
                  //       const updatedQuestions = [...updatedSection.questions];

                  //       updatedQuestions[index] = {
                  //         ...updatedQuestions[index],
                  //         is_required: !item.is_required,
                  //       };

                  //       updatedSection.questions = updatedQuestions;
                  //       updatedSections[currentSection] = updatedSection;
                  //       dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
                  //     }}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : item.question_type === "linear_Scale" ? (
                  //   <LinearScaleQuestion
                  //     question={item.question}
                  //     scaleStart={item.scaleStart}
                  //     scaleEnd={item.scaleEnd}
                  //     questionType={item.question_type}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : item.question_type === "likert_scale" ? (
                  //   <LikertScaleQuestion
                  //     question={item.question}
                  //     options={item.options}
                  //     questionType={item.question_type}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : item.question_type === "star_rating" ? (
                  //   <StarRatingQuestion
                  //     question={item.question}
                  //     maxRating={5}
                  //     questionType={item.question_type}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : item.question_type === "matrix_checkbox" ? (
                  //   <MatrixQuestion
                  //     key={index}
                  //     index={index + 1}
                  //     options={item.options}
                  //     questionType={item.question_type}
                  //     question={item.question}
                  //     EditQuestion={() => EditQuestion(index)}
                  //     DeleteQuestion={()=>handleDeleteQuestion(index)}
                  //   />
                  // ) : null
                }
              </div>
            )
          )}

          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            {/* <div className="flex gap-2 items-center">
            <button
              className="bg-white rounded-full px-5 py-1"
              onClick={()=>setAddMoreQuestion((prev)=> !prev)}
              disabled={generatingSingleSurvey}
            >
              {
                generatingSingleSurvey ? (
                  <ClipLoader size={24} />
                ) : (

                 <>
                  <HiOutlinePlus className="inline-block mr-2" /> Add Question
                 </>
                )
              }
            </button>

          </div> */}

            {/* {questions?.length > 1 && (
          <div className="flex w-full md:w-auto md:justify-end items-center">
            <PaginationBtn
              currentSection={currentSection}
              totalSections={questions.length}
              onNavigate={navigatePage}
            />
          </div>
        )} */}
          </div>

          {/* <WaitingMessagesModal otherPossibleCondition={generatingSingleSurvey}  openModal={openModal}
      setOpenModal={generatingSingleSurvey === false ? () => setOpenModal(false) : () => setOpenModal(true)} 
       /> */}

          {/* <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
        <button
          className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
          type="button"
          onClick={handleSurveyCreation}
        >
          {isLoading ? "Submitting" : "Continue"}
        </button>
        </div> */}
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
