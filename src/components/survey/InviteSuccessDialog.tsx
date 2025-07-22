"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface InviteSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteSuccessDialog({
  open,
  onOpenChange,
}: InviteSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] z-[100000]"
        overlayClassName="z-[100000]"
      >
        <motion.div
          className="flex flex-col items-center text-center py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="rounded-full bg-purple-600 p-3 mb-6"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold mb-2"
          >
            Invite Sent
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-8"
          >
            Collaborators will be added to this survey once
            <br />
            the sent invitation is accepted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
