import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCalendarContext } from "../../calendar-context";

export default function CalendarHeaderActionsAdd() {
  const { setNewEventDialogOpen } = useCalendarContext();
  return (
    <Button
      className="flex items-center gap-1 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-background"
      onClick={() => setNewEventDialogOpen(true)}
    >
      <Plus />
      Add Event
    </Button>
  );
}
