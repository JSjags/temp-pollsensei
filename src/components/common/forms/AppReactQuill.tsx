import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  quilValue: string;
  setQuilValue: React.Dispatch<React.SetStateAction<string>>;
}

const AppReactQuill = (props: Props): JSX.Element => {
  const { quilValue, setQuilValue } = props;

  return (
    <ReactQuill
      theme="snow"
      value={quilValue}
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
      }}
      formats={[
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
      ]}
      onChange={setQuilValue}
    >
      {/* <div className="bg-red-500 h-96 w-full" /> */}
    </ReactQuill>
  );
};

export default AppReactQuill;
