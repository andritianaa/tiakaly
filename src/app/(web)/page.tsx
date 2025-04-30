import Script from "next/script";

import RecentContent from "@/app/(web)/components/recent-content";
import { MouseAnimation } from "@/components/mouse-animation";

import Hero from "./components/hero";

export default async function RoutePage() {
  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tiakaly - Une histoire sans faim",
            "url": "https://www.tiakaly.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.tiakaly.com/places",
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://www.instagram.com/tiakaly",
              "https://www.facebook.com/tiakalymg"
            ]
          }
        `}
      </Script>
      <Script id="navigation-structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Carte",
                "url": "https://www.tiakaly.com/map"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Mes Tops",
                "url": "https://www.tiakaly.com/tops"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Endroits",
                "url": "https://www.tiakaly.com/endroits"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Posts Instagram",
                "url": "https://www.tiakaly.com/post-instas"
              }
            ]
          }
        `}
      </Script>

      <Hero />
      <MouseAnimation />
      <RecentContent />
      {/* <FAQ /> */}
      {/* <Testimonial /> */}
    </>
  );
}
