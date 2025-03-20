"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Titre</Label>
      <Input id="title" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Nom du restaurant" />
    </div>
  )
}

