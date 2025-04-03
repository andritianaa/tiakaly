import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

import type { TopWithMain } from "@/types";
interface TopCardProps {
  top: TopWithMain;
}

export function TopCard({ top }: TopCardProps) {
  return (
    <Link
      href={`/top/${top.id}`}
      key={top.title}
      className="relative overflow-hidden rounded max-h-[45vh] min-h-[45vh] bg-muted"
    >
      <Image
        src={top.mainMedia!.url}
        width={500}
        height={500}
        alt=""
        className="transition-transform duration-300 hover:scale-105 h-full w-full object-cover max-h-[45vh] min-h-[45vh]"
      />
      <div className="absolute bottom-0 p-2 w-full">
        <Card className="w-full h-fit">
          <CardContent className="p-4 max-md:p-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-full">
                  <div className="flex  w-full flex-col items-start justify-start">
                    <h1 className="text-2xl font-bold flex items-center max-md:text-lg text-start">
                      {top.title}
                    </h1>
                  </div>
                </div>
              </div>
              <p className="mb-2 line-clamp-2 max-md:hidden">
                {top.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
