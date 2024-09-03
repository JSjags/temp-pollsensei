import { FaRocket } from "react-icons/fa";
import KickStart from "./KickStart";
import Image from "next/image";
import {
  kickstart_Y,
  chatbot,
  assign_role,
  design,
  Collect_data,
  analyse_survey,
  // collect_data_,
} from "@/assets/images";

const Milestone = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto mt-10 relative">
      <div className="flex items-center w-full relative">
        <KickStart progress={'25%'} icon={<FaRocket className="text-purple-500" />} />
        <Image src={kickstart_Y} alt="Logo" className="h-20 w-auto" />
        <div className="border-dashed flex flex-col gap-2 border-2 border-red-700 rounded-lg p-8 relative">
          <button className="border-2 rounded-md py-1 px-2 border-[#CC9BFD] flex items-center gap-2">
            <Image src={chatbot} alt="Logo" className="h-8 w-auto" />
            <p>Generate with AI</p>
          </button>
          <button className="border-2 rounded-md py-1 px-2 border-[#CC9BFD] flex items-center gap-2">
            <Image src={chatbot} alt="Logo" className="h-8 w-auto" />
            <p>Create Manually</p>
          </button>

          <div className="rounded-xl flex justify-center items-center -top-3 left-1/3 bg-white absolute">
            <p>Design Survey</p>
            <Image src={design} alt="Logo" className="h-6 w-auto" />
          </div>
        </div>

        <Image src={assign_role} alt="Logo" className="h-20 w-auto" />
        <div className="rounded-xl flex justify-center items-center py-2 p-3 bg-white ">
          <p>Assign Roles</p>
        </div>
        <KickStart progress={'50%'} icon={<FaRocket className="text-purple-500" />} />
        <Image
          src={Collect_data}
          alt="Logo"
          className="h-36 absolute right-32 top-20 w-auto"
        />
      </div>
      <div className="flex items-center w-full relative ">
        <Image src={analyse_survey} alt="Logo" className="h-24 w-auto mt-20" />
        <div className="rounded-xl flex justify-center items-center py-2 p-3 bg-white ">
          <p>Validate Response</p>
        </div>
        <KickStart progress={'75%'} icon={<FaRocket className="text-purple-500" />} />
        {/* <Image src={collect_data_} alt="Logo" className="h-24 w-auto mt-20" /> */}
      </div>
    </div>
  );
};

export default Milestone;
