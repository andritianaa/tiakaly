"use client";

import { Check } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <Label>Note</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((rating) => (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Check
              color={`${
                (hoverRating || value) >= rating ? "#3df50a" : "#9e958e"
              }`}
              className="size-6"
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value} sur 3
        </span>
      </div>
    </div>
  );
}
