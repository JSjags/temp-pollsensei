// "use client";
// // components/SenseiMaster.tsx

// import React, { useEffect, useMemo, useState } from "react";
// import Draggable from "react-draggable";
// // import { RiveComponent } from '@rive-app/react-canvas-lite';
// import { useRive } from "@rive-app/react-canvas";
// import { Button } from "@/components/ui/button"; // Your custom button component
// import { cn } from "@/lib/utils";
// import PollProfessor from "../ai/PollProfessor";
// import {
//   setCount,
//   setAnimationState,
//   toggleCollapse,
//   setIsPinned,
//   setIsDragging,
//   setStartPos,
//   setDefaultPosition,
//   setWindowWidth,
//   setWindowHeight,
//   setIsCollapsed,
// } from "@/redux/slices/sensei-master.slice";
// import SenseiMasterChat from "../ai/SenseiMasterChat";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// const defaultDraggablePosition = {
//   x: typeof window !== "undefined" ? window.innerWidth - 100 : 0, // Check if window is defined
//   y: typeof window !== "undefined" ? window.innerHeight - 500 : 0, // Check if window is defined
// };

// const SenseiMaster = () => {
//   const {
//     count,
//     animationState,
//     isCollapsed,
//     isPinned,
//     isDragging,
//     startPos,
//     defaultPosition,
//     windowWidth,
//     windowHeight,
//   } = useSelector((state: RootState) => {
//     return state.senseiMaster;
//   });

//   // Update window dimensions on resize
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Check if window is defined
//       const handleResize = () => {
//         setWindowWidth(window.innerWidth);
//         setWindowHeight(window.innerHeight);
//       };

//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, []);

//   // Calculate right and bottom bounds based on window size and component size
//   const rightBound = useMemo(
//     () => windowWidth - (isCollapsed ? 96 : 400),
//     [windowWidth, isCollapsed]
//   );
//   const bottomBound = useMemo(
//     () => windowHeight - (isCollapsed ? 226 : 600),
//     [windowHeight, isCollapsed]
//   );

//   const handleMouseDown = (event: React.MouseEvent) => {
//     // Capture the initial position when the mouse button is pressed
//     setStartPos({ x: event.clientX, y: event.clientY });
//     setIsDragging(false); // Reset dragging state
//   };

//   const handleMouseMove = (event: React.MouseEvent) => {
//     // Calculate the distance the mouse has moved since the mouse was pressed down
//     const distanceMoved = Math.sqrt(
//       Math.pow(event.clientX - startPos?.x, 2) +
//         Math.pow(event.clientY - startPos?.y, 2)
//     );

//     // If the distance moved is greater than a threshold (e.g., 5px), consider it a drag
//     if (distanceMoved > 5) {
//       setIsDragging(true);
//     }
//   };

//   const handleMouseUp = (event: React.MouseEvent) => {
//     // Only toggle collapse if no dragging occurred
//     setDefaultPosition({
//       x: event.clientX - (isCollapsed ? 40 : 40),
//       y:
//         event.clientY -
//         (isCollapsed
//           ? 150
//           : event.clientY - 150 > windowHeight - 600
//           ? 100
//           : 150),
//     });
//     if (!isDragging) {
//       if (!isCollapsed) return;
//       setIsCollapsed(!isCollapsed);
//     }
//   };

//   const handleChatOpenMouseDown = (event: React.MouseEvent) => {
//     // Capture the initial position when the mouse button is pressed
//     setStartPos({ x: event.clientX, y: event.clientY });
//     setIsDragging(false); // Reset dragging state
//   };

//   const handleChatOpenMouseMove = (event: React.MouseEvent) => {
//     // Calculate the distance the mouse has moved since the mouse was pressed down
//     const distanceMoved = Math.sqrt(
//       Math.pow(event.clientX - startPos?.x, 2) +
//         Math.pow(event.clientY - startPos?.y, 2)
//     );

//     // If the distance moved is greater than a threshold (e.g., 5px), consider it a drag
//     if (distanceMoved > 5) {
//       setIsDragging(true);
//     }
//   };

//   const handleChatOpenMouseUp = (event: React.MouseEvent) => {
//     // Only toggle collapse if no dragging occurred
//     setDefaultPosition({
//       x: event.clientX - (isCollapsed ? 40 : 40),
//       y:
//         event.clientY -
//         (isCollapsed
//           ? 150
//           : event.clientY - 150 > windowHeight - 600
//           ? 100
//           : 150),
//     });
//     if (!isDragging) {
//       if (!isCollapsed) return;
//       setIsCollapsed(!isCollapsed);
//     }
//   };

//   const { rive, RiveComponent } = useRive({
//     src: "/assets/rive/pollsensei_master.riv",
//     stateMachines: "sensei-states",
//     autoplay: true,
//     onStateChange: (state) => {
//       console.log(state.data);

//       setAnimationState(state.data);
//     },
//   });

//   console.log(animationState);

//   // Toggle collapse/expand state
//   const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//   const toggleStates = (stage?: number) => {
//     if (rive) {
//       const statesLength = rive?.animationNames.length;
//       setAnimationState(animationState === "idle" ? "chat" : "idle");
//       if (count >= statesLength - 1) {
//         setCount(stage ?? 1);
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "stop talking");
//         console.log(trigger);

//         trigger!.fire();
//       } else {
//         setCount(count + 1);
//       }
//     }
//   };

//   const senseiStateSetter = (
//     state:
//       | "sleep"
//       | "be idle"
//       | "start thinking"
//       | "start talking"
//       | "stop talking"
//   ) => {
//     if (rive) {
//       if (state === "sleep") {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "sleep");
//         trigger?.fire();
//       }
//       if (state === "be idle") {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "be idle");
//         trigger?.fire();
//       }
//       if (state === "start thinking") {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "start thinking");
//         trigger?.fire();
//       }
//       if (state === "start talking") {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "start talking");
//         trigger?.fire();
//       }
//       if (state === "stop talking") {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "stop talking");
//         trigger?.fire();
//       }
//     }
//   };

//   const pinToSide = () => {
//     console.log(defaultDraggablePosition);
//     console.log(defaultPosition);

//     setDefaultPosition(defaultDraggablePosition);
//     setIsPinned(true);
//   };

//   useEffect(() => {
//     if (rive) {
//       const statesLength = rive?.animationNames.length;

//       console.log(statesLength);
//       console.log(count);

//       if (count >= statesLength) {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         const trigger = inputs.find((i) => i.name === "sleep");
//         trigger?.fire();
//       } else {
//         const inputs = rive?.stateMachineInputs("sensei-states");
//         console.log(inputs);

//         if (count === 0) {
//           const trigger = inputs.find((i) => i.name === "sleep");
//           trigger!.fire();
//           if (animationState) {
//             setTimeout(() => {
//               const trigger = inputs.find((i) => i.name === "sleep");
//               trigger!.fire();
//             }, 10000);
//           }
//         }
//         if (count === 1) {
//           const trigger = inputs.find((i) => i.name === "be idle");
//           console.log(trigger);

//           trigger!.fire();
//         }
//         if (count === 2) {
//           const trigger = inputs.find((i) => i.name === "start thinking");
//           console.log(trigger);
//           trigger!.fire();
//         }
//         if (count === 3) {
//           const trigger = inputs.find((i) => i.name === "start talking");
//           console.log(trigger);
//           trigger!.fire();
//         }
//       }
//     }
//   }, [count, rive]);

//   return (
//     <Draggable
//       // defaultPosition={defaultPosition}
//       // position={defaultPosition}
//       // bounds={{
//       //   top: 0,
//       //   left: 0,
//       //   right: rightBound,
//       //   bottom: bottomBound,
//       // }}
//       // bounds={}
//       allowAnyClick={false}
//     >
//       <div
//         className={cn(
//           `fixed z-50 shadow-none bg-transparent rounded-full transition-all duration-300`,
//           isCollapsed ? "size-24" : "w-[300px] h-[calc(100vh-100px)] rounded-md"
//         )}
//         style={{
//           willChange: "transform",
//         }}
//       >
//         {/* Header with Rive Animation and Collapse Button */}
//         <div className="flex items-center justify-between bg-transparent cursor-move w-fit h-fit relative">
//           <div
//             className={cn(
//               "rive-animation size-24 max-w-24 max-h-24 transition-all rounded-full",
//               !isCollapsed
//                 ? "absolute top-[calc(40vh-30px)] -right-[420px] -translate-y-1/2 transition-all"
//                 : "transition-all"
//             )}
//           >
//             <RiveComponent
//               className="absolute inset-0 size-[90%] object-cover rounded-full cursor-pointer flex justify-center items-center mx-auto"
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//             />
//           </div>
//           <Button
//             onClick={() => {
//               toggleStates();
//             }}
//             className="ml-auto w-fit bg-blue-500 h-6 auth-btn text-white px-2 py-1 rounded-full absolute -bottom-8 left-0 !text-xs"
//           >
//             {animationState}
//           </Button>
//         </div>

//         {/* Chat Box Content (shown if not collapsed) */}
//         <div
//           className={cn(
//             "chat-content overflow-auto h-[calc(80%-60px)] shadow-lg rounded-md relative bg-white",
//             !isCollapsed ? "block" : "hidden"
//           )}
//           // onMouseDown={handleChatOpenMouseDown}
//           // onMouseMove={handleChatOpenMouseMove}
//           // onMouseUp={handleChatOpenMouseUp}
//         >
//           <SenseiMasterChat
//             isOpen={isCollapsed}
//             setIsOpen={setIsCollapsed}
//             senseiStateSetter={senseiStateSetter}
//             isPinned={isPinned}
//             setIsPinned={setIsPinned}
//             pinToSide={pinToSide}
//             setDefaultPosition={setDefaultPosition}
//           />
//         </div>
//       </div>
//     </Draggable>
//   );
// };

// export default SenseiMaster;

import React, { useEffect, useMemo } from "react";
import Draggable from "react-draggable";
import { useRive } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import {
  setCount,
  setAnimationState,
  toggleCollapse,
  setIsPinned,
  setIsDragging,
  setStartPos,
  setDefaultPosition,
  setWindowWidth,
  setWindowHeight,
} from "@/redux/slices/sensei-master.slice";
import { RootState } from "@/redux/store";
import SenseiMasterChat from "../ai/SenseiMasterChat";
import { useSensei } from "@/contexts/SenseiContext";

const SenseiMaster = ({
  type = "generation",
  onSave,
  aiSave,
  setEditId,
}: {
  type: "analysis" | "generation";
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean,
    aiEditIndex?: number
  ) => void;
  aiSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const dispatch = useDispatch();

  const {
    count = 0, // Fallback to 0 if undefined
    animationState = "Sleeping",
    isCollapsed,
    isPinned,
    isDragging,
    startPos,
    defaultPosition,
    windowWidth,
    windowHeight,
  } = useSelector((state: RootState) => {
    return state.senseiMaster || {};
  });

  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/pollsensei_master.riv",
    stateMachines: "sensei-states",
    autoplay: true,
    onStateChange: (state) => {
      dispatch(setAnimationState(state.data));
    },
  });

  const rightBound = useMemo(
    () => windowWidth - (isCollapsed ? 96 : 400),
    [windowWidth, isCollapsed]
  );
  const bottomBound = useMemo(
    () => windowHeight - (isCollapsed ? 226 : 600),
    [windowHeight, isCollapsed]
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    dispatch(setStartPos({ x: event.clientX, y: event.clientY }));
    dispatch(setIsDragging(false));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const distanceMoved = Math.sqrt(
      Math.pow(event.clientX - startPos.x, 2) +
        Math.pow(event.clientY - startPos.y, 2)
    );
    if (distanceMoved > 5) {
      dispatch(setIsDragging(true));
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    dispatch(
      setDefaultPosition({
        x: event.clientX - (isCollapsed ? 40 : 40),
        y:
          event.clientY -
          (isCollapsed
            ? 150
            : event.clientY - 150 > windowHeight - 600
            ? 100
            : 150),
      })
    );
    if (!isDragging) {
      dispatch(toggleCollapse());
    }
  };

  const toggleStates = (stage?: number) => {
    if (rive) {
      const statesLength = rive?.animationNames.length;
      // dispatch(setAnimationState(animationState === "idle" ? "chat" : "idle"));
      if (count >= statesLength - 1) {
        dispatch(setCount(stage ?? 1));
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "stop talking");

        trigger!.fire();
      } else {
        dispatch(setCount(count + 1));
      }
    }
  };

  const senseiStateSetter = (
    state:
      | "sleep"
      | "be idle"
      | "start thinking"
      | "start talking"
      | "stop talking"
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
      if (state === "start thinking") {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs.find((i) => i.name === "start thinking");
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

  const pinToSide = () => {
    console.log(defaultPosition);

    setDefaultPosition(defaultPosition);
    setIsPinned(true);
  };

  // Update window dimensions on resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        dispatch(setWindowWidth(window.innerWidth));
        dispatch(setWindowHeight(window.innerHeight));
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [dispatch]);

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
          const trigger = inputs.find((i) => i.name === "sleep");
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
          const trigger = inputs.find((i) => i.name === "start thinking");
          console.log(trigger);
          trigger!.fire();
        }
        if (count === 3) {
          const trigger = inputs.find((i) => i.name === "start talking");
          console.log(trigger);
          trigger!.fire();
        }
      }
    }
  }, [count, rive]);

  return (
    <Draggable
    // Add your drag logic here
    >
      <div
        className={cn(
          `fixed z-50 shadow-none bg-transparent rounded-full transition-all duration-300`,
          isCollapsed ? "size-24" : "w-[300px] h-[calc(100vh-100px)] rounded-md"
        )}
        style={{
          willChange: "transform",
        }}
      >
        {/* Header with Rive Animation and Collapse Button */}
        <div className="flex items-center justify-between bg-transparent cursor-move w-fit h-fit relative">
          <div
            className={cn(
              "rive-animation size-24 max-w-24 max-h-24 transition-all rounded-full",
              !isCollapsed
                ? "absolute top-[calc(40vh-30px)] -right-[420px] -translate-y-1/2 transition-all"
                : "transition-all"
            )}
          >
            <RiveComponent
              className="absolute inset-0 size-[90%] object-cover rounded-full cursor-pointer flex justify-center items-center mx-auto"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
          {/* <Button
            onClick={() => {
              toggleStates();
            }}
            className="ml-auto w-fit bg-blue-500 h-6 auth-btn text-white px-2 py-1 rounded-full absolute -bottom-8 left-0 !text-xs"
          >
            {animationState}
          </Button> */}
        </div>

        {/* Chat Box Content (shown if not collapsed) */}
        <div
          className={cn(
            "chat-content overflow-auto h-[calc(80%-60px)] shadow-lg rounded-md relative bg-white",
            !isCollapsed ? "block" : "hidden"
          )}
          // onMouseDown={handleChatOpenMouseDown}
          // onMouseMove={handleChatOpenMouseMove}
          // onMouseUp={handleChatOpenMouseUp}
        >
          <SenseiMasterChat
            isOpen={isCollapsed}
            toggleCollapse={toggleCollapse}
            senseiStateSetter={senseiStateSetter}
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            pinToSide={pinToSide}
            setDefaultPosition={setDefaultPosition}
            type={type}
            onSave={onSave}
            aiSave={aiSave}
            setEditId={setEditId!}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default SenseiMaster;
