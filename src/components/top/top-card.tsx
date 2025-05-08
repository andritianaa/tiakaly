import Image from "next/image";
import Link from "next/link";


import type { TopWithMain } from "@/types";
interface TopCardProps {
  top: TopWithMain;
}

export function TopCard({ top }: TopCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <Link
        href={`/top/${top.id}`}
        key={top.title}
        className="relative  rounded-lg max-h-[40vh] min-h-[40vh] bg-muted hover:scale-105 transition-transform duration-300"
      >
        <Image
          src={top.mainMedia!.url}
          width={500}
          height={500}
          alt=""
          className="  h-full w-full object-cover max-h-[40vh] min-h-[40vh] overflow-hidden hover:scale-105 transition-transform duration-300"
        />
        <div className=" bg-gradient-to-t  from-black to-transparent absolute bottom-0 left-0 w-full h-40"></div>

        <div className="absolute bottom-0 p-2 w-full text-white">
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
            <p className="mb-2 line-clamp-2 max-md:hidden">{top.description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
