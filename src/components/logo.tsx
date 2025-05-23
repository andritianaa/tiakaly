"use client";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export type logoProps = {
  withName?: boolean;
  icon?: boolean;
  className?: string;
  nameClassName?: string;
};

export const Logo = ({ withName, icon, className }: logoProps) => {
  const { theme } = useTheme();
  const [url, seturl] = useState<string>();
  useEffect(() => {
    if (icon) {
      seturl("/logo.png");
    } else if (withName) {
      seturl("/logo-large.png");
    } else {
      seturl("/logo-round.png");
    }
  }, []);
  if (url) {
    return (
      <Link
        href="/"
        className={cn("h-10 flex items-center justify-center w-fit", className)}
      >
        <Image
          width={500}
          height={500}
          src={url}
          alt=""
          className="h-full w-auto"
        />
      </Link>
    );
  }
};
