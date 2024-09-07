import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import { SheetHeader, SheetTitle } from './sheet'
import { Button } from './button'
import { Brain, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, generateInitials } from "@/lib/utils";
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';


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

const suggestedQuestions = [
  "How do I create a survey?",
  "Can I customize the survey design and layout?",
  "I want to know if I create surveys in different languages?",
];

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const Sensei:React.FC<Props> = ({setIsOpen}) => {
  const user = useSelector((state: RootState) => state.user.user);
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

  return (
    <div
    className="w-[20rem] rounded-md flex flex-col absolute top-14 right-0 z-50"
    data-aos="fade-left"
    data-aos-offset="300"
    data-aos-easing="ease-in-sine"
    >
      <SheetHeader className="bg-[#3F51B5] text-white p-4 pt-10">
        <SheetTitle className="text-2xl font-bold text-white text-left">
          Poll Professor
        </SheetTitle>
        <p className="text-sm mt-2 text-left">
          Hi, I'm your PollSensei's assistant but you can call me Poll
          Professor. I'm here to provide quick and accurate support.
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-0 size-8 text-white rounded-full bg-white/10 hover:bg-white hover:text-black"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </SheetHeader>
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
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={cn(
                  `max-w-[95%] sm:max-w-[80%] p-3 py-0 rounded-lg flex gap-x-3 items-start`,
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex justify-center items-center size-6 sm:size-10 shrink-0 bg-[#EAD6FF30] rounded-full shadow-md",
                    message.sender === "user" ? "bg-[#EAD6FF30]" : "bg-white"
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
  )
}

export default Sensei
