"use client";

import { RichTextEditor } from "@/components/rich-text-editor";
import { Label } from "@/components/ui/label";

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContentInput({ value, onChange }: ContentInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Description</Label>

      <RichTextEditor
        onChange={onChange}
        content={value}
        placeholder="Description détaillée du restaurant"
      />
    </div>
  );
}
