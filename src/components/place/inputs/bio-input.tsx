"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BioInput({ value, onChange }: BioInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Bio</Label>
      <Textarea
        id="bio"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Bio de l'endroit..."
      />
    </div>
  );
}
