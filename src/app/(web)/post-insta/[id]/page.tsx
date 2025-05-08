import { ExternalLink, MapPin } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

import { getPostInstaById } from "@/actions/post-insta.actions";
import { InstagramEmbedWrapper } from "@/components/client-wrappers/instagram-embed-wrapper";
import { Button } from "@/components/ui/button";

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
  const { error, data: post } = await getPostInstaById(id);

  // Si le lieu n'est pas trouvé, retourner des métadonnées basiques
  if (error || !post) {
    return {
      title: "Lieu non trouvé",
    };
  }

  // Obtenir les métadonnées par défaut des pages parentes
  const previousImages = (await parent).openGraph?.images || [];

  // Construire des métadonnées riches basées sur les données du lieu
  return {
    title: post.title,
    description: `Découvrez ${post.title} sur Tiakaly`,
    keywords: ["Tiakaly", "Instagram", "Post", post.title],
    openGraph: {
      title: post.title,
      description: `Découvrez ${post.title} sur Tiakaly`,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`,
      images: [
        // Ajouter l'image principale si elle existe
        post.mainMedia?.url,
      ],
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: `Découvrez ${post.title} sur Tiakaly`,
      images: post.mainMedia?.url ? [post.mainMedia.url] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/post/${post.id}`,
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
        name: post.title,
        description: `Découvrez ${post.title} sur Tiakaly`,
        image: post.mainMedia?.url,
        ...(post.url && { sameAs: [post.url] }),
      }),
    },
  };
}

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
          <div className="flex flex-col items-center justify-center   rounded-lg">
            <div className="grid grid-cols-2 justify-center gap-2 max-w-xl mb-4">
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
