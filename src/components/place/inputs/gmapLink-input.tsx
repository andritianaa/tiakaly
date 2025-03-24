"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GmapLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function GmapLinkInput({ value, onChange }: GmapLinkInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="gmaplink">Gmap Link</Label>
      <Input
        id="gmaplink"
        value={value}
        type="url"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Lien google map"
      />
    </div>
  );
}

export function GmapEmbedInput({ value, onChange }: GmapLinkInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="gmaplink">Gmap embed link</Label>
      <Input
        id="gmapembed"
        value={value}
        type="url"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Lien embed google map"
      />
    </div>
  );
}
