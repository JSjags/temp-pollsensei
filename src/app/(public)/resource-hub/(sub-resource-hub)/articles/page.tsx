"use client"


import NavBar from "@/components/blocks/NavBar";
import ArticlesGrid from "@/components/resource-hub/article-grid";
import Help from "@/components/resource-hub/hero";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <section className="mt-2 min-h-[50vh]">
    <ArticlesGrid />
  </section>
  )
};

export default Page;
