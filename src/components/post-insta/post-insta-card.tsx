import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

import type { PostInstaWithMain } from "@/types";

interface PostInstaCardProps {
  post: PostInstaWithMain;
}

export function PostInstaCard({ post }: PostInstaCardProps) {
  return (
    <Link
      href={`/post-insta/${post.id}`}
      key={post.id}
      className="relative overflow-hidden rounded max-h-[45vh] min-h-[45vh] bg-muted"
    >
      <Image
        src={post.mainMedia.url || "/placeholder.svg"}
        width={500}
        height={500}
        alt={post.title}
        className="transition-transform duration-300 hover:scale-105 h-full w-full object-cover max-h-[45vh] min-h-[45vh]"
      />
      <div className="absolute bottom-0 p-2 w-full">
        <Card className="w-full h-fit">
          <CardContent className="p-4 max-md:p-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-full">
                  <div className="flex w-full flex-col items-start justify-start">
                    <h1 className="text-2xl font-bold flex items-center max-md:text-lg text-start">
                      {post.title}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {format(new Date(post.date), "PPP", { locale: fr })}
                  </span>
                </div>
                {post.place && (
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{post.place.title}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
