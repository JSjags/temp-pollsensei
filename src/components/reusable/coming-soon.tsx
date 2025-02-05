import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
