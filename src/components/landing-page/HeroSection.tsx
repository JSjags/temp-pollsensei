import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { bar_chart, hero_icon_2, pie_chart } from "@/assets/images";
import { useSelector } from "react-redux";
import {
  setAnimationState,
  setCount,
} from "@/redux/slices/sensei-master.slice";
import { RootState } from "@/redux/store";
import { useRive } from "@rive-app/react-canvas";
import { useDispatch } from "react-redux";
import AnimatedCTAButtons from "./AnimatedCTAButtons";
const EnhancedHero = () => {
  const dispatch = useDispatch();
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/pollsensei_master_latest.riv",
    stateMachines: "sensei-states",
    autoplay: true,
    onStateChange: (state) => {
      dispatch(setAnimationState(state.data));
    },
    onLoad: () => {
      const inputs = rive?.stateMachineInputs("sensei-states");
      const trigger = inputs?.find((i) => i.name === "be idle");
      if (trigger) {
        trigger.fire();
      }
    },
  });

  const {
    count = 0, // Fallback to 0 if undefined
    animationState = "Sleeping",
  } = useSelector((state: RootState) => {
    return state.senseiMaster || {};
  });

  useEffect(() => {
    if (rive) {
      const statesLength = rive?.animationNames.length;

      console.log(count);
      console.log(statesLength);

      const inputs = rive?.stateMachineInputs("sensei-states");
      const trigger1 = inputs?.find((i) => i.name === "sleep");
      if (trigger1?.fire) trigger1.fire();
      const trigger2 = inputs?.find((i) => i.name === "be idle");
      if (trigger2?.fire) trigger2.fire();

      if (count >= statesLength) {
        const inputs = rive?.stateMachineInputs("sensei-states");
        const trigger = inputs?.find((i) => i.name === "sleep");
        if (trigger?.fire) trigger.fire();
      } else {
        const inputs = rive?.stateMachineInputs("sensei-states");

        if (count === 0) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
        if (count === 1) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
        if (count === 2) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
        if (count === 3) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
        if (count === 4) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
        if (count === 5) {
          const trigger = inputs?.find((i) => i.name === "be idle");
          console.log(trigger);
          if (trigger?.fire) trigger.fire();
        }
      }
    }
  }, [count, rive]);

  useEffect(() => {
    if (rive) {
      setTimeout(() => {
        dispatch(setCount(count + 1));
      }, 1);
    }
  }, [rive]);

  // Floating animation for charts
  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  // Parallax effect for mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) / 50,
        y: (clientY - centerY) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { scrollY } = useScroll();

  // Create different parallax speeds for each element
  const barChartY = useTransform(scrollY, [0, 1000], [0, 300]);
  const pieChartY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroIconY = useTransform(scrollY, [0, 1000], [0, 200]);
  const titleY = useTransform(scrollY, [0, 1000], [0, 150]);
  const subtitleY = useTransform(scrollY, [0, 1000], [0, 100]);
  const riveY = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative min-h-screen flex-col gap-10 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 hero_bg">
      <motion.div
        style={{ y: riveY }}
        className={cn(
          "rive-animation size-60 max-w-60 max-h-60 transition-all flex justify-center items-center"
        )}
      >
        <RiveComponent className="size-[100%] object-cover rounded-full cursor-pointer flex justify-center items-center mx-auto translate-x-[15%]" />
      </motion.div>

      <motion.div className="text-center relative z-10">
        <motion.h1
          style={{ y: titleY }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-[500] mb-6 leading-10 md:leading-loose 
          text-black font-inter lg:leading-[96px]"
        >
          Redefining Survey Creation for <br className="hidden lg:block" />{" "}
          Smarter Insights
        </motion.h1>

        <motion.p
          style={{ y: subtitleY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs sm:text-sm md:text-lg mb-12 max-w-3xl mx-auto text-black"
        >
          Experience AI-powered surveys that make every response meaningful and{" "}
          <br className="hidden lg:block" /> every decision impactful.
        </motion.p>

        <AnimatedCTAButtons />
      </motion.div>

      {/* Parallax Images */}
      <motion.div
        style={{ y: barChartY }}
        className="hidden lg:block absolute top-56 left-48"
      >
        <Image
          src={bar_chart}
          alt="Bar Chart"
          width={100}
          height={100}
          className="transform hover:scale-110 transition-transform duration-300"
        />
      </motion.div>

      <motion.div
        style={{ y: pieChartY }}
        className="hidden lg:block absolute top-48 right-56"
      >
        <Image
          src={pie_chart}
          alt="Pie Chart"
          width={100}
          height={100}
          className="transform hover:scale-110 transition-transform duration-300"
        />
      </motion.div>

      <motion.div
        style={{ y: heroIconY }}
        className="absolute bottom-0 right-56"
      >
        <Image
          src={hero_icon_2}
          alt="Hero Icon"
          width={150}
          height={150}
          className="transform hover:scale-110 transition-transform duration-300"
        />
      </motion.div>
    </section>
  );
};

export default EnhancedHero;

// Survey in Seconds
// AI-Powered Assistant
// Insightful, Actionable Analysis
