"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PriceRangeInputProps {
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
}

export function PriceRangeInput({ minValue, maxValue, onMinChange, onMaxChange }: PriceRangeInputProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0) {
      onMinChange(value)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0) {
      onMaxChange(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Plage de prix</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceMin">Prix minimum</Label>
          <Input id="priceMin" type="number" min="0" value={minValue} onChange={handleMinChange} />
        </div>
        <div>
          <Label htmlFor="priceMax">Prix maximum</Label>
          <Input id="priceMax" type="number" min="0" value={maxValue} onChange={handleMaxChange} />
        </div>
      </div>
    </div>
  )
}

