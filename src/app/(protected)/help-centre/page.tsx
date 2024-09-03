"use client";
import PollProfessor from "@/components/ai/PollProfessor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

const videoTutorials = "/assets/help-centre/video-tutorials.svg";
const faqs = "/assets/help-centre/faqs.svg";
const contact = "/assets/help-centre/contact.svg";
const pollProfessor = "/assets/help-centre/poll-professor.svg";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  // const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <Fade duration={1000}>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Or choose a category to find the help you need
        </h2>
      </Fade>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Slide direction="up" cascade duration={500} triggerOnce>
          <Fade duration={1000}>
            <Link href={"/help-centre/tutorials"}>
              <Card className="min-h-[300px] hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-purple-800 transition-all cursor-pointer">
                <CardHeader className="flex flex-col items-start gap-4">
                  <img src={videoTutorials} />
                  <CardTitle>Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get started quickly: We have Beginner-friendly tutorials and
                    resources for you.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </Fade>
          <Fade duration={1000}>
            <Link href={"/help-centre/faqs"}>
              <Card className="min-h-[300px] hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-purple-800 transition-all cursor-pointer">
                <CardHeader className="flex flex-col items-start gap-4">
                  <img src={faqs} />
                  <CardTitle>FAQS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 pb-6">
                    Check out some of our frequently asked questions. We have
                    answered most of the questions we think you have.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </Fade>
          <Fade duration={1000}>
            <Link href={"/help-centre/contact-us"}>
              <Card className="min-h-[300px] hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-purple-800 transition-all cursor-pointer">
                <CardHeader className="flex flex-col items-start gap-4">
                  <img src={contact} />
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your questions and comments are important to us. Reach out
                    to us anytime for support, inquiries, or just to say hello!
                  </p>
                </CardContent>
              </Card>
            </Link>
          </Fade>
          <Fade duration={1000}>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger onClick={() => setIsOpen(true)}>
                <Card className="min-h-[300px] hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-purple-800 transition-all cursor-pointer">
                  <CardHeader className="flex flex-col items-start gap-4">
                    <img src={pollProfessor} />
                    <CardTitle>PollSensei Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-left">
                      Chat with us! Our Poll Sensei AI support bot is here to
                      help answer your questions and solve your problems.
                    </p>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent className="p-0" closeBtnClassName="hidden">
                <PollProfessor isOpen={isOpen} setIsOpen={setIsOpen} />
              </SheetContent>
            </Sheet>
          </Fade>
        </Slide>
      </div>
    </main>
  );
}
