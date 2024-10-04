import React, { useState, useRef } from "react";
import { AiOutlineAudio } from "react-icons/ai";

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone: ", error);
      setErrorMessage("Microphone access denied or not available.");
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // console.log(audioChunksRef)
  // console.log(audioURL)
  // console.log(mediaRecorderRef)

  return (
    <div className="p-1 ">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex items-center gap-2">
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <AiOutlineAudio className="inline-block mr-2" />
              Record
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-4 text-sm font-semibold rounded-l"
            >
              Stop Recording
            </button>
          )}
        </div>

        {audioURL && (
          <div className="mt-4 text-center flex w-full justify-between items-center">
            {/* <h2 className="text-xs font-semibold flex-1">Your Voice Note</h2> */}
            <audio controls className="w-full mt-2 flex-1">
              <source src={audioURL} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
