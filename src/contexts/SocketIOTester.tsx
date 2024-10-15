// import React, { useEffect, useState, useRef } from "react";

// type Payload = {
//   conversation_id: string;
//   query: string;
//   survey_id: string;
//   survey_stage: string;
// };

// const WebSocketTester: React.FC = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     if (typeof window === "undefined") return; // Ensure client-side

//     const socket = new WebSocket("wss://ai-api-staging.pollsensei.ai");

//     socketRef.current = socket;

//     const payload: Payload = {
//       conversation_id: "666b712d792d6f655b4571d9",
//       query: "generate two single questions",
//       survey_id: "66c5fe26ee8565ca5ffc732a",
//       survey_stage: "generation",
//     };

//     // Connection timeout setup
//     const connectionTimeout = setTimeout(() => {
//       if (!isConnected) {
//         setError("Connection timed out.");
//         socket.close();
//       }
//     }, 10000); // 10 seconds

//     // Handle connection open
//     socket.onopen = () => {
//       clearTimeout(connectionTimeout);
//       setIsConnected(true);
//       console.log("Connected to WebSocket");
//       socket.send(JSON.stringify(payload));
//       console.log("Sent payload:", payload);
//     };

//     // Handle incoming messages
//     socket.onmessage = (event) => {
//       console.log("Received message:", event.data);
//       setMessages((prev) => [...prev, event.data]);
//     };

//     // Handle errors
//     socket.onerror = (event) => {
//       clearTimeout(connectionTimeout);
//       setError("WebSocket error occurred.");
//       console.error("WebSocket error:", event);
//     };

//     // Handle connection close
//     socket.onclose = (event) => {
//       clearTimeout(connectionTimeout);
//       setIsConnected(false);
//       console.log("Disconnected from WebSocket", event.reason);
//       if (!event.wasClean) {
//         setError(`Disconnected: ${event.reason || "Unknown reason"}`);
//       }
//     };

//     // Clean up on unmount
//     return () => {
//       socket.close();
//     };
//   }, [isConnected]);

//   return (
//     <div>
//       <h1>WebSocket Tester</h1>
//       <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <div>
//         <h2>Messages:</h2>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index}>{msg}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default WebSocketTester;

"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SOCKET_SERVER_URL = "https://ai-api-staging.pollsensei.ai";

export default function SocketIOTester() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [eventName, setEventName] = useState("");
  const [eventData, setEventData] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      addMessage("Connected to server");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      addMessage("Disconnected from server");
    });

    socketRef.current.onAny((event, ...args) => {
      addMessage(`Received event: ${event}`);
      addMessage(`Data: ${JSON.stringify(args)}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleEmitEvent = () => {
    if (socketRef.current && eventName) {
      try {
        const parsedData = eventData ? JSON.parse(eventData) : {};
        socketRef.current.emit(eventName, parsedData);
        addMessage(`Emitted event: ${eventName}`);
        addMessage(`Data: ${eventData}`);
      } catch (error) {
        addMessage(`Error parsing event data: ${error}`);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Socket.IO Tester</CardTitle>
        <CardDescription>
          Test your Socket.IO connection to {SOCKET_SERVER_URL}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <Textarea
            placeholder="Event data (JSON format)"
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
          />
          <Button
            onClick={handleEmitEvent}
            disabled={!isConnected || !eventName}
          >
            Emit Event
          </Button>
        </div>
        <div className="border rounded p-2 h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2">Messages:</h3>
          {messages.map((message, index) => (
            <div key={index} className="mb-1">
              {message}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            setMessages([]);
          }}
        >
          Clear Messages
        </Button>
      </CardFooter>
    </Card>
  );
}
