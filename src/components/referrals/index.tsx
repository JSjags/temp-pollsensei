"use client";
import React from "react";
import { Analytics } from "./components/Analytics";
import { HowItWorks } from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function Referrals() {
  return (
    <div className="max-w-full">
      <Analytics />
      <HowItWorks/>
      <Footer/>
    </div>
  );
}
