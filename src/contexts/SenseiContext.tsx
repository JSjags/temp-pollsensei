"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SenseiContextProps {
  emitUserTrigger: (payload: UserTriggerPayload) => void;
  aiResponse: string;
  loading: boolean;
  isConnected: boolean;
}

const SenseiContext = createContext<SenseiContextProps | undefined>(undefined);

const SOCKET_URL = "ws://4.152.139.177"; // Replace with your actual WebSocket URL

interface ServerToClientEvents {
  ai_trigger: (data: { message: string }) => void;
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

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ["websocket"], // Force WebSocket transport
    });

    setSocket(socketIo);

    socketIo.on("connect", () => {
      alert("WebSocket connected successfully!");
      setIsConnected(true);
    });

    socketIo.on("ai_trigger", (data) => {
      console.log("Received ai_trigger event:", data.message);
      setAiResponse(data.message);
      setLoading(false); // Stop loading once the response is received
    });

    socketIo.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const emitUserTrigger = (payload: UserTriggerPayload) => {
    if (socket && isConnected) {
      setLoading(true); // Start loading when the user_trigger event is emitted
      socket.emit("user_trigger", payload);
      console.log("Sent user_trigger event:", payload);
    } else {
      console.error("Socket is not connected.");
      setLoading(false); // Stop loading if there is a connection issue
    }
  };

  return (
    <SenseiContext.Provider
      value={{ emitUserTrigger, aiResponse, loading, isConnected }}
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
