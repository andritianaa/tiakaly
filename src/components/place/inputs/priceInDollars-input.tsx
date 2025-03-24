"use client";

import { DollarSign } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';

interface PriceInDollarsInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function PriceInDollarsInput({
  value,
  onChange,
}: PriceInDollarsInputProps) {
  const [hoverPriceInDollars, setHoverPriceInDollars] = useState(0);

  return (
    <div className="space-y-2">
      <Label>Prix</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((priceindollars) => (
          <button
            key={priceindollars}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(priceindollars)}
            onMouseEnter={() => setHoverPriceInDollars(priceindollars)}
            onMouseLeave={() => setHoverPriceInDollars(0)}
          >
            <DollarSign
              color={`${
                (hoverPriceInDollars || value) >= priceindollars
                  ? "#facc15"
                  : "#9e958e"
              }`}
              className="size-6"
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value} sur 4
        </span>
      </div>
    </div>
  );
}
