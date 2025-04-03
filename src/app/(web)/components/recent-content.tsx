"use client";

import { ArrowRight, Compass, Instagram, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PostInstaCard } from '@/components/post-insta/post-insta-card';
import { TopCard } from '@/components/top/top-card';
import { Button } from '@/components/ui/button';
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious
} from '@/components/ui/carousel';
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
          <div className="inline-block bg-yellow-100 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
            INSPIREZ-VOUS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">
            Découvrez nos meilleures sélections
          </h2>
          <p className="text-foreground max-w-2xl mx-auto text-lg">
            Plongez dans un univers d'inspiration et d'aventures à travers nos
            tops soigneusement élaborés et nos posts Instagram captivants.
          </p>
        </div>

        {/* Section Tops */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] bg-border w-16"></div>
            <div className="flex items-center bg-yellow-50 px-6 py-3 rounded-full">
              <Star className="text-yellow-500 h-6 w-6 mr-3" />
              <h3 className="text-3xl font-bold text-foreground">
                Tops Tendance
              </h3>
            </div>
            <div className="h-[1px] bg-border w-16"></div>
          </div>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10 text-lg">
            Nos sélections exclusives des meilleurs lieux et expériences, créées
            par nos experts passionnés pour vous inspirer.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[45vh] bg-muted animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : tops.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <p className="text-muted-foreground text-lg">
                Nos tops sont en cours de création. Revenez bientôt pour
                découvrir nos sélections exclusives !
              </p>
            </div>
          ) : (
            <>
              <div className="relative px-4 md:px-10">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {tops.map((top) => (
                      <CarouselItem
                        key={top.id}
                        className="basis-full md:basis-1/2 lg:basis-1/3 pl-4"
                      >
                        <TopCard top={top} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 md:-left-5 h-12 w-12 bg-primary text-primary-foreground border-2 border-primary-foreground hover:bg-yellow-600 hover:text-white shadow-md" />
                  <CarouselNext className="right-0 md:-right-5 h-12 w-12 bg-primary text-primary-foreground border-2 border-primary-foreground hover:bg-yellow-600 hover:text-white shadow-md" />
                </Carousel>
              </div>

              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-yellow-500 text-primary-foreground px-8 py-6 rounded-full transition-all hover:shadow-lg"
                >
                  <Link href="/tops" className="flex items-center text-lg">
                    Explorer tous nos tops
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Section Posts Instagram */}
        <div>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] bg-border w-16"></div>
            <div className="flex items-center bg-pink-50 px-6 py-3 rounded-full">
              <Instagram className="text-pink-500 h-6 w-6 mr-3" />
              <h3 className="text-3xl font-bold text-foreground">
                Instagram Inspirations
              </h3>
            </div>
            <div className="h-[1px] bg-border w-16"></div>
          </div>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10 text-lg">
            Découvrez notre sélection des plus beaux moments capturés sur
            Instagram, pour vous donner envie de partir à l'aventure.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[45vh] bg-muted animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <p className="text-muted-foreground text-lg">
                Nos posts Instagram sont en cours de préparation. Revenez
                bientôt pour découvrir nos plus belles inspirations !
              </p>
            </div>
          ) : (
            <>
              <div className="relative px-4 md:px-10">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {posts.map((post) => (
                      <CarouselItem
                        key={post.id}
                        className="basis-full md:basis-1/2 lg:basis-1/3 pl-4"
                      >
                        <PostInstaCard post={post} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 md:-left-5 h-12 w-12 bg-pink-500 text-white border-2 border-white hover:bg-pink-600 hover:text-white shadow-md" />
                  <CarouselNext className="right-0 md:-right-5 h-12 w-12 bg-pink-500 text-white border-2 border-white hover:bg-pink-600 hover:text-white shadow-md" />
                </Carousel>
              </div>

              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-6 rounded-full transition-all hover:shadow-lg"
                >
                  <Link
                    href="/post-instas"
                    className="flex items-center text-lg"
                  >
                    Voir tous nos posts Instagram
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-10 text-primary-foreground text-center">
          <Compass className="h-16 w-16 mx-auto mb-6 text-white opacity-90" />
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
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
              className="bg-white text-amber-600 hover:bg-gray-100 px-8"
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
