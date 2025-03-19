"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export type logoProps = {
  withName?: boolean;
  color?: "main" | "primary" | "dark" | "white" | "mainReverse";
  className?: string;
  nameClassName?: string;
};

export const Logo = ({
  withName,
  color = "main",
  className,
  nameClassName,
}: logoProps) => {
  const { theme } = useTheme();
  const [resolvedColor, setResolvedColor] = useState("");

  useEffect(() => {
    if (color === "main")
      setResolvedColor(theme === "dark" ? "#ffffff" : "#000000");
    else if (color === "mainReverse")
      setResolvedColor(theme === "dark" ? "#000000" : "#ffffff");
    else if (color === "primary") setResolvedColor("hsl(240, 76%, 54%)");
    else if (color === "dark") setResolvedColor("#000000");
    else if (color === "white") setResolvedColor("#ffffff");
  }, [theme]);

  return (
    <div
      className={cn("h-10 flex items-center justify-center w-fit", className)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M250 60H60L250 250H60L250 440H440L250 250H440L250 60Z"
          fill={resolvedColor}
          stroke={resolvedColor}
          strokeWidth="20"
        ></path>
      </svg>
      {withName && (
        <span
          className={cn(
            "pl-2 text-3xl font-bold tracking-tighter",
            nameClassName
          )}
          style={{
            color: resolvedColor,
          }}
        >
          Tiakaly
        </span>
      )}
    </div>
  );
};
