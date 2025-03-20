"use client"

import { Label } from "@/components/ui/label"
import { Status } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusInputProps {
  value: Status
  onChange: (value: Status) => void
}

export function StatusInput({ value, onChange }: StatusInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Status)}>
        <SelectTrigger id="status">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Status.published}>Publié</SelectItem>
          <SelectItem value={Status.draft}>Brouillon</SelectItem>
          <SelectItem value={Status.archived}>Archivé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

