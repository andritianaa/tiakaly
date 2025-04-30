import { ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

import { getPostInstaById } from '@/actions/post-insta.actions';
import { PostBookmark } from '@/components/bookmark/post-bookmark';
import { InstagramEmbedWrapper } from '@/components/client-wrappers/instagram-embed-wrapper';
import { Button } from '@/components/ui/button';

export default function PostInstaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise with use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Use the use() hook to handle the Promise returned by getPostInstaById
  const { data: post, error } = use(getPostInstaById(id));

  if (error || !post) {
    notFound();
  }

  return (
    <>
      <div className="flex w-full justify-center mt-20 px-4">
        <div className="space-y-4 max-w-7xl w-full">
          <div className="flex flex-col items-center justify-center bg-gray-50  rounded-lg">
            <div className="grid grid-cols-2 lg:grid-cols-3 justify-center gap-2 max-w-xl mb-4">
              <PostBookmark postId={post.id} variant="button" />
              <Button variant="outline" asChild>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Voir sur Instagram
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
              {post.place && (
                <Link
                  href={`/place/${post.place.id}`}
                  className="col-span-2 lg:col-span-1 justify-self-center"
                >
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Voir : {post.place.title}</span>
                  </Button>
                </Link>
              )}
            </div>
            <InstagramEmbedWrapper
              url={post.url}
              className="w-full max-w-xl"
              igVersion=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
