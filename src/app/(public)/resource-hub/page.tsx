"use client"


import NavBar from "@/components/blocks/NavBar";
import FeatureComing from "@/components/common/FeatureComing";
// import Navbar from "@/components/navbar/Navbar";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <section className="mt-2 min-h-[50vh]">
      <NavBar />
    <FeatureComing height="min-h-[70vh]" />
  </section>
  )
};

export default page;
