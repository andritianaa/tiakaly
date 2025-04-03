import { ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

import { getPostInstaById } from "@/actions/post-insta.actions";
import Footer from "@/app/(web)/components/footer";
import { InstagramEmbedWrapper } from "@/components/client-wrappers/instagram-embed-wrapper";
import { Button } from "@/components/ui/button";

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
      <div className="flex w-full justify-center mt-20">
        <div className="space-y-4 max-w-7xl w-full">
          <div className="flex justify-center gap-4">
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
              <Link href={`/place/${post.place.id}`}>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Voir : {post.place.title}</span>
                </Button>
              </Link>
            )}
          </div>
          <div className="flex justify-center bg-gray-50  rounded-lg">
            <InstagramEmbedWrapper
              url={post.url}
              className="w-full max-w-xl"
              igVersion=""
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
