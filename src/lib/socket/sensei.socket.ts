import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Replace this with your actual WebSocket URL
const SOCKET_URL = "https://ai-api-staging.pollsensei.ai";

interface ServerToClientEvents {
  ai_trigger: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  user_trigger: (data: { message: string }) => void;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ["websocket"], // Force websocket transport
    });

    // Set loading to true while connecting
    setLoading(true);

    // Save the socket connection in state
    setSocket(socketIo);

    // On successful connection, alert success and stop loading
    socketIo.on("connect", () => {
      // alert("WebSocket connected successfully!");
      setLoading(false); // Stop loading when connected
    });

    // Listen for 'ai_trigger' event
    socketIo.on("ai_trigger", (data) => {
      console.log("Received ai_trigger event:", data.message);
      setAiResponse(data.message);
    });

    // Handle disconnection
    socketIo.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Function to emit the 'user_trigger' event
  const emitUserTrigger = (message: string) => {
    if (socket?.connected) {
      setLoading(true); // Start loading when emitting
      socket.emit("user_trigger", { message });
      console.log("Sent user_trigger event:", message);

      // Simulate a delay for receiving ai_trigger to stop loading
      socket.once("ai_trigger", () => {
        setLoading(false); // Stop loading when the AI response is received
      });
    } else {
      console.error("Socket is not connected");
      setLoading(false); // Stop loading if emit fails
    }
  };

  return { emitUserTrigger, aiResponse, loading };
}
