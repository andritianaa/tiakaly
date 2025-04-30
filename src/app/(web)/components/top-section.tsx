import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import Bounce from '@/components/bounce';
import { Button } from '@/components/ui/button';

interface Top {
  id: string;
  title: string;
  // Ajoutez d'autres propriétés selon votre modèle de données
}

interface TopsSectionProps {
  tops: Top[];
  isLoading: boolean;
}

export default function TopsSection({ tops, isLoading }: TopsSectionProps) {
  return (
    <Bounce>
      <div className="mb-24 max-lg:mb-8">
        {isLoading ? (
          <Bounce>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[45vh] bg-muted animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          </Bounce>
        ) : tops.length === 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-muted animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#47556c] to-[#2e3746] rounded-xl p-6 md:p-8 max-w-4xl mx-auto">
              <Bounce>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Les meilleurs du moments
                </h2>
              </Bounce>
              <Bounce>
                <p className="text-white mb-6">Tout mets tops!</p>
              </Bounce>
              <Bounce>
                <div className="space-y-4">
                  {tops.slice(0, 5).map((top, index) => (
                    <Bounce key={top.id}>
                      <Link
                        href={`/top/${top.id}`}
                        className="bg-white rounded-lg p-2 flex items-center transition-all duration-300 group cursor-pointer hover-lift"
                      >
                        <div
                          className={`
                    flex-shrink-0 size-10 rounded-full flex items-center justify-center font-bold text-2xl transition-transform duration-300 group-hover:scale-110
                    ${index === 0 ? "bg-yellow-300" : ""}
                    ${index === 1 ? "bg-pink-200" : ""}
                    ${index === 2 ? "bg-blue-500 text-white" : ""}
                    ${index === 3 ? "bg-orange-500 text-white" : ""}
                    ${index === 4 ? "bg-teal-200" : ""}
                  `}
                        >
                          {index + 1}
                        </div>
                        <div className="ml-4 py-3 font-medium group-hover:text-slate-700 group-hover:font-bold transition-all duration-300">
                          {top.title}
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:animate-pulse" />
                        </div>
                      </Link>
                    </Bounce>
                  ))}
                </div>
              </Bounce>
            </div>
            <Bounce>
              <div className="text-center mt-12 max-lg:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#47556c] hover:bg-[#2e3746] text-white px-8 py-6 rounded-full transition-all hover:shadow-lg hover:scale-105"
                >
                  <Link href="/tops" className="flex items-center text-lg">
                    Explorer tous nos tops
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Bounce>
          </>
        )}
      </div>
    </Bounce>
  );
}
