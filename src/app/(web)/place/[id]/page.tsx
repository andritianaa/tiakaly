import { use } from 'react';

import { getPlace } from '@/actions/place-actions';

import { PlaceDetailClient } from './details';

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise with use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Use the use() hook to handle the Promise returned by getPlace
  const { success, place, error } = use(getPlace(id));

  if (!success || !place) {
    return (
      <div className="container py-10">
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          {error || "Le lieu demandé n'a pas été trouvé"}
        </div>
      </div>
    );
  }

  const mediaItems = place.MediaPlace.map((mp) => mp.media);
  return (
    <>
      <PlaceDetailClient place={place} mediaItems={mediaItems} />
    </>
  );
}
