"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeInputProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function PriceRangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceRangeInputProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // If the input is empty, set value to 0
    if (inputValue === "") {
      onMinChange(0);
      return;
    }

    // Only process if it's a valid number
    const value = Number.parseInt(inputValue);
    if (!isNaN(value) && value >= 0) {
      onMinChange(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // If the input is empty, set value to 0
    if (inputValue === "") {
      onMaxChange(0);
      return;
    }

    // Only process if it's a valid number
    const value = Number.parseInt(inputValue);
    if (!isNaN(value) && value >= 0) {
      onMaxChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Plage de prix</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceMin">Prix minimum</Label>
          <Input
            id="priceMin"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Min"
            value={minValue === 0 ? "" : minValue}
            onChange={handleMinChange}
          />
        </div>
        <div>
          <Label htmlFor="priceMax">Prix maximum</Label>
          <Input
            id="priceMax"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max"
            value={maxValue === 0 ? "" : maxValue}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
}
