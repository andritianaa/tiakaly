"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Assure-toi que tu as ce composant

interface OpenSundayInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function OpenSundayInput({ value, onChange }: OpenSundayInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="sunday-open">Ouvert le dimanche ?</Label>
      <br />
      <Switch
        id="sunday-open"
        checked={value}
        onCheckedChange={(checked) => onChange(checked)}
      />
    </div>
  );
}
