import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetSurvey } from "@/redux/slices/survey.slice";
import { motion, AnimatePresence } from "framer-motion";

interface ExitSurveyDialogProps {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onClear: () => void;
}

const ExitSurveyDialog = ({
  isLoading,
  isOpen,
  onClose,
  onSave,
  onClear,
}: ExitSurveyDialogProps) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px] z-[100000] rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border border-gray-100"
        overlayClassName="z-[100000] bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Save Your Progress?
              </DialogTitle>
            </div>
            <DialogDescription className="pt-4 text-base text-gray-600 leading-relaxed">
              You have unsaved changes in your survey. Would you like to save
              your progress as a draft for later, or clear all entries? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onClear}
              className="flex-1 h-12 font-medium border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Survey
            </Button>
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 h-12 font-medium bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Saving..." : "Save as Draft"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitSurveyDialog;
