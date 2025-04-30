"use client";

import { Compass } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import RecentPlaces from '@/app/(web)/components/recent-places';
import TopsSection from '@/app/(web)/components/top-section';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/utils';

import type { PostInstaWithMain, TopWithMain } from "@/types";
export default function RecentContent() {
  const [tops, setTops] = useState<TopWithMain[]>([]);
  const [posts, setPosts] = useState<PostInstaWithMain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [topsData, postsData] = await Promise.all([
          fetcher("/api/tops"),
          fetcher("/api/post-instas"),
        ]);

        setTops(topsData || []);
        setPosts(postsData || []);
      } catch (error) {
        console.error("Error fetching recent content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-slate-100 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
            INSPIREZ-VOUS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#47556c] to-[#2e3746]">
            Découvrez nos meilleures sélections
          </h2>
          <p className="text-foreground max-w-2xl mx-auto text-lg">
            Plongez dans un univers d'inspiration et d'aventures à travers nos
            tops soigneusement élaborés et nos posts Instagram captivants.
          </p>
        </div>

        {/* Section Tops */}
        <div className=" grid grid-cols-1 lg:grid-cols-2  gap-6">
          <TopsSection tops={tops} isLoading={false} />
          <RecentPlaces />
        </div>

        {/* Call to Action */}
        <div className="max-lg:mt-12 mt-24 bg-gradient-to-r from-[#47556c] to-[#2e3746] rounded-2xl p-10 text-primary-foreground text-center">
          <Compass className="h-16 w-16 mx-auto mb-6 text-white opacity-90" />
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white fancyText">
            Prêt à explorer ?
          </h3>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 text-white">
            Rejoignez notre communauté de voyageurs passionnés et découvrez des
            lieux extraordinaires à travers nos sélections exclusives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-600 hover:bg-gray-100 px-8"
            >
              <Link href="/tops">Explorer les tops</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 text-white"
            >
              <Link href="/post-instas">Voir les posts Instagram</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
