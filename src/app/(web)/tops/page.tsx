"use client";

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { TopCard } from '@/components/top/top-card';
import { Input } from '@/components/ui/input';
import { fetcher } from '@/lib/utils';

import type { TopWithMain } from "@/types";

export default function TopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tops, isLoading } = useSWR<TopWithMain[]>(`/api/tops`, fetcher);

  // Filtrer les tops en fonction de la requête de recherche
  const filteredTops = useMemo(() => {
    if (!tops) return [];
    if (!searchQuery.trim()) return tops;

    const query = searchQuery.toLowerCase();
    return tops.filter(
      (top) =>
        top.title.toLowerCase().includes(query) ||
        top.description.toLowerCase().includes(query)
    );
  }, [tops, searchQuery]);

  return (
    <div className="mt-20 w-full flex justify-center items-center flex-col px-4">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <p className="text-2xl font-bold -mb-4">Classement des meilleurs</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une top list..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredTops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tops?.length === 0
                ? "Aucune top liste trouvée."
                : "Aucun résultat ne correspond à ta recherche."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTops.map((top) => (
              <TopCard key={top.id} top={top} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
