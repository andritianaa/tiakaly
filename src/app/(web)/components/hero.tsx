"use client";

import { ArrowUpRight, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

import { FoodDesireSearch } from '@/app/(web)/components/food-desire-search';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

export default function Hero() {
  const { user, isLoading } = useUser();
  return (
    <div className="relative  pt-6 pb-16 sm:pb-24">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-yellow-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-yellow-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>

      {/* Cercle décoratif */}
      <div className="absolute -top-52 right-1/2 -z-10 transform translate-x-1/3 blur-3xl">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-amber-200 to-yellow-400 opacity-20"
          style={{
            clipPath: "circle(50% at 50% 50%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8  mt-32">
        {/* Titre principal et description */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl md:text-7xl fancyText">
            Bienvenue les tiakaly
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Les meilleurs plans bouffe de Madagascar. Découvrez des restaurants,
            des hôtels et des lieux incontournables à travers l'île.
          </p>

          <div
            className={cn(
              "mt-10 flex justify-center gap-6",
              isLoading || user ? "opacity-0" : ""
            )}
          >
            <Link href={"/auth/register"}>
              <Button
                size="lg"
                className="rounded-full text-base bg-primary hover:bg-primary/90 px-8"
              >
                Allons-y! <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base shadow-none px-8"
              >
                Inscription
              </Button>
            </Link>
          </div>
        </div>

        {/* Composant de recherche */}
        <div className="relative mx-auto max-w-5xl">
          {/* Icônes décoratives */}
          <div className="absolute -left-12 -top-12 hidden lg:block">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100/80 text-yellow-600">
              <UtensilsCrossed className="h-10 w-10" />
            </div>
          </div>

          <div className="absolute -right-8 -bottom-10 hidden lg:block">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100/80 text-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                />
              </svg>
            </div>
          </div>

          {/* Ombre portée */}
          <div
            className="absolute inset-0 -z-10 transform-gpu blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-amber-500 to-yellow-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          {/* Composant de recherche */}
          <div className="relative z-10 shadow-2xl rounded-2xl ">
            <FoodDesireSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
