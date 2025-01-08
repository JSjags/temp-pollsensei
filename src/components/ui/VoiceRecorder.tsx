// import { useUploadResponseFileMutation } from "@/services/survey.service";
// import React, { useState, useRef } from "react";
// import { AiOutlineAudio } from "react-icons/ai";
// import { toast } from "react-toastify";

// const ResponseFile = ({
//   question,
//   options,
//   handleAnswerChange,
//   selectedValue,
//   required
// }: {
//   question: string;
//   options: string[];
//   handleAnswerChange: (key: string, value: any) => void;
//   selectedValue: string;
//   required: boolean;
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [audioOrImageFile, setAudioOrImageFile] = useState<File | Blob | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const [uploadResponseFile, { data }] = useUploadResponseFileMutation()

//   const handleStartRecording = async () => {
//     setErrorMessage(null);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/wav",
//         });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioURL(url);
//         setAudioOrImageFile(audioBlob)
//         audioChunksRef.current = [];
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing microphone: ", error);
//       setErrorMessage("Microphone access denied or not available.");
//     }
//   };

//   const handleStopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const onSubmit = async ()=>{
//     if (audioOrImageFile instanceof File) {
//       const formData = new FormData();
//       formData.append("file", audioOrImageFile);
//     }

//       try {
//             await uploadResponseFile(audioOrImageFile).unwrap();
//             toast.success("file added successfully");
//             // refetch();
//           } catch (err: any) {
//             toast.error(
//               "Failed to update profile image " +
//                 (err?.data?.message || err.message)
//             );
//           }
//   }

//   const handleStarClick = (index: number) => {
//     const selectedOption = options[index];
//     handleAnswerChange(question, { scale_value: selectedOption });
//   };


//   return (
//     <div className="p-1 ">
//       {errorMessage && <p className="text-red-500">{errorMessage}</p>}

//       <input
//         type="file"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) {
//             const fileUrl = URL.createObjectURL(file);
//             // handleAnswerChange(quest.question, {
//             //   media_url: fileUrl,
//             // });
//           }
//         }}
//       />

//       <div className="flex items-center gap-2">
//         <div className="flex justify-center space-x-4">
//           {!isRecording ? (
//             <button
//               onClick={handleStartRecording}
//               className="px-4 py-2 rounded-lg text-sm font-semibold"
//             >
//               <AiOutlineAudio className="inline-block mr-2" />
//               Record
//             </button>
//           ) : (
//             <button
//               onClick={handleStopRecording}
//               className="px-4 text-sm font-semibold rounded-l"
//             >
//               Stop Recording
//             </button>
//           )}
//         </div>

//         {audioURL && (
//           <div className="mt-4 text-center flex w-full justify-between items-center">
//             {/* <h2 className="text-xs font-semibold flex-1">Your Voice Note</h2> */}
//             <audio controls className="w-full mt-2 flex-1">
//               <source src={audioURL} type="audio/wav" />
//               Your browser does not support the audio element.
//             </audio>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResponseFile;

import { useUploadResponseFileMutation } from "@/services/survey.service";
import React, { useState, useRef } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { toast } from "react-toastify";

const ResponseFile = ({
  question,
  handleAnswerChange,
  selectedValue,
  required,
}: {
  question: string;
  handleAnswerChange: (key: string, value: any) => void;
  selectedValue: string;
  required: boolean;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudio, setIsAudio] = useState(true);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // For upload status
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [uploadResponseFile] = useUploadResponseFileMutation();

  // Start Recording
  // const handleStartRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;

  //     mediaRecorder.ondataavailable = (event) => {
  //       audioChunksRef.current.push(event.data);
  //     };

  //     mediaRecorder.onstop = async () => {
  //       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
  //       setAudioURL(URL.createObjectURL(audioBlob));
  //       await uploadFile(audioBlob);
  //       audioChunksRef.current = [];
  //     };

  //     mediaRecorder.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     toast.error("Microphone access denied or not available.");
  //   }
  // };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
  
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
  
      mediaRecorder.onstop = async () => {
        const fileName = `audio_${Date.now()}.wav`; // Generate a unique filename
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
  
        // Convert Blob to File
        const audioFile = new File([audioBlob], fileName, { type: "audio/wav" });
  
        // Optionally, create a URL for playback
        setAudioURL(URL.createObjectURL(audioFile));
  
        // Upload the raw File object
        await uploadFile(audioFile);
  
        // Clear audio chunks
        audioChunksRef.current = [];
      };
  
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied or not available.");
    }
  };
  

  // Stop Recording
  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  // Upload File
  const uploadFile = async (file: Blob | File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadResponseFile(formData).unwrap();
      console.log(response)
      const mediaUrl = response?.data?.media_url; 
      if (mediaUrl) {
        handleAnswerChange(question, { media_url: mediaUrl });
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Failed to get media URL from the server.");
      }
    } catch (error) {
      toast.error("Failed to upload the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-1">

      {uploading && <p className="text-gray-500 text-sm">Uploading...</p>}
    {
      isAudio ? (
        <>
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white"
          >
            <AiOutlineAudio className="inline-block mr-2" />
            Record
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white"
          >
            Stop Recording
          </button>
        )}
      </div>

      {audioURL && (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
        </>
      ) : (
        
        <input
          type="file"
          onChange={handleFileUpload}
          className="mb-4 text-sm file:rounded-md"
          required={required}
          disabled={uploading}
        />
      )
    }

    </div>
  );
};

export default ResponseFile;
