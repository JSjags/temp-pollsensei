import React from "react";
import Image from "next/image";
import { sparkly } from "@/assets/images";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Input } from "../ui/shadcn-input";
import { Textarea } from "../ui/shadcn-textarea";

interface SurveyHeaderProps {
  logoUrl: string | File | null;
  headerUrl: string | File | null;
  survey: any;
  headerText: any;
  bodyText: any;
  onSave?: (headerText: any, bodyText: any) => void;
  isEdit?: boolean;
  canEdit?: boolean;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  logoUrl,
  headerUrl,
  survey,
  headerText,
  bodyText,
  onSave,
  isEdit: isEditProp = false,
  canEdit = false,
}) => {
  const [isEditing, setIsEditing] = React.useState(isEditProp);
  const [localHeaderText, setLocalHeaderText] = React.useState(headerText);
  const [localBodyText, setLocalBodyText] = React.useState(bodyText);

  React.useEffect(() => {
    setLocalHeaderText(headerText);
    setLocalBodyText(bodyText);
  }, [headerText, bodyText]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setLocalHeaderText(headerText);
    setLocalBodyText(bodyText);
  };
  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(localHeaderText, localBodyText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" w-full"
    >
      {logoUrl && !logoUrl.toString().startsWith("#") && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-r bg-white rounded-lg w-16 my-5 text-white flex items-center flex-col shadow-lg hover:shadow-xl transform"
        >
          <Image
            src={
              logoUrl instanceof File
                ? URL.createObjectURL(logoUrl)
                : typeof logoUrl === "string"
                ? logoUrl
                : sparkly
            }
            alt=""
            className="w-full object-cover rounded-lg bg-no-repeat h-16 transition-transform duration-300"
            width={100}
            height={200}
          />
        </motion.div>
      )}
      {headerUrl && !headerUrl.toString().startsWith("#") && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r bg-white rounded-lg w-full my-4 text-white h-24 flex items-center flex-col shadow-lg overflow-hidden"
        >
          <Image
            src={
              headerUrl instanceof File
                ? URL.createObjectURL(headerUrl)
                : typeof headerUrl === "string"
                ? headerUrl
                : sparkly
            }
            alt=""
            className="w-full object-cover bg-no-repeat h-24 rounded-lg transition-transform duration-300 hover:scale-105"
            width={100}
            height={200}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg w-full my-4 flex gap-2 px-4 md:px-6 py-6 flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "text-[1.5rem] font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent",
            `font-${(isEditing ? localHeaderText?.name : headerText?.name)
              ?.split(" ")
              ?.join("-")
              ?.toLowerCase()}`
          )}
          style={{
            fontSize: `${
              isEditing ? localHeaderText?.size : headerText?.size
            }px`,
          }}
        >
          {isEditing ? (
            <Input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-black"
              value={localHeaderText?.value || survey?.topic || ""}
              onChange={(e) =>
                setLocalHeaderText({
                  ...localHeaderText,
                  value: e.target.value,
                })
              }
            />
          ) : (
            localHeaderText?.value || survey?.topic
          )}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn(
            "text-gray-600 leading-relaxed",
            `font-${(isEditing ? localBodyText?.name : bodyText?.name)
              ?.split(" ")
              ?.join("-")
              ?.toLowerCase()}`
          )}
          style={{
            fontSize: `${isEditing ? localBodyText?.size : bodyText?.size}px`,
          }}
        >
          {isEditing ? (
            <Textarea
              className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-black"
              value={localBodyText?.value || survey?.description || ""}
              onChange={(e) =>
                setLocalBodyText({ ...localBodyText, value: e.target.value })
              }
              rows={3}
            />
          ) : (
            localBodyText?.value || survey?.description
          )}
        </motion.p>

        <div className="flex justify-end w-full mb-2">
          {canEdit && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-full text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors gap-1"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-purple-700 focus:ring-purple-500 transition-colors gap-1 text-white border-purple-500 hover:bg-purple-600 hover:text-white"
              >
                <Save className="w-3 h-3" />
                Save
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SurveyHeader;
