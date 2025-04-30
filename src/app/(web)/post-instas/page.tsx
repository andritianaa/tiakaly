"use client";

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { PostInstaCard } from '@/components/post-insta/post-insta-card';
import { Input } from '@/components/ui/input';
import { fetcher } from '@/lib/utils';

import type { PostInstaWithMain } from "@/types";

export default function PostInstasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts, isLoading } = useSWR<PostInstaWithMain[]>(
    `/api/post-instas`,
    fetcher
  );

  // Filtrer les posts en fonction de la requête de recherche
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.url.toLowerCase().includes(query) ||
        post.place?.title.toLowerCase().includes(query) ||
        post.place?.localisation.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="mt-20 w-full flex justify-center items-center flex-col px-4">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <p className="text-2xl font-bold -mb-4">Mes posts insta</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher sur insta..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {posts?.length === 0
                ? "Aucun post Instagram trouvé."
                : "Aucun résultat ne correspond à ta recherche, essayez autre chose !"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostInstaCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
