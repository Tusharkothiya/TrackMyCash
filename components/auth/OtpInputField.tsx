"use client";

import { useRef } from "react";
import { OTPInput, SlotProps } from "input-otp";

function Slot({ char, isActive }: SlotProps) {
  return (
    <div
      className={`flex h-12 w-10 items-center justify-center rounded-md border text-lg font-semibold`}
    >
      {char ?? ""}
    </div>
  );
}

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function OtpInputField({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedText) {
      onChange(pastedText);
    }
  };

  return (
    <div ref={containerRef} onPaste={handlePaste}>
      <OTPInput
        maxLength={6}
        value={value}
        onChange={onChange}
        containerClassName="flex items-center justify-between gap-2 placeholder:text-white text-white!"
        render={({ slots }) => (
          <>
            {slots.map((slot, index) => (
              <Slot key={index} {...slot} />
            ))}
          </>
        )}
      />
    </div>
  );
}
