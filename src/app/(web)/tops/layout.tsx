// app/(web)/tops/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvrez les classements de resto à Madagascar | Tiakaly",
  description:
    "Explorez nos sélections des meilleurs endroits, restaurants, hôtels et attractions à Madagascar. Classements réalisés par Tiakaly",
  keywords: [
    "top",
    "classement",
    "tiakaly",
    "meilleurs",
    "Madagascar",
    "Tiakaly",
    "restaurant",
    "hôtel",
    "lieu",
    "kaly",
    "spot",
  ],
  openGraph: {
    title: "Top classements des meilleurs lieux à Madagascar | Tiakaly",
    description:
      "Découvrez nos tops et classements des meilleurs endroits à Madagascar. Faites votre choix parmi les meilleures adresses sélectionnées par Tiakaly.",
    type: "website",
    url: "/tops",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Les meilleurs classements à Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top classements des meilleurs lieux à Madagascar | Tiakaly",
    description:
      "Découvrez nos tops et classements des meilleurs endroits à Madagascar. Faites votre choix parmi les meilleures adresses sélectionnées par Tiakaly.",
  },
  alternates: {
    canonical: "/tops",
  },
  // Ajouter les données structurées
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Collection de classements à Madagascar | Tiakaly",
      description:
        "Découvrez notre sélection de classements à Madagascar, compilée par Tiakaly.",
      url: "https://www.tiakaly.com/tops",
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
            name: "Tops",
            item: "https://www.tiakaly.com/tops",
          },
        ],
      },
    }),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
