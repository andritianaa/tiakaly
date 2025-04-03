/* eslint-disable @next/next/no-img-element */
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExternalLink, Trophy } from 'lucide-react';
import { use } from 'react';

import { getTopById } from '@/actions/top.actions';
import { InstagramEmbedWrapper } from '@/components/client-wrappers/instagram-embed-wrapper';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise with use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Use the use() hook to handle the Promise returned by getTopById
  const top = use(getTopById(id));

  // Helper function to render a post card
  const renderPostCard = (post: any, position: number, reason: string) => {
    if (!post) return null;

    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute top-2 right-2 bg-yellow-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            #{position}
          </div>
          {post.mainMedia && (
            <img
              src={post.mainMedia.url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <CardDescription>
            <p className="text-sm text-muted-foreground">{reason}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <InstagramEmbedWrapper
              url={post.url}
              className="w-full max-w-xl"
              igVersion=""
            />

            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Voir sur Instagram
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="flex w-full justify-center mt-20 ">
        <div className="flex flex-col space-y-6 max-w-7xl p-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold">{top.title}</h1>
                <p className="text-muted-foreground mt-1">
                  Créé le{" "}
                  {format(new Date(top.createdAt), "PPP", { locale: fr })}
                </p>
              </div>
            </div>

            <RichTextEditor
              content={top.description}
              readOnly
              className="p-0 border-none max-h-fit"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {renderPostCard(top.top1, 1, top.top1Reason)}
              {renderPostCard(top.top2, 2, top.top2Reason)}
              {renderPostCard(top.top3, 3, top.top3Reason)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
