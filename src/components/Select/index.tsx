import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFilter({
  options,
  label,
  value,
  onChange,
  className = "w-[180px]",
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  options: {
    id: string;
    value: string;
  }[];
  label: string;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
