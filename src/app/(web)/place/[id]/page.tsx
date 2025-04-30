import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { use } from 'react';

import { getPlace } from '@/actions/place-actions';

import { PlaceDetailClient } from './details';

// Type pour les paramètres de la page
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
  const { success, place } = await getPlace(id);

  // Si le lieu n'est pas trouvé, retourner des métadonnées basiques
  if (!success || !place) {
    return {
      title: "Lieu non trouvé",
    };
  }

  // Obtenir les métadonnées par défaut des pages parentes
  const previousImages = (await parent).openGraph?.images || [];

  // Construire des métadonnées riches basées sur les données du lieu
  return {
    title: place.title,
    description: place.bio || `${place.title} - ${place.localisation}`,
    keywords: place.keywords,
    openGraph: {
      title: place.title,
      description:
        place.bio || `Découvrez ${place.title} à ${place.localisation}`,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/places/${place.id}`,
      images: [
        // Ajouter l'image principale si elle existe
        place.mainMedia?.url,
      ],
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: place.title,
      description: place.bio || `${place.title} - ${place.localisation}`,
      images: place.mainMedia?.url ? [place.mainMedia.url] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/places/${place.id}`,
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
        name: place.title,
        description: place.bio || place.content?.substring(0, 160),
        image: place.mainMedia?.url,
        address: {
          "@type": "PostalAddress",
          addressLocality: place.localisation,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: place.latitude,
          longitude: place.longitude,
        },
        priceRange: `${place.priceMin} - ${place.priceMax}`,
        ...(place.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating,
            bestRating: 5,
          },
        }),
        ...(place.instagramUrl && { sameAs: [place.instagramUrl] }),
      }),
    },
  };
}

// Le composant de page utilise le même type PageParams
export default function PlaceDetailPage({ params }: PageParams) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Use the use() hook to handle the Promise returned by getPlace
  const { success, place, error } = use(getPlace(id));

  if (!success || !place) {
    notFound();
  }

  const mediaItems = place.MediaPlace.map((mp) => mp.media);
  return (
    <>
      <PlaceDetailClient place={place} mediaItems={mediaItems} />
    </>
  );
}
