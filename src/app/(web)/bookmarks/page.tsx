import { BookmarkIcon, ImageIcon, ListIcon, MapPinIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import { getUserBookmarks } from '@/actions/bookmark-actions';
import { PlaceResume } from '@/components/place-resume';
import { PostInstaCard } from '@/components/post-insta/post-insta-card';
import { TopCard } from '@/components/top/top-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentSession } from '@/lib/current-user';

export default async function BookmarksPage() {
  const session = await currentSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { bookmarkedPosts, bookmarkedPlaces, bookmarkedTops, error } =
    await getUserBookmarks();

  const totalBookmarks =
    bookmarkedPosts.length + bookmarkedPlaces.length + bookmarkedTops.length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <BookmarkIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Mes favoris</h1>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : totalBookmarks === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Aucun favori
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Vous n'avez pas encore ajouté de favoris. Explorez les lieux, posts
            et tops pour en ajouter à votre collection.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>Tous ({totalBookmarks})</span>
            </TabsTrigger>
            <TabsTrigger
              value="places"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              <MapPinIcon className="h-4 w-4" />
              <span>Lieux ({bookmarkedPlaces.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Posts ({bookmarkedPosts.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="tops"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              <ListIcon className="h-4 w-4" />
              <span>Tops ({bookmarkedTops.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bookmarkedPlaces.map((place) => (
                <PlaceResume key={`place-${place.id}`} place={place} />
              ))}
              {bookmarkedPosts.map((post) => (
                <PostInstaCard key={`post-${post.id}`} post={post} />
              ))}
              {bookmarkedTops.map((top) => (
                <TopCard key={`top-${top.id}`} top={top} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="places">
            {bookmarkedPlaces.length === 0 ? (
              <div className="text-center py-8">
                <MapPinIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  Aucun lieu enregistré dans vos favoris
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarkedPlaces.map((place) => (
                  <PlaceResume key={place.id} place={place} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts">
            {bookmarkedPosts.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  Aucun post enregistré dans vos favoris
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarkedPosts.map((post) => (
                  <PostInstaCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tops">
            {bookmarkedTops.length === 0 ? (
              <div className="text-center py-8">
                <ListIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  Aucun top enregistré dans vos favoris
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarkedTops.map((top) => (
                  <TopCard key={top.id} top={top} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
