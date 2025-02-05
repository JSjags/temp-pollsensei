"use client"


import NavBar from "@/components/blocks/NavBar";
import Tutorials from "@/components/resource-hub/tutorials";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <section className="mt-2 min-h-[50vh]">
     <Tutorials />
  </section>
  )
};

export default Page;
