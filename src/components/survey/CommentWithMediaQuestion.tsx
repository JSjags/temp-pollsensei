import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, {
  useState,
  SetStateAction,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import VoiceRecorder from "../ui/VoiceRecorder";
import { BsExclamation } from "react-icons/bs";
import {
  Check,
  Edit3,
  GripVertical,
  Heading3,
  MessageSquare,
} from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import WaveSurfer from "wavesurfer.js";
import {
  AiOutlinePause,
  AiOutlinePlayCircle,
  AiOutlineReload,
} from "react-icons/ai";
import { Volume2Icon } from "lucide-react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";
import { isValidElement } from "react";
import parse from "html-react-parser";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import {
  Underline as UnderlineIcon,
  Strikethrough,
  Quote,
  Heading1,
  Heading2,
  TextQuote,
  Highlighter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Rewind, FastForward } from "lucide-react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface ComponentQuestionProps {
  question: string;
  audio?: string;
  response?: string;
  mediaUrl?: string;
  onTranscribe?: (updatedResponse: string) => void;
  questionType: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const MenuButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`p-1 sm:p-2 rounded-lg hover:bg-purple-50 transition-colors ${
      isActive ? "text-purple-600 bg-purple-50" : "text-gray-600"
    }`}
  >
    {children}
  </button>
);

const isHTMLContent = (content: string): boolean => {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
};

const TranscriptionEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing your transcription...",
      }),
      TextAlign.configure({
        types: ["paragraph", "heading"],
        defaultAlignment: "left",
        alignments: ["left", "center", "right"],
      }),
      Underline,
      Strike,
      Highlight,
    ],
    content: isHTMLContent(content) ? content : `<p>${content}</p>`,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange(htmlContent);
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-[#5B03B2] focus-within:border-transparent">
      <div className="flex flex-wrap items-center gap-1 p-1 sm:p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg sticky top-[244px] sm:top-[224px] z-50">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 size={16} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-200 mx-1" />

        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          >
            <Strikethrough size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
          >
            <Highlighter size={16} />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
        </div>

        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          >
            <List size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          >
            <ListOrdered size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
          >
            <TextQuote size={16} />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
        </div>

        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
          >
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
          >
            <AlignRight size={16} />
          </MenuButton>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <MenuButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo size={16} />
          </MenuButton>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose max-w-none focus:outline-none min-h-[150px] sm:min-h-[200px] px-2 sm:px-4 py-2 sm:py-3"
      />

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-lg border border-gray-200">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
          >
            <Highlighter size={14} />
          </MenuButton>
        </div>
      </BubbleMenu>
    </div>
  );
};

const ContentRenderer = ({ content }: { content: string }) => {
  if (isHTMLContent(content)) {
    return <div className="prose prose-sm max-w-none">{parse(content)}</div>;
  }

  return (
    <p className="text-gray-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
      {content}
    </p>
  );
};

const PLAYBACK_RATES = [
  { value: "0.5", label: "0.5x" },
  { value: "0.75", label: "0.75x" },
  { value: "1", label: "1x" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x" },
  { value: "2", label: "2x" },
];

const AUDIO_PLAYER_STYLES = {
  container:
    "mt-4 p-2 sm:p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border-2 border-purple-600 shadow-sm overflow-hidden",
  waveformContainer:
    "flex items-center gap-2 sm:gap-4 bg-white rounded-lg p-2 sm:p-3 mb-3 border border-purple-100 overflow-hidden",
  waveformWrapper:
    "flex-1 overflow-hidden [&_*]:!scrollbar-none [&_*]:!-webkit-scrollbar-none [&_*]:!-ms-overflow-style-none",
  playButton:
    "flex-shrink-0 p-2 sm:p-3 text-purple-600 hover:text-purple-700 bg-purple-50 rounded-full transition-all duration-200 hover:bg-purple-100",
  controlsGroup:
    "flex flex-wrap items-center justify-center bg-white rounded-lg shadow-sm p-1 border border-purple-100 gap-1 sm:gap-6 md:gap-10",
  controlsWrapper: "flex flex-col items-center gap-2 sm:gap-4",
  timeDisplay:
    "flex items-end justify-end gap-2 text-xs sm:text-sm font-medium text-purple-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg",
  buttonBase:
    "flex items-center gap-1 p-1 sm:p-2 text-gray-600 hover:text-purple-700 text-xs sm:text-sm",
  volumeControl:
    "hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm p-2",
};

const TranscriptionDialog = ({
  isOpen,
  onOpenChange,
  mediaUrl,
  editableResponse,
  setEditableResponse,
  onSave,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string;
  editableResponse: string;
  setEditableResponse: (value: string) => void;
  onSave: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState("1");

  const initWaveform = useCallback(
    (initialPlaybackRate: string) => {
      if (waveformContainerRef.current) {
        if (waveformRef.current) {
          waveformRef.current.destroy();
        }

        const wavesurfer = WaveSurfer.create({
          container: waveformContainerRef.current,
          waveColor: "#9D50BB",
          progressColor: "#6E48AA",
          cursorColor: "#6E48AA",
          dragToSeek: true,
          barWidth: 2,
          barRadius: 3,
          height: 60,
          normalize: true,
          minPxPerSec: 50,
          width: waveformContainerRef.current.clientWidth - 32,
        });

        Object.assign(waveformRef, { current: wavesurfer });

        if (mediaUrl) {
          waveformRef.current?.load(mediaUrl);
        }

        waveformRef.current?.on("ready", () => {
          setDuration(waveformRef.current?.getDuration() || 0);
          waveformRef.current?.setVolume(volume);
          waveformRef.current?.setPlaybackRate(parseFloat(initialPlaybackRate));
        });

        waveformRef.current?.on("finish", () => {
          setIsPlaying(false);
        });

        waveformRef.current?.on("audioprocess", () => {
          setCurrentTime(waveformRef.current?.getCurrentTime() || 0);
        });

        waveformRef.current?.on("play", () => {
          setIsPlaying(true);
        });

        waveformRef.current?.on("pause", () => {
          setIsPlaying(false);
        });
      }
    },
    [mediaUrl]
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        initWaveform(playbackRate);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initWaveform]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    if (waveformRef.current) {
      if (isPlaying) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.play();
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (waveformRef.current) {
      waveformRef.current.setVolume(value);
      setVolume(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl z-[100000] h-[95vh] sm:h-[90vh] px-2 sm:px-4 w-[95vw] sm:w-auto"
        overlayClassName="z-[100000]"
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Edit Transcription
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto space-y-4 sm:space-y-6 px-1 sm:px-2">
          <div className="z-10 bg-white pb-4 space-y-4">
            <div
              className={cn(AUDIO_PLAYER_STYLES.container, "sticky top-0 z-50")}
            >
              <div className={AUDIO_PLAYER_STYLES.timeDisplay}>
                <div className="flex justify-end items-center gap-2 w-fit bg-white p-1 rounded-lg">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <div className={AUDIO_PLAYER_STYLES.waveformContainer}>
                <button
                  onClick={togglePlayPause}
                  className={AUDIO_PLAYER_STYLES.playButton}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <div className={AUDIO_PLAYER_STYLES.waveformWrapper}>
                  <div ref={waveformContainerRef} className="w-full" />
                </div>
              </div>

              <div className={AUDIO_PLAYER_STYLES.controlsWrapper}>
                <div className={`${AUDIO_PLAYER_STYLES.controlsGroup} gap-6`}>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (waveformRef.current) {
                          const newTime =
                            waveformRef.current.getCurrentTime() - 5;
                          waveformRef.current.setTime(Math.max(0, newTime));
                        }
                      }}
                      className={AUDIO_PLAYER_STYLES.buttonBase}
                      title="Rewind 5 seconds"
                    >
                      <Rewind size={18} />
                      <span className="text-xs">5s</span>
                    </button>
                    <button
                      onClick={() => {
                        if (waveformRef.current) {
                          const newTime =
                            waveformRef.current.getCurrentTime() - 2;
                          waveformRef.current.setTime(Math.max(0, newTime));
                        }
                      }}
                      className={AUDIO_PLAYER_STYLES.buttonBase}
                      title="Rewind 2 seconds"
                    >
                      <Rewind size={18} />
                      <span className="text-xs">2s</span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-2" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLooping(!isLooping);
                      }}
                      className={`${AUDIO_PLAYER_STYLES.buttonBase} text-sm ${
                        isLooping ? "text-purple-600" : "text-gray-500"
                      }`}
                    >
                      <RotateCcw size={16} />
                      <span>{isLooping ? "Stop Loop" : "Loop"}</span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-2" />

                    <button
                      onClick={() => {
                        if (waveformRef.current) {
                          const newTime =
                            waveformRef.current.getCurrentTime() + 2;
                          waveformRef.current.setTime(
                            Math.min(duration, newTime)
                          );
                        }
                      }}
                      className={AUDIO_PLAYER_STYLES.buttonBase}
                      title="Forward 2 seconds"
                    >
                      <FastForward size={18} />
                      <span className="text-xs">2s</span>
                    </button>

                    <button
                      onClick={() => {
                        if (waveformRef.current) {
                          const newTime =
                            waveformRef.current.getCurrentTime() + 5;
                          waveformRef.current.setTime(
                            Math.min(duration, newTime)
                          );
                        }
                      }}
                      className={AUDIO_PLAYER_STYLES.buttonBase}
                      title="Forward 5 seconds"
                    >
                      <FastForward size={18} />
                      <span className="text-xs">5s</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <Select
                      defaultValue="1"
                      onValueChange={(value) => {
                        if (waveformRef.current) {
                          waveformRef.current.setPlaybackRate(
                            parseFloat(value)
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-[70px] sm:w-[110px] text-xs sm:text-sm bg-white shadow-sm">
                        <SelectValue placeholder="1x" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAYBACK_RATES.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className={AUDIO_PLAYER_STYLES.volumeControl}>
                      <Volume2 size={16} className="text-gray-500" />
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[volume]}
                        onValueChange={([value]) => handleVolumeChange(value)}
                        className="w-12 sm:w-20 !h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-t-lg pb-10">
              <TranscriptionEditor
                content={editableResponse}
                onChange={setEditableResponse}
              />
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-[1000000] backdrop-blur-[1000000px] border-t border-border pt-2 sm:pt-4">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xs sm:text-sm py-1.5 px-2 sm:px-4"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90 text-xs sm:text-sm py-1.5 px-2 sm:px-4"
                onClick={onSave}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommentWithMediaQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  audio,
  mediaUrl,
  options,
  onChange,
  status,
  is_required,
  setIsRequired,
  onSave,
  setEditId,
  onTranscribe,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  console.log(response);

  const [editableResponse, setEditableResponse] = useState(response || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainIsPlaying, setMainIsPlaying] = useState(false);
  const [dialogIsPlaying, setDialogIsPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState(1);
  const [dialogVolume, setDialogVolume] = useState(1);
  const [mainCurrentTime, setMainCurrentTime] = useState(0);
  const [dialogCurrentTime, setDialogCurrentTime] = useState(0);
  const [mainDuration, setMainDuration] = useState(0);
  const [dialogDuration, setDialogDuration] = useState(0);
  const [isDialogReady, setIsDialogReady] = useState(false);

  const waveformRef = useRef<WaveSurfer | null>(null);
  const dialogWaveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const dialogWaveformContainerRef = useRef<HTMLDivElement>(null);

  const initWaveform = (
    containerRef: React.RefObject<HTMLDivElement>,
    wavesurferRef: React.RefObject<WaveSurfer>,
    setCurrentTime: (time: number) => void,
    setDuration: (duration: number) => void,
    setIsPlaying: (isPlaying: boolean) => void
  ) => {
    if (containerRef.current) {
      // Destroy existing instance if it exists
      wavesurferRef.current?.destroy();

      // Create new instance with updated config
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#9D50BB",
        progressColor: "#6E48AA",
        cursorColor: "#6E48AA",
        dragToSeek: true,
        barWidth: 2,
        barRadius: 3,
        height: 60,
        normalize: true,
        minPxPerSec: 50,
        width: containerRef.current.clientWidth - 32,
      });

      // Assign the new instance
      Object.assign(wavesurferRef, { current: wavesurfer });

      if (mediaUrl) {
        wavesurferRef.current?.load(mediaUrl);
      }

      wavesurferRef.current?.on("finish", () => {
        setIsPlaying(false);
        if (isLooping) {
          wavesurferRef.current?.play();
        }
      });

      wavesurferRef.current?.on("audioprocess", () => {
        setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
      });

      wavesurferRef.current?.on("ready", () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
        if (wavesurferRef.current) {
          wavesurferRef.current.setVolume(1);
        }
      });

      wavesurferRef.current?.on("play", () => {
        setIsPlaying(true);
        if (
          wavesurferRef === waveformRef &&
          dialogWaveformRef.current?.isPlaying()
        ) {
          dialogWaveformRef.current.pause();
          setDialogIsPlaying(false);
        } else if (
          wavesurferRef === dialogWaveformRef &&
          waveformRef.current?.isPlaying()
        ) {
          waveformRef.current.pause();
          setMainIsPlaying(false);
        }
      });

      wavesurferRef.current?.on("pause", () => {
        setIsPlaying(false);
      });
    }
  };

  useEffect(() => {
    setEditableResponse(response || "");
  }, [response]);

  useEffect(() => {
    if (pathname.includes("survey-response-upload") && mediaUrl) {
      initWaveform(
        waveformContainerRef,
        waveformRef,
        setMainCurrentTime,
        setMainDuration,
        setMainIsPlaying
      );
    }
  }, [mediaUrl]);

  useEffect(() => {
    if (isDialogOpen && mediaUrl) {
      setIsDialogReady(false);

      if (dialogWaveformRef.current) {
        dialogWaveformRef.current.destroy();
      }

      const mountTimer = setTimeout(() => {
        setIsDialogReady(true);
        initWaveform(
          dialogWaveformContainerRef,
          dialogWaveformRef,
          setDialogCurrentTime,
          setDialogDuration,
          setDialogIsPlaying
        );
      }, 100);
    } else {
      setIsDialogReady(false);
    }
  }, [isDialogOpen, mediaUrl]);

  const handleTranscriptionUpdate = () => {
    if (onTranscribe) {
      onTranscribe(editableResponse);
      setIsDialogOpen(false);
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1 transition-all duration-200 hover:bg-green-600">
            <Check
              strokeWidth={1.5}
              className="w-4 h-4 text-white"
              aria-label="Passed validation"
            />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1 transition-all duration-200 hover:bg-red-600">
            <BsExclamation
              className="w-4 h-4 text-white"
              aria-label="Failed validation"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const togglePlayPause = (
    e: React.MouseEvent,
    wavesurferRef: React.RefObject<WaveSurfer>,
    isPlaying: boolean,
    setIsPlaying: (isPlaying: boolean) => void
  ) => {
    e.preventDefault();
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  const handleVolumeChange = (
    value: number,
    wavesurferRef: React.RefObject<WaveSurfer>,
    setVolumeState: (volume: number) => void
  ) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(value);
      setVolumeState(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderAudioControls = (
    containerRef: React.RefObject<HTMLDivElement>,
    wavesurferRef: React.RefObject<WaveSurfer>,
    isPlaying: boolean,
    setIsPlaying: (isPlaying: boolean) => void,
    currentTime: number,
    duration: number,
    volume: number,
    setVolume: (volume: number) => void
  ) => (
    <div className={AUDIO_PLAYER_STYLES.container}>
      <div className={AUDIO_PLAYER_STYLES.timeDisplay}>
        <div className="flex justify-end items-center gap-2 w-fit bg-white p-1 rounded-lg">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className={AUDIO_PLAYER_STYLES.waveformContainer}>
        <button
          onClick={(e) =>
            togglePlayPause(e, wavesurferRef, isPlaying, setIsPlaying)
          }
          className={AUDIO_PLAYER_STYLES.playButton}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className={AUDIO_PLAYER_STYLES.waveformWrapper}>
          <div ref={containerRef} className="w-full" />
        </div>
      </div>

      <div className={AUDIO_PLAYER_STYLES.controlsWrapper}>
        <div className={`${AUDIO_PLAYER_STYLES.controlsGroup} gap-6`}>
          <div className="flex items-center">
            <button
              onClick={() => {
                if (wavesurferRef.current) {
                  const newTime = wavesurferRef.current.getCurrentTime() - 5;
                  wavesurferRef.current.setTime(Math.max(0, newTime));
                }
              }}
              className={AUDIO_PLAYER_STYLES.buttonBase}
              title="Rewind 5 seconds"
            >
              <Rewind size={18} />
              <span className="text-xs">5s</span>
            </button>
            <button
              onClick={() => {
                if (wavesurferRef.current) {
                  const newTime = wavesurferRef.current.getCurrentTime() - 2;
                  wavesurferRef.current.setTime(Math.max(0, newTime));
                }
              }}
              className={AUDIO_PLAYER_STYLES.buttonBase}
              title="Rewind 2 seconds"
            >
              <Rewind size={18} />
              <span className="text-xs">2s</span>
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLooping(!isLooping);
              }}
              className={`${AUDIO_PLAYER_STYLES.buttonBase} text-sm ${
                isLooping ? "text-purple-600" : "text-gray-500"
              }`}
            >
              <RotateCcw size={16} />
              <span>{isLooping ? "Stop Loop" : "Loop"}</span>
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => {
                if (wavesurferRef.current) {
                  const newTime = wavesurferRef.current.getCurrentTime() + 2;
                  wavesurferRef.current.setTime(Math.min(duration, newTime));
                }
              }}
              className={AUDIO_PLAYER_STYLES.buttonBase}
              title="Forward 2 seconds"
            >
              <FastForward size={18} />
              <span className="text-xs">2s</span>
            </button>

            <button
              onClick={() => {
                if (wavesurferRef.current) {
                  const newTime = wavesurferRef.current.getCurrentTime() + 5;
                  wavesurferRef.current.setTime(Math.min(duration, newTime));
                }
              }}
              className={AUDIO_PLAYER_STYLES.buttonBase}
              title="Forward 5 seconds"
            >
              <FastForward size={18} />
              <span className="text-xs">5s</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Select
              defaultValue="1"
              onValueChange={(value) => {
                if (wavesurferRef.current) {
                  wavesurferRef.current.setPlaybackRate(parseFloat(value));
                }
              }}
            >
              <SelectTrigger className="w-[80px] sm:w-[110px] bg-white shadow-sm">
                <SelectValue placeholder="1x" />
              </SelectTrigger>
              <SelectContent>
                {PLAYBACK_RATES.map((rate) => (
                  <SelectItem key={rate.value} value={rate.value}>
                    {rate.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className={AUDIO_PLAYER_STYLES.volumeControl}>
              <Volume2 size={20} className="text-gray-500" />
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={([value]) =>
                  handleVolumeChange(value, wavesurferRef, setVolume)
                }
                className="w-16 sm:w-20 !h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTranscriptionSection = () => {
    if (pathname.includes("survey-response-upload") && mediaUrl) {
      return (
        <div className="flex flex-col gap-4 w-full">
          <div className="relative w-full">
            {renderAudioControls(
              waveformContainerRef,
              waveformRef,
              mainIsPlaying,
              setMainIsPlaying,
              mainCurrentTime,
              mainDuration,
              mainVolume,
              setMainVolume
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 max-h-[300px] overflow-y-auto">
              <ContentRenderer content={editableResponse} />
            </div>
            <div className="flex justify-end w-full">
              <Button
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit3 size={18} />
                Edit Transcription
              </Button>
            </div>
          </div>

          <TranscriptionDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            mediaUrl={mediaUrl || ""}
            editableResponse={editableResponse}
            setEditableResponse={setEditableResponse}
            onSave={handleTranscriptionUpdate}
          />
        </div>
      );
    }
    if (pathname.includes("survey-response-upload") && !mediaUrl) {
      return (
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 max-h-[300px] overflow-y-auto">
            <ContentRenderer content={editableResponse} />
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      if (waveformRef.current && waveformContainerRef.current) {
        (waveformRef.current as any).setWidth(
          waveformContainerRef.current.clientWidth - 32
        );
      }
      if (dialogWaveformRef.current && dialogWaveformContainerRef.current) {
        (dialogWaveformRef.current as any).setWidth(
          dialogWaveformContainerRef.current.clientWidth - 32
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "mb-4 sm:mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-3 sm:p-6 transition-all duration-300",
        {
          [`font-${questionText?.name
            ?.split(" ")
            .join("-")
            .toLowerCase()
            .replace(/\s+/g, "-")}`]: questionText?.name,
        }
      )}
    >
      <div className="flex gap-2 sm:gap-4">
        <GripVertical
          className={`w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mt-1 ${
            pathname === "/surveys/create-survey" ? "visible" : "hidden"
          }`}
        />
        <div className="flex-1 space-y-2 sm:space-y-4">
          <div className="flex items-start">
            <span className="font-semibold min-w-[20px] sm:min-w-[24px] text-sm sm:text-base">
              {index}.
            </span>
            <div className="flex-1">
              <h3 className="group font-semibold">
                <div className="flex items-start gap-2">
                  <span className="text-left">{question}</span>
                  {is_required && (
                    <span className="text-2xl text-red-500">*</span>
                  )}
                </div>
              </h3>
            </div>
            {!pathname.includes("survey-public-response") && (
              <PollsenseiTriggerButton
                key={index}
                imageUrl={stars}
                tooltipText="Rephrase question"
                className="group-hover:inline-block hidden"
                triggerType="rephrase"
                question={question}
                optionType={questionType}
                options={options}
                setEditId={setEditId}
                onSave={onSave!}
                index={index}
              />
            )}
          </div>

          {renderTranscriptionSection()}

          {pathname === "/surveys/edit-survey" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Required</span>
                <Switch
                  checked={is_required}
                  onCheckedChange={
                    setIsRequired && ((checked) => setIsRequired(checked))
                  }
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] scale-90"
                />
              </div>
            </div>
          )}
        </div>
        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>
      <div className="flex justify-end mt-2 sm:mt-4">
        <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Comment with Media
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommentWithMediaQuestion;
