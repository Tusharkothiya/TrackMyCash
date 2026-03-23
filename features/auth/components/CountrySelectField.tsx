"use client";

import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { getData } from "country-list";

type CountrySelectFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const countries = getData().map((country) => country.name).sort((a, b) => a.localeCompare(b));

export default function CountrySelectField({ value, onValueChange }: CountrySelectFieldProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-left text-sm text-black"
        aria-label="Country"
      >
        <Select.Value placeholder="Select Country" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="z-50 max-h-72 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-md">
          <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-zinc-600">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {countries.map((country) => (
              <Select.Item
                key={country}
                value={country}
                className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm text-black outline-none data-highlighted:bg-zinc-100"
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>{country}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-zinc-600">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
