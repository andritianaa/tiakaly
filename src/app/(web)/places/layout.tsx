// app/(web)/places/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Découvrir les meilleurs lieux à Madagascar | Tiakaly",
  description:
    "Explorez notre sélection des meilleurs restaurants, hôtels et attractions touristiques à Madagascar. Trouvez le lieu idéal pour votre prochain voyage ou sortie.",
  keywords: [
    "Madagascar",
    "lieux",
    "restaurants",
    "hôtels",
    "attractions",
    "tourisme",
    "voyage",
    "Tiakaly",
    "tiakaly",
    "kaly",
    "découverte",
  ],
  openGraph: {
    title: "Les meilleurs lieux à découvrir à Madagascar | Tiakaly",
    description:
      "Notre guide complet des incontournables à Madagascar : restaurants, hôtels, plages, parcs nationaux et bien plus encore. Planifiez votre voyage parfait !",
    type: "website",
    url: "/places",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Les meilleurs lieux à Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Les meilleurs lieux à découvrir à Madagascar | Tiakaly",
    description:
      "Notre guide complet des incontournables à Madagascar : restaurants, hôtels, plages, parcs nationaux et bien plus encore. Planifiez votre voyage parfait !",
  },
  alternates: {
    canonical: "/places",
  },
  // Ajouter les données structurées
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Collection de lieux à Madagascar | Tiakaly",
      description:
        "Découvrez notre sélection des meilleurs lieux à visiter à Madagascar.",
      url: "https://www.tiakaly.com/places",
      inLanguage: "fr-FR",
      isPartOf: {
        "@type": "WebSite",
        name: "Tiakaly",
        url: "https://www.tiakaly.com",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.tiakaly.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Lieux",
            item: "https://www.tiakaly.com/places",
          },
        ],
      },
    }),
  },
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
