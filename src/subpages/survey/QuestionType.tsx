import { GrFormCheckmark } from "react-icons/gr";
import { MdShortText } from "react-icons/md";
import { PiCaretUpDown, PiTextAlignLeftBold } from "react-icons/pi";
import { RxDotFilled } from "react-icons/rx";
import { RiToggleLine } from "react-icons/ri";

const QuestionType = () => {
  return (
    <div className="style-editor bg-white h-full flex flex-col ">
      <div className="border-b py-4">
        <h2 className="px-10 font-bold">Question Type</h2>
      </div>
      <div className="flex flex-col items-center gap-7 py-7 px-10">
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <input type="radio" name="questionType" value="single-choice" className="border-4" />
          <label className="font-normal">Single Choice</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="border-2 border-black">
            <GrFormCheckmark />
          </div>
          <label className="font-normal">Multiple Choice</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
            <PiCaretUpDown size={25} />
          </div>
          <label className="font-normal">Dropdown (one answer)</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
            <RiToggleLine size={25} />
          </div>
          <label className="font-normal">Boolean (Yes/No)</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
            <MdShortText size={25} />
          </div>
          <label className="font-normal">Short text</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
            <PiTextAlignLeftBold size={25} />
          </div>
          <label className="font-normal">Long text</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} />
          </div>
          <label className="font-normal">Slider</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Upload Media</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Linkert Scale</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Rating Scale</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Star Rating</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Matrix Multiple Choice</label>
        </div>
        <div className="flex w-full gap-2 items-center font-normal text-[1rem]">
          <div className="">
          <RxDotFilled size={25} className="invisible" />
          </div>
          <label className="font-normal">Matrix Checkbox</label>
        </div>
      </div>
    </div>
  );
};

export default QuestionType;
