import React, { useState, SetStateAction, useRef, useEffect } from "react";
import { RiArrowRightLine, RiCloseLine, RiSubtractLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Brain, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, generateInitials } from "@/lib/utils";
import { BsFillPinAngleFill } from "react-icons/bs";
import { HiOutlineMinusSmall } from "react-icons/hi2";
// import { AutosizeTextarea } from "./autosize-textarea";
import { Button } from "../ui/button";
import { AutosizeTextarea } from "../ui/autosize-textarea";
const pollProfessor = "/assets/help-centre/poll-professor.svg";

interface ChatWidgetProps {
  isChatOpen: boolean;
  // isOpen: boolean;
  isChatMinimized: boolean;
  minimizeChat: () => void;
  closeChat: () => void;
  // setIsOpen: () => void;
  // setIsOpenT:SetStateAction<boolean>;
}

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello there",
    sender: "ai",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  {
    id: 2,
    text: "I'm an automated chatbot here to answer your questions.\n\nPlease pick the best option below to get started.",
    sender: "ai",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

const suggestedQuestions = [
  "How do I create a survey?",
  "Can I customize the survey design and layout?",
  "I want to know if I create surveys in different languages?",
];

type Props = {
  isOpen: boolean;
  setIsOpen: () => void;
  questionIndex: number | null;
  currentSection: number;
};

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isChatOpen,
  isChatMinimized,
  minimizeChat,
  closeChat,
}) => {
  const [messages2, setMessages2] = useState([
    {
      id: 1,
      text: "Hello there. I'm PollBot. I can answer any questions you might have.",
      sender: "bot",
    },
    { id: 2, text: "How may I help you?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const questions = useSelector((state: RootState) => state?.survey?.sections);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: "Thank you for your question. I'm processing it and will respond shortly.",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleSend2 = () => {
    if (inputValue.trim()) {
      setMessages2([
        ...messages2,
        { id: messages2.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");
    }
  };
  return (
    <>
      {isChatOpen && (
        <div
          className={`fixed z-50 top-0 right-0 transform transition-transform duration-300 ${
            isChatMinimized ? "translate-y-full" : "translate-y-0"
          } w-full md:w-96 h-[100vh] bg-white shadow-lg border-t md:border border-gray-300 rounded-t-lg md:rounded-lg`}
        >
          <div className="flex flex-col h-[20%] bg-purple-700 text-white px-4 py-3 rounded-t-lg">
            <div className="flex justify-end items-center">
              <button onClick={minimizeChat} className="focus:outline-none">
                <RiSubtractLine />
              </button>
              <button onClick={closeChat} className="focus:outline-none">
                <RiCloseLine />
              </button>
            </div>
            <div className="flex lg:px-8 justify-center text-center flex-col items-center">
            <p className="font-[700] text-lg">PollSensei Support Bot</p>
            <p className="text-sm">
              Easily find answers to your questions by chatting with our 24/7
              support team
            </p>
            </div>
          </div>
          {!isChatMinimized && (
            <div className="p-4 overflow-y-auto h-full">
              {/* <p className="text-gray-600 mb-4">
                Hello there. I&apos;m PollBot. I&apos;m can answer any questions you might have. How may I help you?
              </p>
              <div className="space-y-2">
                <div className="bg-purple-100 text-purple-900 p-2 rounded-md inline-block">How can I register?</div>
                <div className="bg-purple-100 text-purple-900 p-2 rounded-md inline-block">Login is not working</div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Reply..."
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
              </div> */}
              <div className="flex-1 overflow-y-auto p-4 px-0 space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={cn(
                          `max-w-[95%] sm:max-w-[80%] p-3 py-0 rounded-lg flex gap-x-3 items-start`,
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "flex justify-center items-center size-5 sm:size-7 shrink-0 bg-[#EAD6FF30] rounded-full shadow-md",
                            message.sender === "user"
                              ? "bg-[#EAD6FF30]"
                              : "bg-white"
                          )}
                        >
                          {message.sender === "ai" ? (
                            <Brain className="inline-block size-3 sm:size-5 text-purple-600 shrink-0" />
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
                              message.sender === "user"
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
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white">
                <div className="flex flex-wrap gap-2 mb-4 px-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-purple-600 border-purple-600 hover:bg-purple-100 text-wrap min-h-10 h-fit text-left py-2"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center space-x-2 border-t border-border px-2">
                  <AutosizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Reply"
                    // onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border-none py-2 h-8 p-2 outline-transparent custom-scrollbar outline-offset-0 focus:outline-none focus-visible:outline-none resize-none"
                    maxHeight={200}
                  />
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
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
