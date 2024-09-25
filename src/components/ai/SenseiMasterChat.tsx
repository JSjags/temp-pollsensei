"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Brain, X, Send, Pin, PinOff } from "lucide-react";
import { cn, generateInitials } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

const initialMessages: Message[] = [
  { id: 1, text: "Hello there", sender: "ai", timestamp: "08:16 AM" },
  {
    id: 2,
    text: "I'm an automated chatbot here to answer your questions.\n\nPlease pick the best option below or feel free to ask me anything to get started.",
    sender: "ai",
    timestamp: "08:16 AM",
  },
];

// Suggested questions for the user
const suggestedQuestions = [
  "How do I create a survey?",
  "Can I customize the survey design and layout?",
  "I want to know if I create surveys in different languages?",
];

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDefaultPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  isPinned: boolean;
  setIsPinned: Dispatch<SetStateAction<boolean>>;
  pinToSide: () => void;
  senseiStateSetter: (
    state:
      | "sleep"
      | "be idle"
      | "start talking"
      | "start thinking"
      | "stop talking"
  ) => void;
};

const SenseiMasterChat = ({
  setIsOpen,
  isOpen,
  senseiStateSetter,
  setDefaultPosition,
  isPinned,
  pinToSide,
  setIsPinned,
}: Props) => {
  // State variables
  const user = useSelector((state: RootState) => state.user.user);
  const [messages, setMessages] = useState<Message[]>(initialMessages); // Message array
  const [input, setInput] = useState(""); // User input
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to the end of the chat messages
  const [isDragging, setIsDragging] = useState(false); // Track dragging
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Initial position when dragging starts

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom whenever the messages array is updated
  useEffect(scrollToBottom, [messages]);

  // Handle sending a new message
  const handleSend = () => {
    if (input.trim()) {
      // Start AI "thinking" animation
      senseiStateSetter("start thinking");

      // User message
      const userMessage: Message = {
        id: messages.length + 1,
        text: input.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Append user's message to the chat
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput(""); // Clear input field

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponseText =
          "Thank you for your question. I'm processing it and will respond shortly.";
        let displayedText = "";
        const totalTime = aiResponseText.length * 50; // 50ms per character for the AI message

        // Placeholder for AI response (empty text initially)
        const aiMessage: Message = {
          id: userMessage.id + 1,
          text: "",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // Add AI message placeholder
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // Start AI "talking" animation
        senseiStateSetter("start talking");

        // Simulate streaming AI response character by character
        aiResponseText.split("").forEach((char, index) => {
          setTimeout(() => {
            displayedText += char;

            // Update only the AI message (the last one in the array)
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].text = displayedText;
              return updatedMessages;
            });
          }, index * 50); // Delay each character by 50ms
        });

        // Stop AI "talking" animation after the message is fully displayed
        setTimeout(() => {
          senseiStateSetter("stop talking");
        }, totalTime);
      }, 1000); // Simulated delay before AI starts responding
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5b03b2] rounded-t-md to-[#9d50bb] text-white p-4 pt-10 cursor-move">
        <p className="text-xl font-bold text-white text-left">Sensei</p>
        <div
          className="absolute right-4 top-3 p-0 flex justify-end gap-2"
          onMouseDown={(event) => {
            // Track mouse down for dragging
            setStartPos({ x: event.clientX, y: event.clientY });
            setIsDragging(false);
          }}
          onMouseMove={(event) => {
            // Check if user is dragging
            const distanceMoved = Math.sqrt(
              Math.pow(event.clientX - startPos.x, 2) +
                Math.pow(event.clientY - startPos.y, 2)
            );
            if (distanceMoved > 5) setIsDragging(true);
          }}
          onMouseUp={() => {
            // Toggle chat if not dragging
            if (!isDragging) setIsOpen(!isOpen);
          }}
        >
          {/* Pin Button */}
          <Button
            variant="ghost"
            size="icon"
            className="p-0 size-8 text-white rounded-full hover:bg-white/20 hover:text-white"
            onClick={() => {
              if (isPinned) {
                setIsPinned(false);
              } else {
                pinToSide();
              }
            }}
          >
            {isPinned ? (
              <PinOff className="size-5 rotate-45" />
            ) : (
              <Pin className="size-5 rotate-45" />
            )}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="p-0 size-8 text-white rounded-full hover:bg-white/20 hover:text-white"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 px-0 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.sender !== "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={cn(
                  `max-w-[95%] sm:max-w-[80%] p-3 py-0 rounded-lg flex gap-x-3 items-start`,
                  message.sender !== "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex justify-center items-center size-6 sm:size-10 shrink-0 bg-[#EAD6FF30] rounded-full shadow-md",
                    message.sender !== "user" ? "bg-[#EAD6FF30]" : "bg-white"
                  )}
                >
                  {message.sender === "ai" ? (
                    <Brain className="inline-block size-4 sm:size-5 text-purple-600 shrink-0" />
                  ) : (
                    <div className="font-semibold size-8 rounded-full flex items-center justify-center cursor-pointer">
                      {generateInitials((user as any)?.name ?? "")}
                    </div>
                  )}
                </div>
                <div className="grid">
                  <p
                    className={cn(
                      "text-sm p-3 rounded-lg rounded-tl-none",
                      message.sender !== "user"
                        ? "bg-purple-600 text-white"
                        : "bg-[#F1F7FF] text-gray-800"
                    )}
                  >
                    {message.text}
                  </p>
                  <p
                    className={cn(
                      "text-[0.65rem] mt-0.5 opacity-70",
                      message.sender === "user"
                        ? "justify-self-start"
                        : "justify-self-end"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Ref to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Section */}
      <div className="bg-white">
        <div className="flex flex-wrap gap-2 mb-4 px-2">
          {/* Optional suggested questions section */}
        </div>
        <div className="flex items-center space-x-2 border-t border-border px-2">
          <AutosizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border-none py-2 h-8 p-2 outline-transparent outline-offset-0 focus:outline-none focus-visible:outline-none resize-none"
            maxHeight={200}
            onKeyDown={() => senseiStateSetter("be idle")}
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full size-8"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SenseiMasterChat;
