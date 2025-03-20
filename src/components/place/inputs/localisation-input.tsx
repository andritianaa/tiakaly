"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LocalisationInputProps {
  value: string
  onChange: (value: string) => void
}

export function LocalisationInput({ value, onChange }: LocalisationInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="localisation">Localisation</Label>
      <Input
        id="localisation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Adresse du restaurant"
      />
    </div>
  )
}

