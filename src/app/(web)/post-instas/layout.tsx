// app/(web)/post-instas/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts Instagram à ne pas manquer à Madagascar | Tiakaly",
  description:
    "Découvrez notre sélection de posts Instagram mettant en valeur les plus beaux endroits de Madagascar. Restaurants, hôtels et attractions touristiques en images.",
  keywords: [
    "Instagram",
    "posts",
    "Madagascar",
    "tiakaly",
    "Tiakaly",
    "voyage",
    "découverte",
    "photos",
    "kaly",
    "lieux",
  ],
  openGraph: {
    title: "Meilleurs posts Instagram de Madagascar | Tiakaly",
    description:
      "Explorez Madagascar à travers notre collection de posts Instagram soigneusement sélectionnés. Inspiration garantie pour votre prochain voyage !",
    type: "website",
    url: "/post-instas",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Posts Instagram de Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meilleurs posts Instagram de Madagascar | Tiakaly",
    description:
      "Explorez Madagascar à travers notre collection de posts Instagram soigneusement sélectionnés. Inspiration garantie pour votre prochain voyage !",
  },
  alternates: {
    canonical: "/post-instas",
  },
  // Ajouter les données structurées
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Collection de posts Instagram de Madagascar | Tiakaly",
      description:
        "Découvrez notre sélection de posts Instagram mettant en valeur la beauté de Madagascar.",
      url: "https://www.tiakaly.com/post-instas",
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
            name: "Posts Instagram",
            item: "https://www.tiakaly.com/post-instas",
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

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
