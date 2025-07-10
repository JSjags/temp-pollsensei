import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ComingSoonSlide {
  title?: string;
  description?: string;
  backUrl?: string;
  eta?: string;
  imageSrc?: string;
}

interface ComingSoonCarouselProps {
  slides: ComingSoonSlide[];
  autoPlayInterval?: number; // ms
}

interface ComingSoonProps {
  title?: string;
  description?: string;
  backUrl?: string;
  eta?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned!",
  backUrl = "/",
  eta = "Q1 2024",
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 md:p-8">
      <Card className="relative mx-auto w-full max-w-4xl overflow-hidden backdrop-blur-sm border-opacity-50 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 animate-gradient" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary w-fit shadow-sm hover:bg-primary/25 transition-colors">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              {eta}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-fit hover:scale-105 transition-transform bg-[#5B03B2]"
            >
              <Link href={backUrl}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return Back
              </Link>
            </Button>
          </div>
          <div className="relative aspect-square w-full max-w-lg mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <Image
              src="/assets/coming-soon.svg"
              alt="Coming Soon Illustration"
              className="object-contain scale-90 hover:scale-95 transition-transform duration-300 drop-shadow-xl"
              fill
              priority
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function PlaceholderRightSide({
  slides,
  autoPlayInterval = 10000,
}: {
  slides: React.ReactNode[];
  autoPlayInterval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [progress, setProgress] = useState(0); // 0-100
  const [elapsed, setElapsed] = useState(0); // ms
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef<number>(0);

  // Effect to handle progress and slide change
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pausedElapsedRef.current = elapsed;
      return;
    }
    // Start or resume
    startTimestampRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const totalElapsed =
        pausedElapsedRef.current + (now - (startTimestampRef.current || now));
      setElapsed(totalElapsed);
      setProgress(Math.min((totalElapsed / autoPlayInterval) * 100, 100));
      if (totalElapsed >= autoPlayInterval) {
        // Advance slide
        pausedElapsedRef.current = 0;
        setElapsed(0);
        setProgress(0);
        setCurrent((prev) => (prev + 1) % slides.length);
        startTimestampRef.current = Date.now();
      }
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [paused, current, autoPlayInterval]);

  // When slide changes, reset elapsed and progress
  useEffect(() => {
    setElapsed(0);
    setProgress(0);
    pausedElapsedRef.current = 0;
    startTimestampRef.current = Date.now();
    // eslint-disable-next-line
  }, [current, autoPlayInterval]);

  const handlePrev = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const handleNext = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const handlePausePlay = () => {
    setPaused((p) => !p);
  };

  // Animation variants
  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "right" ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      width: "100%",
      height: "100%",
      transition: { duration: 0.5, type: "spring" },
    },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? -300 : 300,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      transition: { duration: 0.5, type: "spring" },
    }),
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] rounded-3xl bg-[url('/auth/auth-bg.svg')] bg-cover bg-center flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center relative">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 4rem)" }}
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>
        {/* Floating Controls */}
        <div className="pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex gap-6 z-20 pointer-events-auto">
            <button
              aria-label="Previous slide"
              onClick={handlePrev}
              className="bg-white/80 size-10 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>

            <button
              aria-label="Next slide"
              onClick={handleNext}
              className="bg-white/80 size-10 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition-all flex items-center justify-center"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
            <button
              aria-label={paused ? "Play carousel" : "Pause carousel"}
              onClick={handlePausePlay}
              className="relative bg-[#977BA5]/80 size-10 hover:bg-[#977BA5] shadow-lg rounded-full p-2 transition-all flex items-center justify-center"
              // style={{ width: 56, height: 56 }}
            >
              {/* Animated border */}
              <svg className="absolute top-0 left-0" width="40" height="40">
                <circle
                  cx="20"
                  cy="20"
                  r="19"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={((100 - progress) / 100) * 2 * Math.PI * 19}
                  style={{
                    transition: paused
                      ? undefined
                      : "stroke-dashoffset 0.1s linear",
                  }}
                />
              </svg>
              <span className="relative z-10">
                {paused ? (
                  <Play className="h-6 w-6 text-transparent fill-white" />
                ) : (
                  <Pause className="h-6 w-6 text-transparent fill-white" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// // Minimal placeholder for right side of register page
// export function PlaceholderRightSide() {
//   return (
//     <div className="">
//       <div className="flex h-full w-full items-center justify-center border-l border-gray-200 bg-gray-50 p-8 md:p-12 box-border">
//         <span className="text-gray-400 text-lg text-center w-full">
//           Right Side Placeholder (future content here)
//         </span>
//       </div>
//     </div>
//   );
// }
