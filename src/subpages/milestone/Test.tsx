import {
  FaRocket,
  FaCogs,
  FaTrophy,
  FaClipboard,
  FaFlagCheckered,
} from "react-icons/fa";
import {
  AiOutlineAppstoreAdd,
  AiOutlineUserAdd,
  AiOutlineLineChart,
} from "react-icons/ai";
import { ReactNode } from "react";
import KickStart from "./KickStart";

interface MilestoneProps {
  icon: ReactNode;
  title: string;
  subItems?: string[] | undefined;
}

const Milestone = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-10">
     <KickStart progress="30%"  icon={<FaRocket className="text-purple-500" />} />
      <div className="relative flex justify-between w-full">
        <div className="absolute top-1/2 w-full h-0.5 bg-purple-300"></div>
        <MilestoneItem
          icon={<FaRocket className="text-purple-500" />}
          title="Design Survey"
          subItems={["Generate with AI", "Create Manually"]}
        />
        <MilestoneItem
          icon={<FaCogs className="text-purple-500" />}
          title="Assign Roles"
        />
        <MilestoneItem
          icon={<AiOutlineAppstoreAdd className="text-purple-500" />}
          title="Collect Data"
          subItems={["Buy Respondents", "Share Survey"]}
        />
        <MilestoneItem
          icon={<FaTrophy className="text-purple-500" />}
          title="Validate Response"
        />
        <MilestoneItem
          icon={<AiOutlineLineChart className="text-purple-500" />}
          title="Analyze Survey"
          subItems={["Qualitative Analysis", "Quantitative Analysis"]}
        />
        <MilestoneItem
          icon={<FaClipboard className="text-purple-500" />}
          title="Generate Report"
        />
        <MilestoneItem
          icon={<FaFlagCheckered className="text-purple-500" />}
          title="Close Survey"
        />
      </div>
    </div>
  );
};

const MilestoneItem: React.FC<MilestoneProps> = ({ icon, title, subItems }) => {
  return (
    <div className="relative flex flex-col items-center w-32 text-center space-y-2">
      <div className="relative p-1 bg-purple-200 rounded-full">
        <div className="relative p-1 bg-purple-100 rounded-full">
          <div className="relative p-4 bg-tranparent rounded-full">
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background: "conic-gradient(#5B03B2 0% 25%, #e5e5e5 25% 100%)",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
              }}
            />
            <div className="relative flex items-center justify-center w-full h-full">
              {icon}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
    </div>
  );
};

export default Milestone;
