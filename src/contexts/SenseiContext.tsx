"use client";

import { RootState } from "@/redux/store";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useSelector } from "react-redux";
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
  const user_id = useSelector((state: RootState) => state.user.user?._id);

  console.log(user_id);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user_id) {
      console.warn("No user ID available for socket connection");
      return;
    }

    const socketIo = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        user_id: user_id, // Add user_id to auth instead of headers
      },
      extraHeaders: {
        user_id: user_id, // Add as header too for redundancy
      },
      withCredentials: true,
    });

    setSocket(socketIo);
    socketRef.current = socketIo;

    socketIo.on("connect", () => {
      console.log("Socket connected with user ID:", user_id);
      // alert(`Socket connected with user ID:, ${user_id}`);
      setIsConnected(true);
      addMessage(`Connected to server with user ID: ${user_id}`);
    });

    socketIo.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError(`Connection error: ${error.message}`);
      setIsConnected(false);
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
      if (socketIo) {
        socketIo.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [user_id]);

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
