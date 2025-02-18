import { setName } from "@/redux/slices/name.slice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ThreeStepDropdown from "../filter/ThreeStepDropdown";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    paddingLeft: "1.3rem",
    border: "none",
    backgroundColor: "#fff",
    color: "#8A7575",
    outline: "none",
  }),
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

interface ResponseActionsProps {
  handleNext?: () => void;
  handlePrev?: () => void;
  setName?: () => void;
  deleteAResponse?: () => void;
  totalSurveys?: number;
  curerentSurvey?: number;
  respondent_data?: any[];
  valid_response?: number;
  invalid_response?: number;
  surveyData?: any;
  isLoading: boolean;
  isDeletingResponse: boolean;
}

const ResponseActions: React.FC<ResponseActionsProps> = ({
  totalSurveys,
  curerentSurvey,
  handleNext,
  handlePrev,
  respondent_data,
  valid_response,
  invalid_response,
  deleteAResponse,
  surveyData,
  isLoading,
  isDeletingResponse,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const name = useSelector((state: RootState) => state?.name?.name);
  const dispatch = useDispatch();

  const handleDelete = () => {
    deleteAResponse?.();
    setShowDeleteDialog(false);
  };

  const handleResetFilters = () => {
    dispatch(setName(""));
    setValue("");
  };

  return (
    <div className="grid gap-6 p-4 bg-white rounded-lg">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Navigation Controls */}
        <div className="flex items-center text-gray-500 min-w-[200px]">
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={handlePrev}
          >
            &lt;
          </button>
          <span className="font-semibold mx-2">Response</span>
          <span>{curerentSurvey}</span>
          <span className="mx-1">/</span>
          <span>{totalSurveys}</span>
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ThreeStepDropdown
              questions={surveyData?.answers}
              isLoading={isLoading}
            />
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? respondent_data?.find(
                      (respondent) => respondent.name === value
                    )?.name
                  : "Filter by name..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search name..." />
                <CommandEmpty>No name found.</CommandEmpty>
                <CommandList>
                  {Array.from(
                    new Set(respondent_data?.map((r) => r.name))
                  )?.map((name) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        dispatch(
                          setName(currentValue === value ? "" : currentValue)
                        );
                        setOpen(false);
                      }}
                      className=""
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        {/* Stats */}
        <div className="grid grid-cols-2 bg-white border border-gray-100 p-3 rounded-xl max-w-fit gap-4">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-gray-700 font-medium text-sm">Valid</span>
            <span className="bg-green-50 text-green-700 px-3 py-0.5 text-sm rounded-full font-semibold">
              {valid_response}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-gray-700 font-medium text-sm">Invalid</span>
            <span className="bg-red-50 text-red-700 px-3 py-0.5 text-sm rounded-full font-semibold">
              {invalid_response}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end gap-4">
          {name && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetFilters}
              className="w-fit gap-2 px-4"
              title="Reset all filters"
            >
              Clear name filter <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            disabled={isLoading || isDeletingResponse}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-x-2 group"
            onClick={() => setShowDeleteDialog(true)}
          >
            <span>Delete Response</span>
            <svg
              className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent
              className="z-[100000]"
              overlayClassName="z-[100000]"
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this response.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ResponseActions;
