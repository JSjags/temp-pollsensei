// components/SenseiMaster.tsx

import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
// import { RiveComponent } from '@rive-app/react-canvas-lite';
import { useRive } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button"; // Your custom button component
import { cn } from "@/lib/utils";
import PollProfessor from "../ai/PollProfessor";
import SenseiMasterChat from "../ai/SenseiMasterChat";

const SenseiMaster = () => {
  const [count, setCount] = useState<number>(0);
  const [animationState, setAnimationState] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/pollsensei_master.riv",
    stateMachines: "sensei-states",
    autoplay: true,
    onStateChange: (state) => {
      setAnimationState(state.data);
    },
  });

  // Toggle collapse/expand state
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const toggleStates = () => {
    if (rive) {
      const statesLength = rive?.animationNames.length;
      if (count >= statesLength - 1) {
        setCount(0);
      } else {
        setCount((prev) => prev + 1);
      }
    }
  };

  const senseiStateSetter = (
    state: "sleep" | "be idle" | "start talking" | "stop talking"
  ) => {
    if (rive) {
      if (state === "sleep") {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "sleep");
        trigger?.fire();
      }
      if (state === "be idle") {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "be idle");
        trigger?.fire();
      }
      if (state === "start talking") {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "start talking");
        trigger?.fire();
      }
      if (state === "stop talking") {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "stop talking");
        trigger?.fire();
      }
    }
  };

  useEffect(() => {
    if (rive) {
      const statesLength = rive?.animationNames.length;
      if (count >= statesLength) {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "sleep");
        trigger?.fire();
      } else {
        const inputs = rive?.stateMachineInputs("sensei-states");
        if (count === 0) {
          const trigger = inputs.find((i) => i.name === "stop talking");

          trigger!.fire();
          if (animationState) {
            setTimeout(() => {
              const trigger = inputs.find((i) => i.name === "sleep");
              trigger!.fire();
            }, 10000);
          }
        }
        if (count === 1) {
          const trigger = inputs.find((i) => i.name === "be idle");
          console.log(trigger);

          trigger!.fire();
        }
        if (count === 2) {
          const trigger = inputs.find((i) => i.name === "start talking");
          console.log(trigger);
          trigger!.fire();
        }
      }
    }
  }, [count, rive]);

  return (
    <div className="relative z-[10000000]">
      <Draggable
        // bounds="" // Limit dragging to parent (viewport if used in the layout)
        defaultPosition={{
          x: window.innerWidth - 100,
          y: window.innerHeight - 500,
        }}
        bounds={{
          top: 0,
          left: 0,
          right: window.innerWidth - 100,
          bottom: 600,
        }}
      >
        <div
          className={cn(
            `fixed z-50 shadow-none bg-transparent rounded-full
          transition-all duration-300`,
            isCollapsed
              ? "size-24"
              : "w-[300px] h-[calc(100vh-100px)] rounded-md"
          )}
          style={{
            willChange: "transform",
          }}
        >
          {/* Header with Rive Animation and Collapse Button */}
          <div className="flex items-center justify-between bg-transparent cursor-move w-fit h-fit relative">
            <div
              className={cn(
                "rive-animation size-24 max-w-24 max-h-24 transition-all bg-white rounded-full shadow-lg",
                !isCollapsed
                  ? "absolute top-[calc(40vh-30px)] -right-[420px] -translate-y-1/2 transition-all"
                  : "transition-all"
              )}
            >
              <RiveComponent
                onClick={() => {
                  if (!isCollapsed) return;
                  setIsCollapsed(!isCollapsed);
                }}
                className="absolute inset-0 size-[90%] object-cover rounded-full cursor-pointer flex justify-center items-center mx-auto"
                //   onMouseEnter={() => rive && rive.play()}
                //   onMouseLeave={() => rive && rive.pause()}
              />
            </div>
            <Button
              onClick={toggleStates}
              className="ml-auto w-fit bg-blue-500 h-6 auth-btn text-white px-2 py-1 rounded-full absolute -bottom-8 left-0 !text-xs"
            >
              {animationState}
            </Button>
          </div>

          {/* Chat Box Content (shown if not collapsed) */}
          {!isCollapsed && (
            <div className="chat-content overflow-auto h-[calc(80%-60px)] shadow-lg rounded-md relative bg-white">
              <SenseiMasterChat
                isOpen={isCollapsed}
                setIsOpen={setIsCollapsed}
                senseiStateSetter={senseiStateSetter}
              />
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default SenseiMaster;
