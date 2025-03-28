"use client";

import {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Brain, X, Send, Pin, PinOff } from "lucide-react";
import {
  cn,
  extractMongoId,
  formatString,
  generateInitials,
} from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import store, { RootState } from "@/redux/store";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useSensei } from "@/contexts/SenseiContext";
import { usePathname } from "next/navigation";
import {
  setActionMessage,
  addMessage,
  updateMessage as updateMessageAction,
  setMessages,
} from "@/redux/slices/sensei-master.slice";

// Add these constants at the top of the file, after imports
const CHAT_WIDTH = 400; // Width of chat window
const CHAT_HEIGHT = 580; // Height of chat window
const PADDING = 20; // Padding from window edges

// The AI message is being added twice because:
// 1. It's added once in the `addAiMessage` function
// 2. It's added again when the socket receives the "ai_message" event
// To fix this, we should only add the message in one place, preferably when receiving the socket event

type Message = {
  id: number;
  text: string;
  actions?: string[];
  question_id?: number;
  sender: "user" | "ai";
  timestamp: string;
  trigger_type?: "single-regen" | "option" | "check-compatibility";
};

const getCurrentTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const initialMessages: Message[] = [];

const suggestedQuestions = [
  "How do I create a survey?",
  "Can I customize the survey design and layout?",
  "Can I create surveys in different languages?",
];

type Props = {
  isOpen: boolean;
  toggleCollapse: ActionCreatorWithoutPayload<"senseiMaster/toggleCollapse">;
  isPinned: boolean;
  setIsPinned: (isPinned: boolean) => void;
  pinToSide: () => void;
  setDefaultPosition: (position: { x: number; y: number }) => void;
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
  senseiStateSetter: (
    state:
      | "sleep"
      | "be idle"
      | "start talking"
      | "start thinking"
      | "stop talking"
  ) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
};

const SenseiMasterChat: React.FC<Props> = ({
  toggleCollapse,
  isOpen,
  senseiStateSetter,
  setDefaultPosition,
  isPinned,
  pinToSide,
  setIsPinned,
  type,
  onSave,
  aiSave,
  setEditId,
}) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const messages = useSelector(
    (state: RootState) => state.senseiMaster.messages
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const conversation_id = store.getState().survey.conversation_id;
  // const survey_id = store.getState().survey.id; // Changed from 'i' to 'id'

  const { actionMessage, currentQuestion, currentQuestionType } = useSelector(
    (state: RootState) => {
      return state.senseiMaster || {};
    }
  );

  const { aiResponse, loading, isConnected, emitEvent, socketIo, setLoading } =
    useSensei();

  // Add state for tracking last position
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    socketIo?.onAny((eventName: string, ...args: any) => {
      handleEvent(eventName, ...args);
    });
  }, [socketIo]);

  const handleEvent = (eventName: string, ...args: any[]) => {
    switch (eventName) {
      case "ai_message":
        handleAiMessage(args[0]?.reply_text ?? args[0]?.response);
        break;
      case "ai_trigger":
        console.log(args);
        handleAiMessage(args[0]?.reply_text ?? args[0]?.response, args[0]);
        break;
      // Add more cases for different events here
      default:
        break;
    }
  };

  const handleAiMessage = (aiResponseText: string, obj?: any) => {
    setLoading(false);
    const formattedResponse = formatString(aiResponseText);
    addAiMessage(formattedResponse, obj);
  };

  const addUserMessage = (actionMessage?: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: actionMessage ? actionMessage.trim() : input.trim(),
      sender: "user",
      timestamp: getCurrentTimestamp(),
    };
    dispatch(addMessage(userMessage));
    setInput("");
  };

  const addAiMessage = (text: string, obj: any) => {
    if (!text.trim()) return;

    const aiMessageId = Date.now() + Math.floor(Math.random() * 1000000);
    const aiMessage: Message = {
      id: aiMessageId,
      text: text.trim(),
      sender: "ai",
      timestamp: getCurrentTimestamp(),
      ...(obj
        ? {
            actions: obj?.actions ?? [],
            question_id: obj?.question_id ?? null,
            trigger_type: obj?.trigger_type ?? null,
          }
        : {}),
    };

    // Get current messages from Redux
    const currentMessages = store.getState().senseiMaster.messages;

    // Find the last user message
    const lastUserMessage = [...currentMessages]
      .reverse()
      .find((m) => m.sender === "user");

    // If we found a user message, remove all AI messages after it
    if (lastUserMessage) {
      const lastUserIndex = currentMessages.findIndex(
        (m) => m.id === lastUserMessage.id
      );
      const messagesCopy = currentMessages.slice(0, lastUserIndex + 1);

      // Check if this exact AI response already exists after the last user message
      const duplicateExists = currentMessages
        .slice(lastUserIndex + 1)
        .some((msg) => msg.text === text.trim());

      if (!duplicateExists) {
        dispatch(setMessages([...messagesCopy, aiMessage]));
        simulateTyping(text.trim(), aiMessageId);
      }
    } else {
      // No user messages yet, just check for duplicates at the start
      const duplicateExists = currentMessages.some(
        (msg) => msg.text === text.trim()
      );
      if (!duplicateExists) {
        dispatch(addMessage(aiMessage));
        simulateTyping(text.trim(), aiMessageId);
      }
    }
  };

  const simulateTyping = (text: string, messageId: number) => {
    senseiStateSetter("start talking");
    let displayedText = "";
    const totalTime = text.length * 2;

    text.split("").forEach((char, index) => {
      setTimeout(() => {
        displayedText += char;
        updateMessage(messageId, displayedText);
      }, index * 22);
    });
    senseiStateSetter("start talking");

    setTimeout(() => {
      senseiStateSetter("stop talking");
    }, totalTime);
  };

  const updateMessage = (messageId: number, text: string) => {
    dispatch(updateMessageAction({ id: messageId, text }));
  };

  const handleSendMessage = () => {
    const payload = {
      conversation_id,
      query: "generate two single questions",
      survey_id: "66c5fe26ee8565ca5ffc732a",
      survey_stage: "generation",
    };
    emitEvent("user-message", payload);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      senseiStateSetter("start thinking");
      addUserMessage();
      const payload = {
        conversation_id,
        query: input.trim(),
        ...(type === "analysis" ? { survey_id: surveyId } : {}),
        survey_stage: type === "analysis" ? "analysis" : "generation",
      };
      console.log("user_message", payload);
      emitEvent("user_message", payload);
    }
  };

  const handleActionSend = async (actionInput: string) => {
    if (actionInput.trim()) {
      senseiStateSetter("start thinking");
      // addUserMessage(actionInput);

      if (actionInput.toLowerCase().includes("rephrase")) {
        const index = Number(actionInput[actionInput.length - 1]);
        console.log(index);

        // setEditId(index - 1);
        const payload = {
          question_id: index,
          conversation_id,
          data: currentQuestion,
          trigger_type: "single-regen",
        };
        emitEvent("user_trigger", payload);

        // const optionsPayload = {
        //   conversation_id,
        //   data: {
        //     question: {
        //       Question: question,
        //       "Option type": optionType,
        //       Options: options,
        //     },
        //   },
        //   trigger_type: "option",
        // };
        // emitEvent("user_trigger", optionsPayload);
      }
      if (actionInput.toLowerCase().includes("option")) {
        const index = Number(actionInput[actionInput.length - 1]);
        console.log(index);

        // setEditId(index - 1);
        const payload = {
          question_id: index,
          conversation_id,
          data: currentQuestion,
          trigger_type: "option",
        };
        emitEvent("user_trigger", payload);

        // const optionsPayload = {
        //   conversation_id,
        //   data: {
        //     question: {
        //       Question: question,
        //       "Option type": optionType,
        //       Options: options,
        //     },
        //   },
        //   trigger_type: "option",
        // };
        // emitEvent("user_trigger", optionsPayload);
      }
      if (actionInput.toLowerCase().includes("compatibility")) {
        const index = Number(actionInput[actionInput.length - 1]);
        console.log(index);

        console.log(currentQuestionType);

        // setEditId(index - 1);
        const payload = {
          question_id: index,
          conversation_id,
          data: {
            option_type: currentQuestionType,
            question: currentQuestion?.question.Question,
          },
          trigger_type: "check-compatibility",
        };
        emitEvent("user_trigger", payload);

        // const optionsPayload = {
        //   conversation_id,
        //   data: {
        //     question: {
        //       Question: question,
        //       "Option type": optionType,
        //       Options: options,
        //     },
        //   },
        //   trigger_type: "option",
        // };
        // emitEvent("user_trigger", optionsPayload);
      }

      // const payload = {
      //   conversation_id,
      //   query: actionInput.trim(),
      //   ...(type === "analysis" ? { survey_id: surveyId } : {}),
      //   survey_stage: type === "analysis" ? "analysis" : "generation",
      // };
      // console.log("user_message", payload);
      // emitEvent("user_message", payload);
      dispatch(setActionMessage(""));
    }
  };

  useEffect(() => {
    if (actionMessage && Boolean(actionMessage?.length)) {
      handleActionSend(actionMessage);
    }
  }, [actionMessage]);

  useEffect(() => {
    senseiStateSetter(loading ? "start thinking" : "be idle");
  }, [loading, senseiStateSetter]);

  const getCurrentTimestamp = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const surveyId = extractMongoId(path);

  const handleClick = (message: Message, index: number) => {
    if (message.trigger_type === "single-regen") {
      if (aiSave) {
        aiSave(
          message.actions![index],
          currentQuestion?.question.Options || [],
          currentQuestion?.question["Option type"]!,
          message.question_id! - 1
        );
        // if() {
        // }
        // else {
        // }
      }
    }
    if (message.trigger_type === "option") {
      if (aiSave) {
        aiSave(
          currentQuestion?.question.Question!,
          [
            ...(currentQuestion?.question.Options
              ? currentQuestion.question.Options
              : []),
            ...message.actions!,
          ],
          currentQuestion?.question["Option type"] || "", // Fallback to an empty string
          message.question_id! - 1
        );
        // if() {
        // }
        // else {
        // }
      }
    }
    if (message.trigger_type === "check-compatibility") {
      if (aiSave) {
        aiSave(
          currentQuestion?.question.Question!,
          [
            ...(currentQuestion?.question.Options
              ? currentQuestion.question.Options
              : []),
          ],
          message.actions![index], // Fallback to an empty string
          message.question_id! - 1
        );
        // if() {
        // }
        // else {
        // }
      }
    }
    // if (message.trigger_type === "option") {
    //   console.log(message);

    // if (aiSave) {
    //   aiSave(
    //     message.actions![index],
    //     currentQuestion?.question.Options || [],
    //     currentQuestion?.question["Option type"]!,
    //     message.question_id! - 1
    //   );
    // }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPinned) {
      // When unpinning, return to last position
      setIsPinned(false);
      if (lastPosition.x !== 0 || lastPosition.y !== 0) {
        setDefaultPosition(lastPosition);
      }
    } else {
      // When pinning, save current position and move to bottom right
      const chatElement = document.querySelector(
        ".draggable-chat"
      ) as HTMLElement;
      if (chatElement) {
        const rect = chatElement.getBoundingClientRect();
        setLastPosition({ x: rect.left, y: rect.top });
      }
      pinToSide();
      setIsPinned(true);
    }
  };

  // Add resize handler to maintain position when pinned
  useEffect(() => {
    const handleResize = () => {
      if (isPinned) {
        pinToSide();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPinned]);

  return (
    <div
      className={`draggable-chat flex flex-col h-full ${
        isPinned ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-r from-[#5b03b2] rounded-t-md to-[#9d50bb] text-white p-4 pt-10 ${
          isPinned ? "" : "cursor-move"
        }`}
      >
        <p className="text-xl font-bold text-white text-left">Sensei</p>
        <div className="absolute right-4 top-3 p-0 flex justify-end gap-2 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="p-0 size-8 text-white rounded-full hover:bg-white/20 hover:text-white"
            onClick={handlePinClick}
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
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleCollapse());
            }}
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 px-0 space-y-4">
        <AnimatePresence>
          {messages.map((message: Message) => (
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
                      "text-sm p-3 rounded-lg rounded-tl-none text-left",
                      message.sender !== "user"
                        ? "bg-purple-600 text-white"
                        : "bg-[#F1F7FF] text-gray-800"
                    )}
                  >
                    {message.text}
                  </p>
                  <div className="mt-2 space-y-2">
                    {message.actions &&
                      message.actions.map((a, i) => (
                        <Button
                          onClick={() => handleClick(message, i)}
                          key={a}
                          className="block max-w-[200px] text-xs text-wrap text-left bg-blue-50 hover:bg-blue-100 rounded-lg text-black h-fit"
                        >
                          {a.split("_").join(" ")}
                        </Button>
                      ))}
                  </div>
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
            disabled={Boolean(input.trim().length < 1)}
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
