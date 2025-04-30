// app/(web)/map/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Carte interactive des meilleurs lieux à Madagascar | Tiakaly",
  description:
    "Explorez notre carte interactive de Madagascar et découvrez tous les restaurants, hôtels et attractions sélectionnés par Tiakaly. Planifiez facilement votre itinéraire.",
  keywords: [
    "carte",
    "map",
    "Madagascar",
    "lieux",
    "restaurants",
    "hôtels",
    "géolocalisation",
    "Tiakaly",
    "voyage",
    "tourisme",
  ],
  openGraph: {
    title: "Carte interactive de Madagascar | Tiakaly",
    description:
      "Découvrez tous les lieux sélectionnés par Tiakaly sur notre carte interactive de Madagascar. Trouvez facilement les meilleurs restaurants, hôtels et attractions.",
    type: "website",
    url: "/map",
    images: [
      {
        url: "/og.jpg", // Assurez-vous de créer cette image
        width: 1200,
        height: 630,
        alt: "Carte des meilleurs lieux à Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carte interactive de Madagascar | Tiakaly",
    description:
      "Découvrez tous les lieux sélectionnés par Tiakaly sur notre carte interactive de Madagascar. Trouvez facilement les meilleurs restaurants, hôtels et attractions.",
    images: ["/og.jpg"], // Assurez-vous de créer cette image
  },
  alternates: {
    canonical: "/map",
  },
  // Ajout de données structurées pour la page de carte
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MapLocation",
      name: "Carte des lieux Tiakaly à Madagascar",
      description:
        "Carte interactive montrant tous les restaurants, hôtels et attractions recommandés par Tiakaly à Madagascar.",
      url: "https://www.tiakaly.com/map",
      hasMap: {
        "@type": "Map",
        mapType: "VenueMap",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -18.91368, // Coordonnées approximatives du centre de Madagascar
        longitude: 47.53613, // Ajustez selon vos besoins
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "Madagascar",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "Tiakaly",
        url: "https://www.tiakaly.com",
      },
      potentialAction: {
        "@type": "ViewAction",
        target: "https://www.tiakaly.com/map",
        name: "Voir la carte",
      },
    }),
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
