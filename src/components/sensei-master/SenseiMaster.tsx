// components/SenseiMaster.tsx

import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
// import { RiveComponent } from '@rive-app/react-canvas-lite';
import { useRive } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button"; // Your custom button component
import { cn } from "@/lib/utils";

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
            isCollapsed ? "size-24" : "w-[300px] h-[400px] rounded-md"
          )}
          style={{
            willChange: "transform",
          }}
        >
          {/* Header with Rive Animation and Collapse Button */}
          <div className="flex items-center justify-between bg-transparent cursor-move w-fit h-fit bg-white">
            <div className="rive-animation w-full h-full bg-white">
              <RiveComponent
                className="absolute inset-0 w-full h-full object-cover shadow-none bg-white rounded-full"
                //   onMouseEnter={() => rive && rive.play()}
                //   onMouseLeave={() => rive && rive.pause()}
              />
            </div>
            <Button
              onClick={toggleStates}
              className="ml-auto bg-blue-500 h-6 auth-btn text-white px-2 py-1 rounded-full absolute -bottom-8 left-0 w-full !text-xs"
            >
              {animationState}
            </Button>
          </div>

          {/* Chat Box Content (shown if not collapsed) */}
          {!isCollapsed && (
            <div className="chat-content p-3 overflow-auto h-[calc(100%-60px)]">
              <div className="chat-message">Welcome to the chat!</div>
              {/* Add your chat messages and input field here */}
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default SenseiMaster;
