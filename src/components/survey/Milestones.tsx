import React, { useCallback, useMemo, useState } from "react";
import {
  addEdge,
  Controls,
  Edge,
  Handle,
  Node,
  PanOnScrollMode,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
} from "@xyflow/react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import "@xyflow/react/dist/style.css";
import { FaUserCheck } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";
import CustomEdge from "../milestone/customEdge";
import { useRouter } from "next/navigation";

// icons paths
const start = "/assets/milestones/Start.svg";
const design = "/assets/milestones/Design.svg";
const ai = "/assets/milestones/chatbot.svg";
const manual = "/assets/milestones/Survey.svg";
const admin = "/assets/milestones/admin.svg";
const money = "/assets/milestones/money.svg";
const share = "/assets/milestones/Share.svg";
const validate = "/assets/milestones/validate.svg";
const analyze = "/assets/milestones/Analysis.svg";
const report = "/assets/milestones/Report.svg";
const close = "/assets/milestones/Finish flag.svg";

const edgeTypes = {
  "custom-edge": CustomEdge,
};

export default function Milestones({
  stage,
  onClick,
  surveyId = "",
  generated_by,
  survey_type,
}: {
  stage: string;
  onClick?: () => void;
  surveyId?: string;
  generated_by?: "manually" | "ai";
  survey_type?: "both" | "qualitative" | "quantitative";
}) {
  const router = useRouter();
  const [currentStage] = useState(parseInt(stage) + 1);

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "customNode",
      data: {
        progress: 20,
        icon: start,
      },
      position: { x: 0, y: 82 },
      sourcePosition: Position.Right,
    },
    {
      id: "2",
      type: "customNode",
      data: {
        label: "Design Survey",
        options: ["Generate with AI", "Create Manually"],
      },
      position: { x: 200, y: 34 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        strokeDasharray: currentStage <= 2 ? 10 : 0,
      },
    },
    {
      id: "3",
      type: "customNode",
      data: { label: "Assign Roles", icon: FaUserCheck, progress: 35 },
      position: { x: 850, y: 82 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "4",
      type: "customNode",
      data: {
        label: "Collect Data",
        options: ["Buy Respondents", "Share Survey"],
      },
      position: { x: 1250, y: 255 },
      sourcePosition: Position.Left,
      targetPosition: Position.Top,
      style: {
        strokeDasharray: currentStage <= 4 ? 10 : 0,
      },
    },
    {
      id: "5",
      type: "customNode",
      data: { label: "Validate Response", icon: FaCheckCircle, progress: 65 },
      position: { x: 750, y: 302 },
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
    },
    {
      id: "6",
      type: "customNode",
      data: {
        label: "Analyze Survey",
        options: ["Qualitative Analysis", "Quantitative Analysis"],
      },
      position: { x: 0, y: 500 },
      sourcePosition: Position.Right,
      targetPosition: Position.Top,
      style: {
        strokeDasharray: currentStage <= 6 ? 10 : 0,
      },
    },
    {
      id: "7",
      type: "customNode",
      data: { label: "Generate Report", icon: FaCheckCircle, progress: 100 },
      position: { x: 700, y: 550 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "8",
      type: "customNode",
      data: { label: "Close Survey", icon: FaCheckCircle },
      position: { x: 1300, y: 550 },
      targetPosition: Position.Left,
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      style: {
        stroke: currentStage <= 1 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 1 ? 10 : 0,
      },
      animated: currentStage <= 1,
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      style: {
        stroke: currentStage <= 2 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 2 ? 10 : 0,
      },
      animated: currentStage <= 2,
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      style: {
        stroke: currentStage <= 3 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 3 ? 10 : 0,
      },
      type: "custom-edge",
      animated: currentStage <= 3,
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      style: {
        stroke: currentStage <= 4 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 4 ? 10 : 0,
      },
      type: "step",
      animated: currentStage <= 4,
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      style: {
        stroke: currentStage <= 5 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 5 ? 10 : 0,
      },
      type: "custom-edge",
      animated: currentStage <= 5,
    },
    {
      id: "e6-7",
      source: "6",
      target: "7",
      style: {
        stroke: currentStage <= 6 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 6 ? 10 : 0,
      },
      animated: currentStage <= 6,
    },
    {
      id: "e7-8",
      source: "7",
      target: "8",
      style: {
        stroke: currentStage <= 7 ? "#9C27B040" : "#9C27B0",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeDasharray: currentStage <= 7 ? 10 : 0,
      },
      animated: currentStage <= 7,
    },
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const CustomNode = ({ data, id }: { data: any; id: string }) => {
    const handleLabelPosition = useCallback((label: string) => {
      if (label === "Design Survey") {
        return cn(
          "-translate-y-8 bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute z-[100]"
        );
      }
      if (label === "Assign Roles") {
        return cn(
          "-translate-x-[210px] translate-y-3 h-[60px] flex items-center bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
      if (label === "Collect Data") {
        return cn(
          "-translate-y-8 bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
      if (label === "Validate Response") {
        return cn(
          "-translate-x-[260px] translate-y-3 h-[60px] flex items-center bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
      if (label === "Analyze Survey") {
        return cn(
          "-translate-y-8 bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
      if (label === "Generate Report") {
        return cn(
          "translate-x-[45px] translate-y-3 h-[60px] flex items-center bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
      if (label === "Close Survey") {
        return cn(
          "-translate-x-[36px] translate-y-2 h-[60px] flex items-center bg-white shadow-lg shadow-[#EB06AB12] p-2 px-8 rounded-full whitespace-nowrap absolute"
        );
      }
    }, []);

    const handleIcon = (id: string) => {
      switch (id) {
        case "1":
          return (
            <img
              src={start}
              className={cn(
                "size-16 hover:scale-125  transition-all",
                currentStage >= parseInt(id)
                  ? "opacity-100 hover:animate-pulse"
                  : "opacity-40"
              )}
            />
          );
        case "3":
          return (
            <img
              src={admin}
              className={cn(
                "size-10 hover:scale-125  transition-all",
                currentStage >= parseInt(id)
                  ? "opacity-100 hover:animate-pulse"
                  : "opacity-40"
              )}
            />
          );
        case "5":
          return (
            <img
              src={validate}
              className={cn(
                "size-10 hover:scale-125  transition-all",
                currentStage >= parseInt(id)
                  ? "opacity-100 hover:animate-pulse"
                  : "opacity-40"
              )}
            />
          );
        case "7":
          return (
            <img
              src={report}
              className={cn(
                "size-10 hover:scale-125  transition-all",
                currentStage >= parseInt(id)
                  ? "opacity-100 hover:animate-pulse"
                  : "opacity-40"
              )}
            />
          );
        case "8":
          return (
            <img
              src={close}
              className={cn(
                "size-20 hover:scale-125  transition-all -translate-y-14 translate-x-12",
                currentStage >= parseInt(id)
                  ? "opacity-100 hover:animate-pulse"
                  : "opacity-40"
              )}
            />
          );

        default:
          return null;
      }
    };
    const handleLabelIcon = (id: string, label: string) => {
      if (id === "2") {
        switch (label) {
          case "Design Survey":
            return (
              <img
                src={design}
                className={cn(
                  "size-5",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              />
            );
          case "Generate with AI":
            return (
              <img
                src={ai}
                className={cn(
                  "size-5",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              />
            );
          case "Create Manually":
            return (
              <img
                src={manual}
                className={cn(
                  "size-5",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              />
            );
          default:
            return null;
        }
      }
      if (id === "4") {
        switch (label) {
          case "Buy Respondents":
            return (
              <img
                src={money}
                className={cn(
                  "size-5",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              />
            );
          case "Share Survey":
            return (
              <img
                src={share}
                className={cn(
                  "size-5",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              />
            );
          default:
            return null;
        }
      }
      if (id === "6") {
        switch (label) {
          case "Analyze Survey":
            return <img src={analyze} className="size-5" />;
          default:
            return null;
        }
      }

      // id === "8" ? (
      //     <data.icon
      //       style={{ color: "#4A148C", fontSize: "1.5em" }}
      //       className={"-translate-y-12 translate-x-16"}
      //     />
      //   ) : (
      //
      //   )
    };

    const handleAction = (id: string, label: string) => {
      if (id === "1") {
        router.push("/surveys/create-survey");
      }
      if (id === "2") {
        if (label === "Design Survey") {
          router.push(`/surveys/question/${surveyId}`);
          // alert(label);
        }
        if (label === "Generate with AI") {
          // router.push("/surveys/create-survey");
          // alert(label);
        }
        if (label === "Create Manually") {
          // router.push("/surveys/create-survey");
          // alert(label);
        }
      }
      if (id === "3") {
        if (label === "Assign Roles") {
          router.push("/team-members");
          // alert(label);
        }
      }
      if (id === "4") {
        if (label === "Collect Data") {
          router.push(`surveys/${surveyId}/survey-reponse-upload`);
          // alert(label);
        }
        if (label === "Buy Respondents") {
          // alert(label);
        }
        if (label === "Share Survey") {
          router.push(`/surveys/question/${surveyId}`);
        }
      }
      if (id === "5") {
        if (label === "Validate Response") {
          router.push(`/surveys/${surveyId}/validate-response`);
          // alert(label);
        }
      }
      if (id === "6") {
        if (label === "Analyze Survey") {
          router.push(`/surveys/${surveyId}/analysis`);
          // alert(label);
        }
        if (label === "Qualitative Analysis") {
          // alert(label);
        }
        if (label === "Quantitative Analysis") {
          // router.push("/surveys/create-survey");
          // alert(label);
        }
      }
      if (id === "7") {
        if (label === "Generate Report") {
          // router.push("/surveys/create-survey");
          // alert(label);
        }
      }
      if (id === "8") {
        if (label === "Close Survey") {
          // router.push("/surveys/create-survey");
          // alert(label);
        }
      }
    };

    return (
      <div
        style={{
          border: data.options ? "2px dashed #EB06AB" : "",
          borderStyle:
            currentStage === parseInt(id)
              ? "dashed"
              : currentStage >= parseInt(id)
              ? "dashed"
              : "solid",
          borderRadius: "8px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
        }}
        className={cn(
          "relative",
          ["1", "3", "5", "7", "8"].includes(id)
            ? "transparent p-0"
            : "bg-white p-[10px]"
        )}
      >
        <div
          style={{ fontWeight: "bold", marginBottom: "8px" }}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white z-10",
            currentStage === parseInt(id) &&
              currentStage !== 1 &&
              "border-4  border-[#9C27B0] hover:bg-[#fbe5ff] transition-all",
            handleLabelPosition(data.label)
          )}
          onClick={() =>
            // currentStage === parseInt(id)
            //   ? handleAction(id, data.label)
            //   : () => {}
            {
              if (Number(id) <= Number(stage)) handleAction(id, data.label);
            }
          }
        >
          <span
            className={cn(
              currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
            )}
          >
            {data.label}
          </span>
          {handleLabelIcon(id, data.label)}
        </div>
        {data.progress !== undefined ? (
          <div
            style={{
              boxShadow: "0 0 0 10px #5B03B210, 0 0 0 20px #5B03B205",
            }}
            className="rounded-full"
            onClick={() =>
              // currentStage === parseInt(id)
              //   ? handleAction(id, data.label)
              //   : () => {}
              {
                if (Number(id) <= Number(stage)) handleAction(id, data.label);
              }
            }
          >
            {data.icon ? (
              <CircularProgressbarWithChildren
                className={cn(
                  "size-20",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
                value={data.progress}
                //   text={`${data.progress}%`}
                strokeWidth={12}
                styles={buildStyles({
                  textColor: "#4A148C",
                  trailColor: "#F5EBFF",
                  pathColor: "#5B03B2",
                  strokeLinecap: "round",
                  pathTransition: "0.5s",
                  // boxShadow: "0 0 10px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.2)",
                })}
              >
                {handleIcon(id)}
              </CircularProgressbarWithChildren>
            ) : (
              <CircularProgressbar
                className={cn(
                  "size-20",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
                value={data.progress}
                text={`${data.progress}%`}
                strokeWidth={12}
                styles={buildStyles({
                  textColor: "#4A148C",
                  trailColor: "#F5EBFF",
                  pathColor: "#5B03B2",
                  strokeLinecap: "round",
                  pathTransition: "0.5s",
                  // boxShadow: "0 0 10px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.2)",
                })}
              />
            )}
          </div>
        ) : data.icon ? (
          handleIcon(id)
        ) : null}
        <div className="mt-5">
          {data.options?.map((option: string, index: number) => (
            <button
              key={index}
              style={{
                marginTop: 10,
                padding: 5,
                cursor: "pointer",
              }}
              className={cn(
                "border-2 border-[#CC9BFD] hover:border-[#9C27B0] hover:bg-[#9C27B010] transition-all bg-white h-[60px] min-w-[240px] rounded-lg gap-4 flex justify-center items-center",
                Number(stage) >= 2 &&
                  generated_by &&
                  option.toLowerCase().includes(generated_by?.toLowerCase()) &&
                  "border-[#9C27B0] border-[3px]",
                Number(stage) >= 5 &&
                  data.label.toLowerCase() === "analyze survey" &&
                  survey_type &&
                  (survey_type.toLowerCase() === "both" ||
                    option
                      .toLowerCase()
                      .includes(survey_type?.toLowerCase())) &&
                  "border-[#9C27B0] border-[3px] cursor-not-allowed hover:bg-white hover:border-[#9C27B0]",
                option.toLowerCase().includes("ai") &&
                  "cursor-not-allowed hover:bg-white hover:border-[#CC9BFD]",
                option.toLowerCase().includes("manual") &&
                  "cursor-not-allowed hover:bg-white hover:border-[#CC9BFD]",
                option.toLowerCase().includes("respondents") &&
                  "cursor-not-allowed opacity-35 hover:border-[#CC9BFD] hover:bg-white",
                option.toLowerCase().includes("qualitative") &&
                  "cursor-not-allowed hover:bg-white hover:border-[#CC9BFD]",
                option.toLowerCase().includes("quantitative") &&
                  "cursor-not-allowed hover:bg-white hover:border-[#CC9BFD]"
              )}
              onClick={() => {
                // currentStage === parseInt(id)
                //   ? handleAction(id, option)
                //   : () => {};
                if (Number(id) - 1 <= Number(stage)) handleAction(id, option);
              }}
            >
              {handleLabelIcon(id, option)}
              <span
                className={cn(
                  "font-medium",
                  currentStage >= parseInt(id) ? "opacity-100" : "opacity-40"
                )}
              >
                {option}
              </span>
            </button>
          ))}
        </div>

        {["1"].includes(id) && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["2", "3", "7"].includes(id) && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["2", "3", "7"].includes(id) && (
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: "#9C27B0" }}
          />
        )}

        {["4"].includes(id) && (
          <Handle
            type="source"
            position={Position.Left}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["4"].includes(id) && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["5"].includes(id) && (
          <Handle
            type="source"
            position={Position.Left}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["5"].includes(id) && (
          <Handle
            type="target"
            position={Position.Right}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["6"].includes(id) && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["6"].includes(id) && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["7"].includes(id) && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["7"].includes(id) && (
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: "#9C27B0" }}
          />
        )}
        {["8"].includes(id) && (
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: "#9C27B0" }}
          />
        )}
      </div>
    );
  };

  const onConnect = useCallback(
    (connection: any) => {
      const edge = { ...connection, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const nodeTypes = {
    customNode: CustomNode,
  };

  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          fitView
          panOnScroll={true}
          panOnScrollMode={PanOnScrollMode.Vertical}
        />
        <Controls />
      </ReactFlowProvider>
    </div>
  );
}

function nodeColor(node: any) {
  switch (node.type) {
    case "input":
      return "#6ede87";
    case "output":
      return "#6865A5";
    default:
      return "#ff0072";
  }
}
