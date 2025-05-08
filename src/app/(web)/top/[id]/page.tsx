import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExternalLink, Trophy } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { use } from "react";

/* eslint-disable @next/next/no-img-element */
import { getTopById } from "@/actions/top.actions";
import {
  FacebookEmbedWrapper,
  InstagramEmbedWrapper,
} from "@/components/client-wrappers/instagram-embed-wrapper";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type PageParams = {
  params: Promise<{ id: string }>;
};

// Pour satisfaire les contraintes de type de Next.js, nous devons utiliser
// exactement le même type pour generateMetadata et le composant de page
export async function generateMetadata(
  { params }: PageParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Attendre la résolution de params
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Obtenir les données du lieu
  const top = await getTopById(id);

  // Si le lieu n'est pas trouvé, retourner des métadonnées basiques
  if (!top) {
    return {
      title: "Top non trouvé",
    };
  }

  // Obtenir les métadonnées par défaut des pages parentes
  const previousImages = (await parent).openGraph?.images || [];

  // Construire des métadonnées riches basées sur les données du lieu
  return {
    title: top.title,
    description: `Découvrez ${top.title} sur Tiakaly`,
    keywords: ["Tiakaly", "Instagram", "top", top.title],
    openGraph: {
      title: top.title,
      description: `Découvrez ${top.title} sur Tiakaly`,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tops/${top.id}`,
      images: [
        // Ajouter l'image principale si elle existe
        top.mainMedia?.url,
      ],
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: top.title,
      description: `Découvrez ${top.title} sur Tiakaly`,
      images: top.mainMedia?.url ? [top.mainMedia.url] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/top/${top.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    // Ajouter des données structurées pour les rich results
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: top.title,
        description: `Découvrez ${top.title} sur Tiakaly`,
        image: top.mainMedia?.url,
      }),
    },
  };
}

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
      <Card className="overflow-hidden h-full">
        <div className="relative">
          <div className="absolute top-2 right-2 bg-slate-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
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
            {post.isFacebook ? (
              <FacebookEmbedWrapper
                url={post.url}
                className="w-full max-w-xl"
              />
            ) : (
              <InstagramEmbedWrapper
                url={post.url}
                className="w-full max-w-xl"
                igVersion=""
              />
            )}

            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  {`Voir sur ${post.isFacebook ? "Facebook" : "Instagram"}`}
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
      <div className="flex w-full justify-center mt-20">
        <div className="flex flex-col space-y-6 max-w-7xl p-4 w-full">
          <div className="space-y-6">
            <div className="flex justify-between">
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
            </div>
            <RichTextEditor
              content={top.description}
              readOnly
              className="p-0 border-none min-h-[30px]"
            />

            {/* Option de visualisation responsive - Grille pour les écrans moyens et grands, Carousel pour les petits */}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {renderPostCard(top.top3, 3, top.top3Reason)}
              {renderPostCard(top.top2, 2, top.top2Reason)}
              {renderPostCard(top.top1, 1, top.top1Reason)}
            </div>

            {/* Carousel seulement pour les écrans mobiles */}
            <div className="md:hidden relative">
              <Carousel
                opts={{
                  align: "center",
                }}
                className="w-full"
              >
                <CarouselContent>
                  <CarouselItem className="basis-full">
                    {renderPostCard(top.top3, 3, top.top3Reason)}
                  </CarouselItem>
                  <CarouselItem className="basis-full">
                    {renderPostCard(top.top2, 2, top.top2Reason)}
                  </CarouselItem>
                  <CarouselItem className="basis-full">
                    {renderPostCard(top.top1, 1, top.top1Reason)}
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-8 bg-primary text-primary-foreground border-2 border-primary-foreground hover:bg-slate-600 hover:text-white shadow-md" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-8 bg-primary text-primary-foreground border-2 border-primary-foreground hover:bg-slate-600 hover:text-white shadow-md" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
