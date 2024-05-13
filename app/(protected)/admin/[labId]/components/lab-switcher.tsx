"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Home, HomeIcon, PlusCircle, ScrollText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useLabModal } from "@/hooks/use-lab-modal"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface LabSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function LabSwitcher({ className, items = [] }: LabSwitcherProps) {
  const labModal = useLabModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentLab = formattedItems.find((item) => item.value === params.labId);

  const [open, setOpen] = React.useState(false)

  const onLabSelect = (lab: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/admin/${lab.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a lab"
          className={cn("relative w-full justify-between text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
            className)}
        >
          <Home className="mr-2 h-4 w-4" />

          <span className="inline-flex " >{currentLab?.label}</span>

          <ChevronsUpDown className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 opacity-100 sm:flex" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search lab..." />
            <CommandEmpty>No lab found.</CommandEmpty>
            <CommandGroup heading="Labaratory">
              {formattedItems.map((lab) => (
                <CommandItem
                  key={lab.value}
                  onSelect={() => onLabSelect(lab)}
                  className="text-sm"
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  {lab.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentLab?.value === lab.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  labModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                New Lab
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
