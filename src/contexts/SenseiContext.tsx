// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useRef,
// } from "react";
// import { io, Socket } from "socket.io-client";

// interface SenseiContextProps {
//   emitUserTrigger: (payload: UserTriggerPayload) => void;
//   aiResponse: string;
//   loading: boolean;
//   isConnected: boolean;
//   messages: string[];
//   clearMessages: () => void;
//   error: string | null;
// }

// const SenseiContext = createContext<SenseiContextProps | undefined>(undefined);

// const SOCKET_URL = "https://ai-api-staging.pollsensei.ai"; // Replace with your actual WebSocket URL

// interface ServerToClientEvents {
//   ai_trigger: (data: { message: string }) => void;
// }

// interface ClientToServerEvents {
//   user_trigger: (data: UserTriggerPayload) => void;
// }

// interface Question {
//   Question: string;
//   "Option type": string;
//   Options: string[];
// }

// interface UserTriggerPayload {
//   conversation_id: string;
//   data: {
//     question: Question;
//   };
//   trigger_type: string;
// }

// export const SenseiProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [socket, setSocket] = useState<Socket<
//     ServerToClientEvents,
//     ClientToServerEvents
//   > | null>(null);
//   const [aiResponse, setAiResponse] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [messages, setMessages] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     const socketIo = io(SOCKET_URL, {
//       transports: ["websocket"], // Force WebSocket transport
//     });

//     setSocket(socketIo);
//     socketRef.current = socketIo;

//     // Connection established
//     socketIo.on("connect", () => {
//       setIsConnected(true);
//       addMessage("Connected to server.");
//     });

//     // Listen for AI responses
//     socketIo.on("ai_trigger", (data) => {
//       setAiResponse(data.message);
//       setLoading(false); // Stop loading once the response is received
//       addMessage(`Received ai_trigger event: ${data.message}`);
//     });

//     // Handle disconnects
//     socketIo.on("disconnect", (reason) => {
//       setIsConnected(false);
//       addMessage("Disconnected from server.");
//       if (reason !== "io client disconnect") {
//         setError(`Unexpected disconnect: ${reason}`);
//       }
//     });

//     // Handle any events
//     socketIo.onAny((event, ...args) => {
//       addMessage(`Received event: ${event}`);
//       addMessage(`Data: ${JSON.stringify(args)}`);
//     });

//     // Cleanup
//     return () => {
//       socketIo.disconnect();
//     };
//   }, []);

//   const addMessage = (message: string) => {
//     setMessages((prev) => [...prev, message]);
//   };

//   const clearMessages = () => {
//     setMessages([]);
//   };

//   const emitUserTrigger = (payload: UserTriggerPayload) => {
//     if (socketRef.current && isConnected) {
//       setLoading(true); // Start loading when the user_trigger event is emitted
//       socketRef.current.emit("user_trigger", payload);
//       addMessage(
//         `Emitted user_trigger event with payload: ${JSON.stringify(payload)}`
//       );
//     } else {
//       setError("Socket is not connected.");
//       setLoading(false); // Stop loading if there's a connection issue
//     }
//   };

//   return (
//     <SenseiContext.Provider
//       value={{
//         emitUserTrigger,
//         aiResponse,
//         loading,
//         isConnected,
//         messages,
//         clearMessages,
//         error,
//       }}
//     >
//       {children}
//     </SenseiContext.Provider>
//   );
// };

// // Hook to use SenseiContext in components
// export const useSensei = () => {
//   const context = useContext(SenseiContext);
//   if (!context) {
//     throw new Error("useSensei must be used within a SenseiProvider");
//   }
//   return context;
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

interface SenseiContextProps {
  emitEvent: (eventName: string, payload?: any) => void;
  aiResponse: string;
  loading: boolean;
  isConnected: boolean;
  messages: string[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAiResponse: React.Dispatch<React.SetStateAction<string>>;
  clearMessages: () => void;
  socketIo: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  error: string | null;
}

const SenseiContext = createContext<SenseiContextProps | undefined>(undefined);

const SOCKET_URL = "https://ai-api-staging.pollsensei.ai"; // Replace with your actual WebSocket URL

interface ServerToClientEvents {
  [event: string]: (...args: any[]) => void; // Allow any event
}

interface ClientToServerEvents {
  user_trigger: (data: UserTriggerPayload) => void;
}

interface Question {
  Question: string;
  "Option type": string;
  Options: string[];
}

interface UserTriggerPayload {
  conversation_id: string;
  data: {
    question: Question;
  };
  trigger_type: string;
}

export const SenseiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ["websocket"], // Force WebSocket transport
    });

    setSocket(socketIo);
    socketRef.current = socketIo;

    // Connection established
    socketIo.on("connect", () => {
      setIsConnected(true);
      addMessage("Connected to server.");
    });

    // Handle any event
    socketIo.onAny((eventName, ...args) => {
      handleEvent(eventName, ...args);
    });

    // Handle disconnects
    socketIo.on("disconnect", (reason) => {
      setIsConnected(false);
      addMessage("Disconnected from server.");
      if (reason !== "io client disconnect") {
        setError(`Unexpected disconnect: ${reason}`);
      }
    });

    // Cleanup
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Reusable emit function
  const emitEvent = (eventName: string, payload?: any) => {
    if (socketRef.current && isConnected) {
      setLoading(true); // Start loading when emitting an event
      socketRef.current.emit(eventName, payload);
      addMessage(
        `Emitted event: ${eventName} with payload: ${JSON.stringify(payload)}`
      );
    } else {
      setError("Socket is not connected.");
      setLoading(false); // Stop loading if there's a connection issue
    }
  };

  // Handle different events dynamically
  const handleEvent = (eventName: string, ...args: any[]) => {
    switch (eventName) {
      case "ai_trigger":
        setAiResponse(args[0].message);
        setLoading(false); // Stop loading when ai response is received
        addMessage(`Received ai_trigger event: ${args[0].message}`);
        break;
      // Add more cases for different events here
      default:
        addMessage(
          `Received event: ${eventName} with data: ${JSON.stringify(args)}`
        );
        break;
    }
  };

  return (
    <SenseiContext.Provider
      value={{
        emitEvent,
        aiResponse,
        loading,
        isConnected,
        messages,
        clearMessages,
        error,
        setLoading,
        setAiResponse,
        socketIo: socket,
      }}
    >
      {children}
    </SenseiContext.Provider>
  );
};

// Hook to use SenseiContext in components
export const useSensei = () => {
  const context = useContext(SenseiContext);
  if (!context) {
    throw new Error("useSensei must be used within a SenseiProvider");
  }
  return context;
};
