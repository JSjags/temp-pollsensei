import { useUploadResponseFileMutation } from "@/services/survey.service";
import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineAudio,
  AiOutlineDelete,
  AiOutlineUpload,
  AiOutlinePause,
  AiOutlinePlayCircle,
  AiOutlineReload,
  AiOutlineSound,
} from "react-icons/ai";
import { toast } from "react-toastify";
import WaveSurfer from "wavesurfer.js";
import { Slider } from "./slider";
import { Volume2Icon } from "lucide-react";
import { Button } from "./button";

const PublicResponseFile = ({
  question,
  handleAnswerChange,
  selectedValue,
  required,
  isDisabled,
  onFocus,
  onBlur,
}: {
  question: string;
  handleAnswerChange: (key: string, value: any) => void;
  selectedValue: string;
  required: boolean;
  isDisabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudio, setIsAudio] = useState(true);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [uploadResponseFile] = useUploadResponseFileMutation();

  const handleDisables = () => {
    if (isDisabled) {
      toast.warning("Textarea is active or already has a value.");
      return;
    }
  };

  const initWaveform = () => {
    if (waveformContainerRef.current) {
      if (waveformRef.current) {
        try {
          waveformRef.current.destroy();
        } catch (error) {
          console.log("Error destroying waveform:", error);
        }
      }

      try {
        waveformRef.current = WaveSurfer.create({
          container: waveformContainerRef.current,
          waveColor: "#9D50BB",
          progressColor: "#6E48AA",
          cursorColor: "#6E48AA",
          dragToSeek: true,
          barWidth: 2,
          barRadius: 3,
          height: 60,
          normalize: true,
          fillParent: true,
          minPxPerSec: 50,
          plugins: [],
        });

        if (audioURL) {
          waveformRef.current.load(audioURL);
        }

        waveformRef.current.on("finish", () => {
          setIsPlaying(false);
          if (isLooping) {
            waveformRef.current?.play();
          }
        });

        waveformRef.current.on("audioprocess", () => {
          setCurrentTime(waveformRef.current?.getCurrentTime() || 0);
        });

        waveformRef.current.on("ready", () => {
          setDuration(waveformRef.current?.getDuration() || 0);
        });
      } catch (error) {
        console.log("Error creating waveform:", error);
      }
    }
  };

  useEffect(() => {
    initWaveform();
    return () => {
      waveformRef.current?.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (audioURL) {
      initWaveform();
    }
  }, [audioURL]);

  const handleStartRecording = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (isDisabled) {
      toast.warning("Textarea is active or already has a value.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          const tempBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const tempUrl = URL.createObjectURL(tempBlob);
          if (waveformRef.current) {
            waveformRef.current.load(tempUrl);
          }
        }
      };

      mediaRecorder.onstop = async () => {
        const fileName = `audio_${Date.now()}.wav`;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const newAudioFile = new File([audioBlob], fileName, {
          type: "audio/wav",
        });

        setAudioFile(newAudioFile);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied or not available.");
    }
  };

  const handleStopRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDisabled) {
      toast.warning("You text input has been saved already.");
      return;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleDeleteRecording = (e: React.MouseEvent) => {
    e.preventDefault();

    setAudioURL(null);
    setAudioFile(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    handleAnswerChange(question, { media_url: "" });

    try {
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
      initWaveform();
    } catch (error) {
      console.log("Error handling delete:", error);
    }
  };

  const handleUploadRecording = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!audioFile) {
      toast.error("No audio recording to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      const response = await uploadResponseFile(formData).unwrap();
      const mediaUrl = response?.data?.media_url;
      if (mediaUrl) {
        handleAnswerChange(question, { media_url: mediaUrl });
        setIsUploaded(true);
        toast.success("Audio uploaded successfully!");
      } else {
        toast.error("Failed to get media URL from the server.");
      }
    } catch (error) {
      toast.error("Failed to upload the audio.");
    } finally {
      setUploading(false);
    }
  };

  const handleNewRecording = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Clear all states
    setIsUploaded(false);
    setAudioURL(null);
    setAudioFile(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    handleAnswerChange(question, { media_url: "" });

    // Clean up waveform
    try {
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
      initWaveform();
    } catch (error) {
      console.log("Error handling waveform cleanup:", error);
    }

    // Automatically start new recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          const tempBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const tempUrl = URL.createObjectURL(tempBlob);
          if (waveformRef.current) {
            waveformRef.current.load(tempUrl);
          }
        }
      };

      mediaRecorder.onstop = async () => {
        const fileName = `audio_${Date.now()}.wav`;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const newAudioFile = new File([audioBlob], fileName, {
          type: "audio/wav",
        });

        setAudioFile(newAudioFile);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied or not available.");
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    if (waveformRef.current) {
      if (isPlaying) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
    <div className="bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
      {isUploaded ? (
        <div className="mb-4">
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <AiOutlineSound size={20} />
                <span className="font-medium text-sm">
                  Audio response uploaded successfully
                </span>
              </div>
              <Button
                type="button"
                onClick={handleNewRecording}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                <AiOutlineAudio className="mr-2" size={20} />
                Record New Response
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          {!isRecording ? (
            <Button
              type="button"
              onClick={handleStartRecording}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                isDisabled
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white transition-colors`}
              disabled={isDisabled}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <AiOutlineAudio className="mr-2" size={20} />
              Record
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleStopRecording}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Stop Recording
            </Button>
          )}

          {(audioURL || audioFile) && (
            <>
              <Button
                type="button"
                onClick={handleUploadRecording}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
                disabled={uploading}
              >
                <AiOutlineUpload className="mr-2" size={20} />
                {uploading ? "Uploading..." : "Upload"}
              </Button>

              <Button
                type="button"
                onClick={handleDeleteRecording}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <AiOutlineDelete className="mr-2" size={20} />
                Delete
              </Button>
            </>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div ref={waveformContainerRef} className="mb-3" />

        {audioURL && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0">
              <button
                onClick={togglePlayPause}
                className="flex items-center px-0 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                {isPlaying ? (
                  <>
                    <AiOutlinePause className="mr-2" size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <AiOutlinePlayCircle className="mr-2" size={20} />
                    Play
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLooping(!isLooping);
                }}
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  isLooping ? "text-purple-600" : "text-gray-500"
                } hover:text-purple-700`}
              >
                <AiOutlineReload className="mr-2" size={20} />
                Repeat
              </button>

              <div className="flex items-center gap-2">
                <Volume2Icon size={20} className="text-gray-500" />
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[volume]}
                  onValueChange={([value]) => handleVolumeChange(value)}
                  className="w-20 !h-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicResponseFile;
