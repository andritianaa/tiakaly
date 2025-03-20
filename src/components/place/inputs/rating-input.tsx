"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="space-y-2">
      <Label>Note</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={`h-6 w-6 ${
                (hoverRating || value) >= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{value} sur 5</span>
      </div>
    </div>
  )
}

