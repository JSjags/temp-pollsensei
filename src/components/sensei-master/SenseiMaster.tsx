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

import React, { useEffect, useState, useCallback } from "react";
import { Rnd } from "react-rnd";
import { useRive } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import {
  setCount,
  setAnimationState,
  toggleCollapse,
  setIsPinned,
  setWindowWidth,
  setWindowHeight,
} from "@/redux/slices/sensei-master.slice";
import { RootState } from "@/redux/store";
import SenseiMasterChat from "../ai/SenseiMasterChat";
import { motion, AnimatePresence } from "framer-motion";

const CHAT_WIDTH = 400;
const CHAT_HEIGHT = 600;
const SENSEI_SIZE = 96;
const PADDING = 20;
const TRANSITION_DURATION = 0.3;

type Direction = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0, y: 0 });
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [openDirection, setOpenDirection] = useState<Direction>("bottom-left");

  const {
    count = 0,
    animationState = "Sleeping",
    isCollapsed = true,
    isPinned,
    windowWidth,
    windowHeight,
  } = useSelector((state: RootState) => state.senseiMaster || {});

  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/pollsensei_master.riv",
    stateMachines: "sensei-states",
    autoplay: true,
    onStateChange: (state) => {
      dispatch(setAnimationState(state.data));
    },
  });

  // Add new function to ensure position stays within bounds
  const getConstrainedPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - SENSEI_SIZE;
    const maxY = window.innerHeight - SENSEI_SIZE;

    return {
      x: Math.max(PADDING, Math.min(x, maxX - PADDING)),
      y: Math.max(PADDING, Math.min(y, maxY - PADDING)),
    };
  }, []);

  // Update calculateLayout to be more robust
  const calculateLayout = useCallback((x: number, y: number) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate center points
    const senseiCenterX = x + SENSEI_SIZE / 2;
    const senseiCenterY = y + SENSEI_SIZE / 2;

    // Determine which quadrant of the screen we're in
    const isRightHalf = senseiCenterX > windowWidth / 2;
    const isBottomHalf = senseiCenterY > windowHeight / 2;

    // Calculate available space in each direction
    const spaceLeft = x;
    const spaceRight = windowWidth - (x + SENSEI_SIZE);
    const spaceTop = y;
    const spaceBottom = windowHeight - (y + SENSEI_SIZE);

    let direction: Direction;

    // Prefer opening away from screen edges
    if (isRightHalf) {
      // On right half of screen, prefer opening to the left
      direction = isBottomHalf ? "top-left" : "bottom-left";
    } else {
      // On left half of screen, prefer opening to the right
      direction = isBottomHalf ? "top-right" : "bottom-right";
    }

    // Override if there's not enough space in preferred direction
    if (direction.includes("left") && spaceLeft < CHAT_WIDTH + PADDING) {
      direction = direction.includes("top") ? "top-right" : "bottom-right";
    }
    if (direction.includes("right") && spaceRight < CHAT_WIDTH + PADDING) {
      direction = direction.includes("top") ? "top-left" : "bottom-left";
    }
    if (direction.includes("top") && spaceTop < CHAT_HEIGHT + PADDING) {
      direction = direction.includes("left") ? "bottom-left" : "bottom-right";
    }
    if (direction.includes("bottom") && spaceBottom < CHAT_HEIGHT + PADDING) {
      direction = direction.includes("left") ? "top-left" : "top-right";
    }

    setOpenDirection(direction);
    return { x, y, direction };
  }, []);

  // Improve window resize handler
  useEffect(() => {
    const handleResize = () => {
      const newWindowWidth = window.innerWidth;
      const newWindowHeight = window.innerHeight;

      dispatch(setWindowWidth(newWindowWidth));
      dispatch(setWindowHeight(newWindowHeight));

      // Ensure Sensei stays in bounds after resize
      const constrainedPosition = getConstrainedPosition(
        position.x,
        position.y
      );

      if (
        constrainedPosition.x !== position.x ||
        constrainedPosition.y !== position.y
      ) {
        setPosition(constrainedPosition);
      }

      if (!isCollapsed) {
        calculateLayout(constrainedPosition.x, constrainedPosition.y);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    dispatch,
    position,
    isCollapsed,
    calculateLayout,
    getConstrainedPosition,
  ]);

  // Set initial position
  useEffect(() => {
    const x = window.innerWidth - (SENSEI_SIZE + PADDING);
    const y = window.innerHeight - (SENSEI_SIZE + PADDING);
    setPosition({ x, y });
    calculateLayout(x, y);
  }, [calculateLayout]);

  const senseiStateSetter = useCallback(
    (
      state:
        | "sleep"
        | "be idle"
        | "start thinking"
        | "start talking"
        | "stop talking"
    ) => {
      if (!rive) return;
      const inputs = rive.stateMachineInputs("sensei-states");
      const trigger = inputs.find((i) => i.name === state);
      trigger?.fire();
    },
    [rive]
  );

  // Update position and direction while dragging
  const handleDrag = useCallback(
    (x: number, y: number) => {
      if (isCollapsed) return;
      calculateLayout(x, y);
      setPosition({ x, y });
    },
    [isCollapsed, calculateLayout]
  );

  // Effect to handle direction updates when collapse state changes
  useEffect(() => {
    if (!isCollapsed) {
      calculateLayout(position.x, position.y);
    }
  }, [isCollapsed, position.x, position.y, calculateLayout]);

  // Add back the getChatPositionStyles function that was accidentally removed
  const getChatPositionStyles = useCallback((direction: Direction) => {
    switch (direction) {
      case "top-left":
        return {
          right: "100%",
          bottom: "100%",
          marginRight: 10,
          marginBottom: 10,
        };
      case "top-right":
        return {
          left: "100%",
          bottom: "100%",
          marginLeft: 10,
          marginBottom: 10,
        };
      case "bottom-left":
        return {
          right: "100%",
          top: 0,
          marginRight: 10,
        };
      case "bottom-right":
      default:
        return {
          left: "100%",
          top: 0,
          marginLeft: 10,
        };
    }
  }, []);

  // Add back the mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownTime(Date.now());
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const mouseUpTime = Date.now();
    const timeDiff = mouseUpTime - mouseDownTime;
    const distanceMoved = Math.sqrt(
      Math.pow(e.clientX - mouseDownPosition.x, 2) +
        Math.pow(e.clientY - mouseDownPosition.y, 2)
    );

    if (timeDiff < 200 && distanceMoved < 5) {
      if (!isCollapsed) {
        dispatch(toggleCollapse());
        return;
      }

      setIsRepositioning(true);
      calculateLayout(position.x, position.y);

      setTimeout(() => {
        setIsRepositioning(false);
        dispatch(toggleCollapse());
      }, TRANSITION_DURATION * 1000);
    }
  };

  // Add back the pinToSide function
  const pinToSide = useCallback(() => {
    const x = window.innerWidth - (SENSEI_SIZE + PADDING);
    const y = window.innerHeight - (SENSEI_SIZE + PADDING);
    setPosition({ x, y });
    calculateLayout(x, y);
  }, [calculateLayout]);

  return (
    <Rnd
      position={position}
      size={{
        width: SENSEI_SIZE,
        height: SENSEI_SIZE,
      }}
      bounds="window"
      enableResizing={false}
      disableDragging={isPinned}
      onDrag={(_e, d) => {
        const constrainedPos = getConstrainedPosition(d.x, d.y);
        setPosition(constrainedPos);
        handleDrag(constrainedPos.x, constrainedPos.y);
      }}
      onDragStop={(_e, d) => {
        const constrainedPos = getConstrainedPosition(d.x, d.y);
        setPosition(constrainedPos);
        calculateLayout(constrainedPos.x, constrainedPos.y);
      }}
      dragHandleClassName="drag-handle"
      style={{ zIndex: 9999999 }}
    >
      <div className="relative">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: CHAT_WIDTH,
                height: CHAT_HEIGHT,
                ...getChatPositionStyles(openDirection),
              }}
            >
              <SenseiMasterChat
                isOpen={isCollapsed}
                toggleCollapse={toggleCollapse}
                senseiStateSetter={senseiStateSetter}
                isPinned={isPinned}
                setIsPinned={setIsPinned}
                pinToSide={pinToSide}
                setDefaultPosition={setPosition}
                type={type}
                onSave={onSave}
                aiSave={aiSave}
                setEditId={setEditId!}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="size-24 cursor-move drag-handle">
          <RiveComponent
            className="size-full rounded-full"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </Rnd>
  );
};

export default SenseiMaster;
