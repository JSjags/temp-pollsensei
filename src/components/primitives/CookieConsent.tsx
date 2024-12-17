"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
    const consentGiven = localStorage.getItem("cookieConsent");
    if (consentGiven === null) {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    localStorage.setItem("cookieConsent", consent.toString());
    setShowConsent(false);
  };

  // Prevent closing without making a choice
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if consent has been given
    if (!open && !localStorage.getItem("cookieConsent")) {
      return;
    }
    setShowConsent(open);
  };

  if (!mounted) return null;

  const content = (
    <div className="w-full max-w-lg mx-auto">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          We use cookies to enhance your browsing experience, serve personalized
          ads or content, and analyze our traffic. By clicking "Accept All", you
          consent to our use of cookies.
        </p>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => handleConsent(false)}
        >
          Reject All
        </Button>
        <Button className="auth-btn" onClick={() => handleConsent(true)}>
          Accept All
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={showConsent} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-[425px] z-[1000]"
          overlayClassName="z-[1000]"
          onInteractOutside={(e) => e.preventDefault()} // Prevent closing by clicking outside
          onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing by escape key
        >
          <DialogHeader>
            <DialogTitle>Cookie Settings</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences here.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showConsent} onOpenChange={handleOpenChange}>
      <DrawerContent
        className="z-[1000]"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing by clicking outside
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing by escape key
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Cookie Settings</DrawerTitle>
          <DrawerDescription>
            Manage your cookie preferences here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 mb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
