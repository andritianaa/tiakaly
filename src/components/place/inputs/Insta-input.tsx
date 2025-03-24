"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InstaLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function InstaLinkInput({ value, onChange }: InstaLinkInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="instalink">Instagram</Label>
      <Input
        id="instalink"
        value={value}
        type="url"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Lien post insta"
      />
    </div>
  );
}
