import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
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

const AVAILABLE_REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Australia",
  "Antarctica",
];

interface RegionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
}

export const RegionSelectionDialog = ({
  open,
  onOpenChange,
  selectedRegions,
  onRegionsChange,
}: RegionSelectionDialogProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleRegionSelect = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionsChange(selectedRegions.filter((r) => r !== region));
    } else {
      onRegionsChange([...selectedRegions, region]);
    }
  };

  const handleRemoveRegion = (region: string) => {
    onRegionsChange(selectedRegions.filter((r) => r !== region));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md z-[100000]"
        overlayClassName="z-[100000]"
      >
        <DialogHeader>
          <DialogTitle>Select Region</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((region) => (
              <Badge
                key={region}
                variant="secondary"
                className="gap-1 bg-purple-100 hover:bg-purple-200"
              >
                {region}
                <button
                  onClick={() => handleRemoveRegion(region)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between"
              >
                Choose region
                <X
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0 opacity-50",
                    popoverOpen && "rotate-90"
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 z-[1000000]">
              <Command>
                <CommandInput placeholder="Search regions..." />
                <CommandEmpty>No region found.</CommandEmpty>
                <CommandGroup>
                  {AVAILABLE_REGIONS.map((region) => (
                    <CommandItem
                      key={region}
                      value={region}
                      onSelect={() => handleRegionSelect(region)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRegions.includes(region)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {region}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] hover:scale-105 transition-all"
              onClick={() => onOpenChange(false)}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
