"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { InviteSuccessDialog } from "./InviteSuccessDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collaboratorsApi } from "@/services/collaborators";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectField from "@/components/ui/MultipleSelect";
import { multiSelectCustomStyles } from "@/constants/multi-select";
import { Form, Field } from "react-final-form";

const roles = [
  { value: "Data Collector", label: "Data Collector" },
  { value: "Data Validator", label: "Data Validator" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Data Editor", label: "Data Editor" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "",
    backgroundColor: "#F5FAFF",
    color: "#CC9BFD4D",
    outline: "none",
    padding: "12px 0 12px 1.3rem",
    zIndex: "10000",
  }),
};

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const params = useParams();
  const surveyId = params.id as string;
  const queryClient = useQueryClient();

  const [selectedRoles, setSelectedRoles] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const { mutate: inviteCollaborator, isPending } = useMutation({
    mutationFn: collaboratorsApi.invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators", surveyId] });
      onOpenChange(false);
      setShowSuccess(true);
      // Reset form
      setFormData({ name: "", email: "" });
      setSelectedRoles([]);
    },
  });

  const handleSubmit = (values: any) => {
    inviteCollaborator({
      survey_id: surveyId,
      name: formData.name,
      email: formData.email,
      role: values.role.map((r: any) => r.value),
    });
  };

  const handleSuccessClose = (open: boolean) => {
    setShowSuccess(open);
    if (!open) {
      setSelectedRoles([]);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent
          className="sm:max-w-[425px] z-[100000]"
          overlayClassName="z-[100000]"
        >
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
          </DialogHeader>
          <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit: onSubmit }) => (
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(e);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Mike Abayomi"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mikeabayomi@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div style={{ zIndex: 100 }}>
                  <Field name="role">
                    {({ input, meta }) => (
                      <MultiSelectField
                        input={input}
                        meta={{ ...meta, touched: !!meta.touched }}
                        options={roles}
                        isMulti
                        styles={customStyles}
                        placeholder="Select role"
                        closeMenuOnSelect={false}
                        className="basic-multi-select z-20"
                        classNamePrefix="role"
                        label="Role"
                        customStyles={multiSelectCustomStyles}
                      />
                    )}
                  </Field>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Sending...
                      </div>
                    ) : (
                      "Send Invite"
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          />
        </DialogContent>
      </Dialog>

      <InviteSuccessDialog
        open={showSuccess}
        onOpenChange={handleSuccessClose}
      />
    </>
  );
}
