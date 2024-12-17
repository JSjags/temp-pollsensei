// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { pollsensei_new_logo } from "@/assets/images";
// import { useFetchASurveyQuery, useEditSurveyMutation } from "@/services/survey.service";

// interface Question {
//   question: string;
//   question_type: string;
//   options?: string[];
//   rows?: string[];
//   columns?: string[];
// }

// const EditCreatedSurvey = () => {
//   const params = useParams();
//   const { data, isLoading } = useFetchASurveyQuery(params.id);
//   const [editSurvey] = useEditSurveyMutation();

//   const [surveyData, setSurveyData] = useState<any>({
//     topic: "",
//     description: "",
//     sections: [],
//   });


//   useEffect(() => {
//     if (data) {
//       setSurveyData(data.data);
//     }
//   }, [data]);



//   const handleInputChange = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
//     setSurveyData((prevData: any) => {
//       const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             questions: section.questions.map((q: any, qIndex: number) => {
//               if (qIndex === questionIndex) {
//                 return { ...q, [field]: value }; // Spread existing question and update field
//               }
//               return q;
//             }),
//           };
//         }
//         return section;
//       });
//       return { ...prevData, sections: updatedSections };
//     });
//   };



//   const handleOptionChange = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
//     setSurveyData((prevData: any) => {
//       const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             questions: section.questions.map((q: any, qIndex: number) => {
//               if (qIndex === questionIndex) {
//                 const updatedOptions = q.options.map((opt: string, oIndex: number) =>
//                   oIndex === optionIndex ? value : opt
//                 );
//                 return { ...q, options: updatedOptions };
//               }
//               return q;
//             }),
//           };
//         }
//         return section;
//       });
//       return { ...prevData, sections: updatedSections };
//     });
//   };
  



//   const addOption = (sectionIndex: number, questionIndex: number) => {
//     setSurveyData((prevData: any) => {
//       const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             questions: section.questions.map((q: any, qIndex: number) => {
//               if (qIndex === questionIndex) {
//                 return { ...q, options: [...q.options, ""] }; // Add a new empty option
//               }
//               return q;
//             }),
//           };
//         }
//         return section;
//       });
//       return { ...prevData, sections: updatedSections };
//     });
//   };
  

//   const saveSurvey = async () => {
//     try {
//       await editSurvey({ id: params.id, updatedData: surveyData }).unwrap();
//       alert("Survey updated successfully!");
//     } catch (error) {
//       console.error("Error updating survey:", error);
//       alert("Failed to update survey.");
//     }
//   };

//   const renderQuestionEditor = (question: Question, sectionIndex: number, questionIndex: number) => {
//     return (
//       <div key={questionIndex} className="mb-4 p-4 bg-gray-100 rounded">
//         {/* Question Text */}
//         <label className="block font-semibold mb-2">Question</label>
//         <input
//           type="text"
//           value={question.question}
//           onChange={(e) => handleInputChange(sectionIndex, questionIndex, "question", e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         {/* Options (if applicable) */}
//         {["multiple_choice", "checkbox", "drop_down", "single_choice"].includes(question.question_type) && (
//           <div className="mt-4">
//             <label className="block font-semibold mb-2">Options</label>
//             {question.options?.map((option, optionIndex) => (
//               <div key={optionIndex} className="flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={option}
//                   onChange={(e) => handleOptionChange(sectionIndex, questionIndex, optionIndex, e.target.value)}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             ))}
//             <button
//               onClick={() => addOption(sectionIndex, questionIndex)}
//               className="text-blue-600 underline"
//             >
//               + Add Option
//             </button>
//           </div>
//         )}

//         {/* Additional fields (Matrix, etc.) */}
//         {["matrix_checkbox", "matrix_radio"].includes(question.question_type) && (
//           <div>
//             <label className="block font-semibold mt-4">Matrix Rows</label>
//             {question.rows?.map((row, rowIndex) => (
//               <input
//                 key={rowIndex}
//                 type="text"
//                 value={row}
//                 onChange={(e) =>
//                   handleInputChange(sectionIndex, questionIndex, "rows", [
//                     ...question.rows!.slice(0, rowIndex),
//                     e.target.value,
//                     ...question.rows!.slice(rowIndex + 1),
//                   ])
//                 }
//                 className="w-full p-2 border rounded mb-2"
//               />
//             ))}
//             <label className="block font-semibold mt-4">Matrix Columns</label>
//             {question.columns?.map((column, colIndex) => (
//               <input
//                 key={colIndex}
//                 type="text"
//                 value={column}
//                 onChange={(e) =>
//                   handleInputChange(sectionIndex, questionIndex, "columns", [
//                     ...question.columns!.slice(0, colIndex),
//                     e.target.value,
//                     ...question.columns!.slice(colIndex + 1),
//                   ])
//                 }
//                 className="w-full p-2 border rounded mb-2"
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h1 className="text-2xl font-semibold mb-4">Edit Survey</h1>

//           {/* Survey Header */}
//           <div className="mb-6">
//             <label className="block font-semibold mb-2">Survey Topic</label>
//             <input
//               type="text"
//               value={surveyData.topic}
//               onChange={(e) => setSurveyData({ ...surveyData, topic: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//             <label className="block font-semibold mb-2 mt-4">Survey Description</label>
//             <textarea
//               rows={4}
//               value={surveyData.description}
//               onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           {/* Questions Editor */}
//           {surveyData.sections?.map((section: any, sectionIndex: number) => (
//             <div key={sectionIndex} className="mb-6">
//               <h2 className="text-lg font-semibold mb-4">Section {sectionIndex + 1}</h2>
//               {section.questions?.map((question: Question, questionIndex: number) =>
//                 renderQuestionEditor(question, sectionIndex, questionIndex)
//               )}
//             </div>
//           ))}

//           {/* Save Button */}
//           <button
//             onClick={saveSurvey}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Save Changes
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default EditCreatedSurvey;









// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useFetchASurveyQuery, useEditSurveyMutation } from "@/services/survey.service";

// interface Question {
//   question: string;
//   question_type: string;
//   options?: string[];
//   rows?: string[];
//   columns?: string[];
// }

// const EditCreatedSurvey = () => {
//   const params = useParams();
//   const { data, isLoading } = useFetchASurveyQuery(params.id);
//   const [editSurvey] = useEditSurveyMutation();

//   const [surveyData, setSurveyData] = useState<any>({
//     topic: "",
//     description: "",
//     sections: [],
//   });

//   // Track the currently edited question (sectionIndex, questionIndex)
//   const [editingQuestion, setEditingQuestion] = useState<{
//     sectionIndex: number | null;
//     questionIndex: number | null;
//   }>({ sectionIndex: null, questionIndex: null });

//   useEffect(() => {
//     if (data) {
//       setSurveyData(data.data);
//     }
//   }, [data]);

//   const handleInputChange = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
//     setSurveyData((prevData: any) => {
//       const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             questions: section.questions.map((q: any, qIndex: number) => {
//               if (qIndex === questionIndex) {
//                 return { ...q, [field]: value };
//               }
//               return q;
//             }),
//           };
//         }
//         return section;
//       });
//       return { ...prevData, sections: updatedSections };
//     });
//   };

//   const saveSurvey = async () => {
//     try {
//       await editSurvey({ id: params.id, updatedData: surveyData }).unwrap();
//       alert("Survey updated successfully!");
//     } catch (error) {
//       console.error("Error updating survey:", error);
//       alert("Failed to update survey.");
//     }
//   };

//   const toggleEdit = (sectionIndex: number, questionIndex: number) => {
//     setEditingQuestion({ sectionIndex, questionIndex });
//   };

//   const exitEdit = () => {
//     setEditingQuestion({ sectionIndex: null, questionIndex: null });
//   };

//   const renderQuestionEditor = (question: Question, sectionIndex: number, questionIndex: number) => {
//     const isEditing =
//       editingQuestion.sectionIndex === sectionIndex && editingQuestion.questionIndex === questionIndex;

//     return (
//       <div key={questionIndex} className="mb-4 p-4 bg-gray-100 rounded">
//         {/* Editable State */}
//         {isEditing ? (
//           <>
//             <label className="block font-semibold mb-2">Question</label>
//             <input
//               type="text"
//               value={question.question}
//               onChange={(e) => handleInputChange(sectionIndex, questionIndex, "question", e.target.value)}
//               className="w-full p-2 border rounded"
//             />

//             {/* Options Editor */}
//             {["multiple_choice", "checkbox", "drop_down", "single_choice"].includes(question.question_type) &&
//               question.options?.map((option, optionIndex) => (
//                 <div key={optionIndex} className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) =>
//                       handleInputChange(sectionIndex, questionIndex, "options", [
//                         ...question.options!.slice(0, optionIndex),
//                         e.target.value,
//                         ...question.options!.slice(optionIndex + 1),
//                       ])
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//               ))}

//             {/* Save Button */}
//             <button
//               onClick={exitEdit}
//               className="bg-green-500 text-white px-4 py-1 mt-2 rounded hover:bg-green-600"
//             >
//               Save
//             </button>
//           </>
//         ) : (
//           // Non-Editable State
//           <>
//             <div className="flex justify-between items-center">
//               <p className="text-lg font-medium">{question.question}</p>
//               <button
//                 onClick={() => toggleEdit(sectionIndex, questionIndex)}
//                 className="text-blue-500 underline hover:text-blue-700"
//               >
//                 Edit
//               </button>
//             </div>

//             {/* Display Options */}
//             {["multiple_choice", "checkbox", "drop_down", "single_choice"].includes(question.question_type) && (
//               <ul className="list-disc ml-6 mt-2">
//                 {question.options?.map((option, index) => (
//                   <li key={index}>{option}</li>
//                 ))}
//               </ul>
//             )}
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h1 className="text-2xl font-semibold mb-4">Edit Survey</h1>

//           {/* Survey Header */}
//           <div className="mb-6">
//             <label className="block font-semibold mb-2">Survey Topic</label>
//             <input
//               type="text"
//               value={surveyData.topic}
//               onChange={(e) => setSurveyData({ ...surveyData, topic: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//             <label className="block font-semibold mb-2 mt-4">Survey Description</label>
//             <textarea
//               rows={4}
//               value={surveyData.description}
//               onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           {/* Questions Editor */}
//           {surveyData.sections?.map((section: any, sectionIndex: number) => (
//             <div key={sectionIndex} className="mb-6">
//               <h2 className="text-lg font-semibold mb-4">Section {sectionIndex + 1}</h2>
//               {section.questions?.map((question: Question, questionIndex: number) =>
//                 renderQuestionEditor(question, sectionIndex, questionIndex)
//               )}
//             </div>
//           ))}

//           {/* Save Button */}
//           <button
//             onClick={saveSurvey}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Save Changes
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default EditCreatedSurvey;

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFetchASurveyQuery, useEditSurveyMutation } from "@/services/survey.service";
import { toast } from "react-toastify";

interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  min?: number;
  max?: number;
}

const EditCreatedSurvey = () => {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useFetchASurveyQuery(params.id);
  const [editSurvey] = useEditSurveyMutation();

  const [surveyData, setSurveyData] = useState<any>({ topic: "", description: "", sections: [] });
  const [editingQuestion, setEditingQuestion] = useState<{ sectionIndex: number; questionIndex: number } | null>(null);

  useEffect(() => {
    if (data) setSurveyData(data.data);
  }, [data]);

    const handleInputChange = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
    setSurveyData((prevData: any) => {
      const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
        if (sIndex === sectionIndex) {
          return {
            ...section,
            questions: section.questions.map((q: any, qIndex: number) => {
              if (qIndex === questionIndex) {
                return { ...q, [field]: value }; // Spread existing question and update field
              }
              return q;
            }),
          };
        }
        return section;
      });
      return { ...prevData, sections: updatedSections };
    });
  };



  const handleOptionChange = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setSurveyData((prevData: any) => {
      const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
        if (sIndex === sectionIndex) {
          return {
            ...section,
            questions: section.questions.map((q: any, qIndex: number) => {
              if (qIndex === questionIndex) {
                const updatedOptions = q.options.map((opt: string, oIndex: number) =>
                  oIndex === optionIndex ? value : opt
                );
                return { ...q, options: updatedOptions };
              }
              return q;
            }),
          };
        }
        return section;
      });
      return { ...prevData, sections: updatedSections };
    });
  };


    const addOption = (sectionIndex: number, questionIndex: number) => {
    setSurveyData((prevData: any) => {
      const updatedSections = prevData.sections.map((section: any, sIndex: number) => {
        if (sIndex === sectionIndex) {
          return {
            ...section,
            questions: section.questions.map((q: any, qIndex: number) => {
              if (qIndex === questionIndex) {
                return { ...q, options: [...q.options, ""] }; // Add a new empty option
              }
              return q;
            }),
          };
        }
        return section;
      });
      return { ...prevData, sections: updatedSections };
    });
  };

  const toggleEdit = (sectionIndex: number, questionIndex: number) => {
    setEditingQuestion({ sectionIndex, questionIndex });
  };

  const saveEdit = () => {
    setEditingQuestion(null);
  };


  // const saveSurvey = async () => {
  //   console.log({ id: params.id, surveyData })
  //       try {
  //         await editSurvey({ id: params.id, surveyData }).unwrap();
  //         alert("Survey updated successfully!");
  //         router.push('/surveys/survey-list');
  //       } catch (error) {
  //         console.error("Error updating survey:", error);
  //         alert("Failed to update survey.");
  //       }
  //     };

  const saveSurvey = async () => {
    setSurveyData((prevData: any) => {
      console.log("Updated Payload:", prevData); // Log the updated survey data
      return prevData;
    });
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
  
      console.log("Sending Updated Data:", surveyData);
      await editSurvey({ id: params.id, surveyData }).unwrap();
      toast.success("Survey updated successfully!");
      router.push('/surveys/survey-list');
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Failed to update survey.");
    }
  };

  const renderEditableFields = (question: Question, sectionIndex: number, questionIndex: number) => {
    switch (question.question_type) {
      case "multiple_choice":
      case "checkbox":
      case "drop_down":
      case "single_choice":
        return (
          <>
            <label className="block font-semibold mb-2">Options:</label>
            {question.options?.map((opt, idx) => (
              <input
                key={idx}
                value={opt}
                onChange={(e) => handleOptionChange(sectionIndex, questionIndex, idx, e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder={`Option ${idx + 1}`}
              />
            ))}
            <button onClick={() => addOption(sectionIndex, questionIndex)} className="text-blue-500 underline">
              + Add Option
            </button>
          </>
        );
      case "matrix_checkbox":
      case "matrix_radio":
        return (
          <>
            <label className="block font-semibold mt-4">Matrix Rows:</label>
            {question.rows?.map((row, idx) => (
              <input
                key={idx}
                value={row}
                onChange={(e) =>
                  handleInputChange(sectionIndex, questionIndex, "rows", [
                    ...question.rows!.slice(0, idx),
                    e.target.value,
                    ...question.rows!.slice(idx + 1),
                  ])
                }
                className="w-full p-2 mb-2 border rounded"
                placeholder={`Row ${idx + 1}`}
              />
            ))}
            <label className="block font-semibold mt-4">Matrix Columns:</label>
            {question.columns?.map((col, idx) => (
              <input
                key={idx}
                value={col}
                onChange={(e) =>
                  handleInputChange(sectionIndex, questionIndex, "columns", [
                    ...question.columns!.slice(0, idx),
                    e.target.value,
                    ...question.columns!.slice(idx + 1),
                  ])
                }
                className="w-full p-2 mb-2 border rounded"
                placeholder={`Column ${idx + 1}`}
              />
            ))}
          </>
        );
      case "slider":
        return (
          <>
            <label className="block font-semibold">Min:</label>
            <input
              type="number"
              value={question.min}
              onChange={(e) => handleInputChange(sectionIndex, questionIndex, "min", +e.target.value)}
              className="w-full p-2 border rounded"
            />
            <label className="block font-semibold mt-2">Max:</label>
            <input
              type="number"
              value={question.max}
              onChange={(e) => handleInputChange(sectionIndex, questionIndex, "max", +e.target.value)}
              className="w-full p-2 border rounded"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">Edit Survey</h1>
                   {/* Survey Header */}
           <div className="mb-6">
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
           </div>

          {surveyData.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Section {sectionIndex + 1}</h2>
              {section.questions.map((question: Question, questionIndex: number) => (
                <div key={questionIndex} className="p-4 mb-4 bg-gray-50 rounded">
                  {editingQuestion?.sectionIndex === sectionIndex &&
                  editingQuestion?.questionIndex === questionIndex ? (
                    <>
                      <label className="block font-semibold mb-2">Question:</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) =>
                          handleInputChange(sectionIndex, questionIndex, "question", e.target.value)
                        }
                        className="w-full p-2 border rounded mb-4"
                      />
                      {renderEditableFields(question, sectionIndex, questionIndex)}
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <p className="text-lg">{question.question}</p>
                        <button
                          onClick={() => toggleEdit(sectionIndex, questionIndex)}
                          className="text-blue-500 underline"
                        >
                          Edit
                        </button>
                      </div>
                      {["multiple_choice", "checkbox", "drop_down", "single_choice"].includes(
                        question.question_type
                      ) && (
                        <ul className="list-disc ml-6 mt-2">
                          {question.options?.map((opt, idx) => <li key={idx}>{opt}</li>)}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={saveSurvey}>
            Save Changes
          </button>
        </>
      )}
    </div>
  );
};

export default EditCreatedSurvey;

