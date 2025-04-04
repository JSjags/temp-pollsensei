"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import Image from "next/image";
import warning from "@/assets/images/warning.png";
import { Button } from "@/components/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import CompletedVideoDialog from "@/components/earn/CompletedVideoDialog";
import ReactPlayer from "react-player";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementAdsWatched,
  resetAdsWatched,
  openAdsDialog,
} from "@/redux/slices/earnDialogSlice";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Modal from "@/components/reusable/Modal";
import { FaCircleCheck } from "react-icons/fa6";

interface Video {
  url: string;
  title: string;
  duration: number;
  reward: number;
  type: any;
}

interface AdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdsDialog: FC<AdsDialogProps> = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();
  const [onSpeaker, setOnSpeaker] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);

  const videos = [
    {
      url: "/videos/ai_powerded.mp4",
      title: "Discover Pollsensei",
      duration: 15,
      reward: 150,
      type: "local",
    },
    {
      url: "/videos/Generate_survey.mp4",
      title: "Introducing Pollsensei Surveys",
      duration: 29,
      reward: 200,
      type: "local",
    },
    {
      url: "/videos/Analysis.mp4",
      title: "Customers Feedback",
      duration: 17,
      reward: 250,
      type: "local",
    },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoData, setVideoData] = useState<Video[]>(videos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [openCompletedVideo, setOpenCompletedVideo] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const currentVideo = videoData[currentVideoIndex];

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(currentVideo.duration);
      setTimeLeft(currentVideo.duration);
    }
  };

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const safeDuration = currentVideo.duration; // Use predefined duration
      const remaining = Math.ceil(safeDuration - video.currentTime);
      setTimeLeft(remaining);
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / safeDuration) * 100);
    }
  };

  const handleVideoEnd = () => {
    setOpenCompletedVideo(true);
    dispatch(incrementAdsWatched());
  };

  const handleWatchNext = () => {
    if (currentVideoIndex < videoData.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setOpenCompletedVideo(false);
      setTimeLeft(videoData[nextIndex].duration);
      setDuration(videoData[nextIndex].duration);
      setProgress(0);
      setCurrentTime(0);
      dispatch(incrementAdsWatched());
      dispatch(openAdsDialog());
    } else {
      setOpenCompletedVideo(false);
      onOpenChange(false);
      dispatch(resetAdsWatched());
    }
  };

  useEffect(() => {
    if (open) {
      setTimeLeft(videoData[currentVideoIndex]?.duration || 1);
      setDuration(videoData[currentVideoIndex]?.duration || 1);
      setProgress(0);
      setCurrentTime(0);

      // Only reset watched ads if it's a fresh session
      if (currentVideoIndex === 0) {
        dispatch(resetAdsWatched());
      }
    }
  }, [open, currentVideoIndex, dispatch, videoData]);

  const formatTime = (seconds: number) => {
    const safeSeconds = isNaN(seconds) ? 0 : seconds;
    const mins = Math.floor(safeSeconds / 60);
    const secs = Math.floor(safeSeconds % 60);
    return <>{`${mins}:${secs < 10 ? "0" : ""}${secs}`}</>;
  };

  const handleContinueExit = () => {
    if (player) {
      player.pauseVideo();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setOpenWarning(false);
    onOpenChange(false);
    setOpenCompletedVideo(false);
  };

  const toggleMute = () => {
    setMuted(!muted);
    setOnSpeaker(!onSpeaker);
  };

  useEffect(() => {
    if (open) {
      setCurrentVideoIndex(0);
      setTimeLeft(videoData[0].duration);
      setDuration(videoData[0].duration);
      setProgress(0);
      setCurrentTime(0);
      dispatch(resetAdsWatched());
    }
  }, [open, videoData, dispatch]);

  const handleWarningClose = () => {
    setOpenWarning(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // console.log({ progress });

  return (
    <>
      {open && (
        <Modal className="w-[90%] lg:min-w-[1100px] min-h-auto border-0 outline-none p-5 lg:p-10 z-[100000] flex flex-col justify-center items-center gap-5">
          <div className="flex justify-between items-center w-full h-auto">
            <Dialog
              open={openWarning}
              onOpenChange={(open) => {
                if (!open) {
                  handleWarningClose();
                }
              }}
            >
              <DialogTrigger asChild>
                <FaArrowLeftLong
                  className="text-2xl text-black cursor-pointer"
                  onClick={() => {
                    if (videoRef.current) videoRef.current.pause();
                    setOpenWarning(true);
                  }}
                />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center gap-5 p-10 max-w-[400px]">
                <Image width={200} height={200} alt="warning" src={warning} />
                <h2 className="text-[28px] font-bold text-[#FF313D]">
                  Are you sure?
                </h2>
                <p className="text-base text-[#898989] text-center">
                  You will not be rewarded if you exit before completing the
                  task.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-1/2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:scale-105 transition-all rounded-lg"
                  type="button"
                  onClick={handleContinueExit}
                >
                  Continue
                </Button>
              </DialogContent>
            </Dialog>
            {progress >= 100 ? (
              <FaCircleCheck className="text-[#5B03B2] text-3xl" />
            ) : (
              <div className="relative w-[40px] h-[40px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#D9D9D9]" />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    mask: "radial-gradient(transparent 15px, black 14px)",
                    background: `conic-gradient(#5B03B2 ${
                      100 - progress
                    }%, transparent ${100 - progress}%)`,
                  }}
                />
                <div className="relative z-10 text-sm font-bold text-[#5B03B2]">
                  {timeLeft}
                </div>
              </div>
            )}
          </div>

          <div className="w-full h-[400px] bg-black flex items-center justify-center relative">
            <video
              ref={videoRef}
              src={currentVideo.url}
              autoPlay
              muted={muted}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleVideoProgress}
              onEnded={handleVideoEnd}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-5 left-2 w-full h-auto flex flex-col gap-2">
              <div className="w-[98%] h-1 bg-gray-200">
                <div
                  className="h-full bg-[#5B03B2]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="w-auto flex items-center gap-2">
                <button onClick={toggleMute} className="text-lg">
                  {muted ? (
                    <HiSpeakerXMark className="text-red-500" />
                  ) : (
                    <HiSpeakerWave className="text-white" />
                  )}
                </button>
                <p className="text-xs text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <CompletedVideoDialog
        openCompletedVideo={openCompletedVideo}
        onOpenCompletedVideoChange={setOpenCompletedVideo}
        onWatchNext={handleWatchNext}
        currentVideoIndex={currentVideoIndex}
        reward={currentVideo.reward}
        videos={videoData}
        handleContinueExit={handleContinueExit}
      />
    </>
  );
};

export default AdsDialog;
