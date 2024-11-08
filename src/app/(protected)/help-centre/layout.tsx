"use client";

import { Input } from "@/components/ui/shadcn-input";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Slide } from "react-awesome-reveal";

export default function Component({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {!["tutorials"].some((p) => path.includes(p)) && (
        <Slide duration={500} direction="down">
          <header className="bg-[url('/assets/help-centre/hero-bg.svg')] bg-no-repeat bg-cover bg-center p-6 md:p-10 px-0 md:px-0">
            <div className="container mx-auto px-4">
              <button onClick={() => router.back()} className="text-white mb-4">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
                How can we help you?
              </h1>
              {/* <div className="relative max-w-[424px] mx-auto">
                <Input
                  className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-black ring-offset-purple-500 outline-purple-500 focus-visible:outline-purple-500"
                  placeholder="Search"
                  type="search"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div> */}
            </div>
          </header>
        </Slide>
      )}
      {children}
    </div>
  );
}
