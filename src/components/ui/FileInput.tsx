// import React, { useState } from "react";
// import { Field, FieldRenderProps } from "react-final-form";
// import { cn } from "@/lib/utils";
// import { FaFileUpload } from "react-icons/fa";
// import { FormApi } from "final-form";

// interface FileInputProps {
//   name: string;
//   label?: string;
//   className?: string;
//   form: FormApi<any, Partial<any>>;
  
// }

// const FileInput: React.FC<FileInputProps> = ({ name, label, className, form }) => {
//   const [fileName, setFileName] = useState<string | null>(null);

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//       const file = event.dataTransfer.files[0];
//       setFileName(file.name);
//     }
//   };

//   const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };

//   return (
//     <div className={cn("flex flex-col items-center border-dashed border-2 border-gray-300 p-4 rounded-lg", className)}>
//       <Field name={name}>
//         {({ input }: FieldRenderProps<FileList>) => (
//           <div
//             onDrop={(event) => {
//               handleDrop(event);
//               input.onChange(event.dataTransfer.files); 
//             }}
//             onDragOver={preventDefaults}
//             onDragEnter={preventDefaults}
//             className="flex flex-col items-center justify-center w-full h-32 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg"
//           >
//             <div className="flex flex-col items-center">
//              <FaFileUpload />
//               <p className="text-gray-500 mt-2">{fileName || "Select a file or drag and drop here"}</p>
//               <p className="text-sm text-gray-400">MP4, MOV, MKV, file size no more than 50MB</p>
//             </div>
//             <input
//               {...input}
//               type="file"
//               id="fileUpload"
//               accept=".mp4, .mov, .mkv, .jpg, .jpeg, .png"
//               className="hidden"
//               onChange={(e) => {
//                 if (e.target.files?.length) {
//                   setFileName(e.target.files[0].name);
//                   input.onChange(e.target.files); // Update Field's value
//                 }
//               }}
//             />
//             <label htmlFor="fileUpload" className="border border-purple-800 py-1 px-4 rounded-full " >Select file</label>
//           </div>
//         )}
//       </Field>
//       {label && <small className="mt-2 text-gray-500">{label}</small>}
//       {form.getState().submitFailed && form.getState().errors?.[name] && (
//         <small className="text-red-600">
//           {form.getState().errors?.[name] ?? ""}
//         </small>
//       )}
//     </div>
//   );
// };

// export default FileInput;

import React, { useState } from "react";
import { Field, FieldRenderProps } from "react-final-form";
import { cn } from "@/lib/utils";
import { FaFileUpload } from "react-icons/fa";
import { FormApi } from "final-form";

interface FileInputProps {
  name: string;
  label?: string;
  className?: string;
  form: FormApi<any, Partial<any>>;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  className,
  form,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setFileName(file.name);
    }
  };

  const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center border-dashed border-2 border-gray-300 p-4 rounded-lg",
        className
      )}
    >
      <Field name={name}>
        {({ input }: FieldRenderProps<FileList>) => (
          <div
            onDrop={(event) => {
              handleDrop(event);
              input.onChange(event.dataTransfer.files); // Update Field's value
            }}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            className="flex flex-col items-center justify-center w-full h-32 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <div className="flex flex-col items-center">
              <FaFileUpload />
              <p className="text-gray-500 mt-2">
                {fileName || "Select a file or drag and drop here"}
              </p>
              <p className="text-sm text-gray-400">
                MP4, MOV, MKV, file size no more than 50MB
              </p>
            </div>
            <input
              type="file"
              id="fileUpload"
              accept=".mp4, .mov, .mkv, .jpg, .jpeg, .png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFileName(e.target.files[0].name); // Update displayed file name
                  input.onChange(e.target.files); // Update Field's value
                }
              }}
            />
            <label
              htmlFor="fileUpload"
              className="border border-purple-800 py-1 px-4 rounded-full"
            >
              Select file
            </label>
          </div>
        )}
      </Field>
      {label && <small className="mt-2 text-gray-500">{label}</small>}
      {form.getState().submitFailed &&
        form.getState().errors?.[name] && (
          <small className="text-red-600">
            {form.getState().errors?.[name] ?? ""}
          </small>
        )}
    </div>
  );
};

export default FileInput;
