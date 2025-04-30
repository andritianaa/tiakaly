import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PostBookmark } from "@/components/bookmark/post-bookmark";

import type { PostInstaWithMain } from "@/types";

interface PostInstaCardProps {
  post: PostInstaWithMain;
}

export function PostInstaCard({ post }: PostInstaCardProps) {
  return (
    <div className="relative">
      <PostBookmark postId={post.id} />

      <Link
        href={`/post-insta/${post.id}`}
        key={post.id}
        className="relative  max-h-[35vh] min-h-[35vh] bg-muted transition-transform duration-300 hover:scale-105 "
      >
        <Image
          src={post.mainMedia.url || "/placeholder.svg"}
          width={500}
          height={500}
          alt={post.title}
          className="h-full w-full object-cover max-h-[35vh] min-h-[35vh] overflow-hidden rounded"
        />
        <div className=" bg-gradient-to-t  from-black to-transparent absolute bottom-0 left-0 w-full h-32"></div>
        <div className="absolute bottom-0 p-2 w-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-full">
                <div className="flex w-full flex-col items-start justify-start">
                  <h1 className="text-2xl font-bold flex items-center max-md:text-lg text-start text-white">
                    {post.title}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground text-white">
              {post.place && (
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{post.place.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
